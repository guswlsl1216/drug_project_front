import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import "../../styles/order/Payments.css"
import UseNavi from "../../utils/UseNavi";
import useLoginRedirect from "../../utils/useLoginRedirect";

const PaySuccess = () => {
  // 더미데이터
  const dummyOrderItems = [
    {
      id: 101,
      name: "프리미엄 에스프레소 블렌드 원두 500g",
      quantity: 2,
      price: "32,500원", // 개별 상품 가격
      totalPrice: 65000,
      thumbnailUrl: "/images/coffee_bean.jpg",
    },
    {
      id: 102,
      name: "친환경 스테인리스 텀블러 (500ml)",
      quantity: 1,
      price: "40,000원",
      totalPrice: 40000,
      thumbnailUrl: "/images/tumbler.jpg",
    },
  ];

  const { goIndex, goTo } = UseNavi();
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));
  const paymentKey = searchParams.get("paymentKey");

  // 주문 내역 미리보기 (개수 조절)
  const [orderItems, setOrderItems] = useState(dummyOrderItems);
  const DISPLAY_LIMIT = 1; // 화면에 보여줄 주문 목록 개수
  const itemsToDisplay = orderItems.slice(0, DISPLAY_LIMIT);
  const remainingItemsCount = orderItems.length - DISPLAY_LIMIT;

  useEffect(() => {
    const requestData = {
      orderId: orderId,
      amount: amount,
      paymentKey: paymentKey,
    };

    // 서버로 requestData 보냄
    // 서버 세션에 저장했던 orderId, amount와 비교하여 결과 프론트로 전송
    
    const payApprove = async () => {
      requireLogin(async () => {
        const response = requestHandler({
          method: "post",
          url: "/payments/approve",
          payload: requestData,
          setLoading,
          onSuccess: (data) => {
            console.log(data)
            // 여기서 받아온 payment 객체로 뿌려주기
          },
          onError: (msg) => {
            alert(msg);
            console.error(msg);
            goTo("/fail");
          }
        })
      })
    }
    payApprove();
  }, [])

  return (
    <>
      <div className="wrapper">
        <div className="payments_wrapper">
          <section className="payments_box_section">
            <div className="payments_title">
              <h2 className="paySuccess_title">결제 성공</h2>
            </div>
            <dl className="payments_description">
              <dt>주문번호</dt>
              <dd>{orderId}</dd>
              <dt>결제 금액</dt>
              <dd>{amount}</dd>
            </dl>
            <div className="order_items_list">
              <h3>주문 상품</h3>
              {
                itemsToDisplay.map((item) => (
                  <div key={item.id} className="order_item_card">
                    <p className="item_name">{item.name}</p>
                    <p className="item_details">
                      {item.price} / {item.quantity}개
                    </p>
                  </div>
                ))
              }
              {
                remainingItemsCount > 0 &&
                <button 
                  className="view_more_link" 
                  onClick={() => alert('주문내역 페이지 이동')}
                >
                  외 {remainingItemsCount}건 더 보기
                </button>
              }
            </div>
            <div className="payments_btn">
              <Button variant="primary" onClick={() => goIndex()}>홈으로</Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default PaySuccess;