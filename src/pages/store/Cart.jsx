import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import requestHandler from "../../utils/requestHandler";
import "../../styles/cart/Cart.css";

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

  // 총 결제 금액
  const totalPrice = cartItem.reduce((acc, item) => acc + item.price * item.count, 0 );

  // 배송비
  const shipping = totalPrice >= 20000 ? 0 : 2500;


  return (
    <div className="cart-container">
      <h3>장바구니</h3>

      <div className="top-buttons">
        <Button onClick={toggleAll}>{allCheck ? "전체 해제" : "전체 선택"}</Button>
        <Button onClick={() => deleteGoods()}>삭제</Button>
      </div>

      {cartItem.map((item, i) => (

        <form action="" key={item.cart_id} className="cart-item">
          <input type="checkbox" checked={item.check || false} onChange={() => toggleCheck(i)}/>
          <div className="cart-info">
            <p>{i+1}</p>
            <img src={item.image_path} alt="상품이미지" />
            <p>{item.goods_name}</p>
          </div>

          <div className="count-box">
            <Button onClick={() => cahngeCount(i, 'minus')} disabled={item.count == 1}>-</Button>
            <div>{item.count}</div>
            <Button onClick={() => cahngeCount(i, 'plus')}>+</Button>
          </div>

          <div className="price-box">
            가격 {item.price}<br/>
            총 가격 {item.price*item.count} 원
          </div>
        </form>
      ))}

      <div className="summary">
        <div>
          <p className="summary-title">주문 예정 금액</p>
          
          <div className="summary-subtext">
            <span>총 상품금액 : </span>
            <h3 className="summary-price">{totalPrice}원</h3>
          </div>
            
          <div className="summary-subtext">
            <span>총 배송비 : </span>
            <h3 className="summary-price">{shipping}원 </h3>
          </div>        
        </div>

        <div className="summary-divider"></div>

        <div className="summary-final-section">
          <p className="summary-title">결제 예정 금액</p>
          <h2 className="summary-final-price">{totalPrice + shipping}원</h2>
          <p className="summary-info">
            ⓘ 쿠폰 및 적립금은 구매하기 버튼을 누른 후 주문서에서 적용하실 수 있습니다.
          </p>
        </div>

        <div className="summary-button-box">
          <Button onClick={()=>{goTo("/orders")}}>구매하기</Button>
        </div>

      </div>

    </div>
  )
} 

export default Cart;