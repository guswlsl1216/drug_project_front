import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import requestHandler from "../../utils/requestHandler";
import "../../styles/cart/Cart.css";
import useLoginRedirect from "../../utils/useLoginRedirect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../utils/LoadingSpinner";

const Cart = () => {
  
  const [cartItem, setCartItem] = useState([]);
  const {goTo} = UseNavi(); // 결제로 이동하기 위함
  const [loading, setLoading] = useState(false);
  const {user, setUser, isLoggedIn} = useUser(); // 로그인 한 사람만 접근 가능
  const [allCheck, setAllCheck] = useState(false); // 전체 선택 
  const { requireLogin } = useLoginRedirect();
  

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

  if (loading) return <div><LoadingSpinner size={30} label="장바구니 제품을 불러오는 중 ..." /></div>

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

  const checkedItems = cartItem.filter(item => item.check);

  // .some : 배열 안에 특정 조건을 만족하는 요소가 "하나라도 있는지" 검사하는 역할
  const hasSoldOutSelected = checkedItems.some(item => {
    const stock = item.stock ?? 0
    return stock <= 0 || item.is_active === false
  })

  // 총 결제 금액
  const selectedTotalPrice = checkedItems.reduce(
    (acc, item) => acc + item.price * item.count, 0 
  );

  // 배송비
  const shipping = selectedTotalPrice === 0
    ? 0
    : selectedTotalPrice >= 20000
    ? 0 : 2500

  const ordershandle = () => {
    requireLogin(() => {
      const checkedItems = cartItem.filter(item => item.check);
      if (checkedItems.length === 0) {
        alert("구매할 상품을 선택해 주세요.");
        return;
      }

      const hasSoldOut = checkedItems.some(item => {
        const stock = item.stock ?? 0
        return stock <= 0 || item.is_active === false
      })

      if (hasSoldOut) {
        alert("품절된 상품이 포함되어 있습니다. 품절 상품을 선택 해제하거나 삭제해 주세요.")
      }

      const orderItems = checkedItems.map(item => ({
        goods_id: item.goods_id,       // 장바구니 데이터 구조에 맞게 'goods_id' 사용
        goods_name: item.goods_name,
        image_path: item.image_path,
        unit_price: item.price,
        count: item.count
      }))

      const total_price = orderItems.reduce(
        (acc, item) => acc + item.unit_price * item.count,0
      );

      goTo("/orders", {
        buyer: {
          nickname: user?.nickname ?? "",
          tel: user?.tel ?? ""
        },
        items: orderItems,
        total_price
      })
    }, false)
  }

  if (!loading && cartItem.length === 0) {
    return (
      <div className="cart-empty">
        <FontAwesomeIcon icon={faBasketShopping} className="empty-cart-icon" />
        <h3>장바구니에 담김 상품이 없습니다.</h3>
        <p>원하는 상품을 장바구니에 담아보세요.</p>
        <Button 
          onClick={() => goTo("/store/allgoods")}
          className="empty-cart-btn"
        >
          상품 보러가기
        </Button>
      </div>
    )
  }


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
            <h3 className="summary-price">{selectedTotalPrice.toLocaleString()}원</h3>
          </div>
            
          <div className="summary-subtext">
            <span>총 배송비 : </span>
            <h3 className="summary-price">{shipping.toLocaleString()}원 </h3>
          </div>        
        </div>

        <div className="summary-divider"></div>

        <div className="summary-final-section">
          <p className="summary-title">결제 예정 금액</p>
          <h2 className="summary-final-price">{(selectedTotalPrice + shipping).toLocaleString()}원</h2>
          <p className="summary-info">
            ⓘ 쿠폰 및 적립금은 구매하기 버튼을 누른 후 주문서에서 적용하실 수 있습니다.
          </p>
        </div>

        <div className="summary-button-box">
          <Button 
            onClick={ordershandle}
            disabled={checkedItems.length === 0 || hasSoldOutSelected}
          >
            { hasSoldOutSelected ? "품절 상품 포함" :"구매하기"}
          </Button>
        </div>

      </div>

    </div>
  )
} 

export default Cart;