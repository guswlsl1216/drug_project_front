import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import requestHandler from "../../utils/requestHandler";

const Cart = () => {
  
  const [cartItem, setCartItem] = useState([]);
  const {goTo} = UseNavi(); // 결제로 이동하기 위함
  const [loading, setLoading] = useState(false);
  const {user, setUser, isLoggedIn} = useUser(); // 로그인 한 사람만 접근 가능
  const [allCheck, setAllCheck] = useState(false); // 전체 선택 
  

  // 장바구니 목록 가져오기
  useEffect(() => {
    const getCart = async () => {
      await requestHandler ({
        method: "get",
        url: '/cart',
        setLoading,
        onSuccess: (data) => {
          console.log("백엔드 응답 데이터 구조: ",data)

          if (data) {
            setCartItem(data.map(item => ({ ...item, check:false})));
          }
        },
        onError: (msg) => {
          console.error("장바구니 정보 로딩 실패: ", msg)
        }
      });
    };
    getCart();
  },[]);

  if (loading) return <div>장바구니 제품을 불러오는 중 ...</div>

  // 수량 변경
  const cahngeCount = async (i, action) => {    
    const item = cartItem[i]
    item.count += (action == 'plus' ? 1 : -1 );

    await requestHandler ({
      method:'put',
      url:`/cart/${item.cart_id}`,
      payload: {action: action},
      onSuccess: (data) => {
        console.log(data)
        setCartItem(prev => 
          prev.map(ci => ci.cart_id === item.cart_id ? {...ci, count:item.count} : ci)
        );
      },
      onError: (msg) => {
        console.error("장바구니 수량 변경 실패 : ",msg)
      }
    });
  };

  // 전체 선택
  const toggleAll = () => {
    const allChecked = !allCheck;
    setAllCheck(allChecked);

    setCartItem(prev => 
      prev.map(item => ({
        ...item,
        check: allChecked
      }))
    );
  };

  // 개별 선택
  const toggleCheck = (i) => {
    setCartItem(prev => 
      prev.map((item, index) => 
        index === i ? {...item, check: !item.check} : item
      )
    );
  };

  // 삭제
  const deleteGoods = async () => {
    const checked = cartItem.filter(item => item.check);
    
    if (checked.length === 0) {
      alert('삭제 할 상품을 선택하세요.');
      return;
    }

    // 백엔드에 선택 괸 항목 각 각 삭제 요청
    for (const item of checked) {
      await requestHandler ({
        method:'delete',
        url:`/cart/${item.cart_id}`,
      });
    }

    // 프론트 리스트에서 제거
    setCartItem(prev => prev.filter(item => !item.check));
  };

  return (
    <>
      <h3>장바구니 페이지</h3>
      <Button onClick={toggleAll}>{allCheck ? "전체 해제" : "전체 선택"}</Button>
      <Button onClick={() => deleteGoods()}>삭제</Button>
      {cartItem.map((item, i) => (

        <form action="" key={item.cart_id}>
          <input type="checkbox" checked={item.check || false} onChange={() => toggleCheck(i)}/>
          <div>
            <p>{i+1}</p>
            <img src={item.image_path} alt="상품이미지" />
            <p>{item.goods_name}</p>
          </div>
          <div>
            <Button onClick={() => cahngeCount(i, 'minus')} disabled={item.count == 1}>-</Button>
            <div>{item.count}</div>
            <Button onClick={() => cahngeCount(i, 'plus')}>+</Button>
          </div>
          <div>가격 {item.price} 총 가격 {item.price*item.count} 원</div>
        </form>
      ))}
      <h3>총 구매 수량 : {cartItem.reduce((acc, item) => acc + item.count, 0)}개</h3>
      <h3>전체 제품 총 가격 : {cartItem.reduce((acc, item) => acc + item.price * item.count, 0 )}원</h3>
    </>
  )
} 

export default Cart;