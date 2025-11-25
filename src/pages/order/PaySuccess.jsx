import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import "../../styles/order/Payments.css"
import UseNavi from "../../utils/UseNavi";
import useLoginRedirect from "../../utils/useLoginRedirect";
import LoadingSpinner from "../../utils/LoadingSpinner";

const PaySuccess = () => {
  const { goTo } = UseNavi();
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));
  const paymentKey = searchParams.get("paymentKey");
  
  const [orderItems, setOrderItems] = useState(null);
  const [tossData, setTossData] = useState(null);
  
  // 주문 내역 미리보기 (개수 조절)
  const DISPLAY_LIMIT = 1; // 화면에 보여줄 주문 목록 개수

  const itemsToDisplay = useMemo(() => {
    if (!orderItems) return [];
    return orderItems.slice(0, DISPLAY_LIMIT);
  }, [orderItems, DISPLAY_LIMIT]);

  const remainingItemsCount = useMemo(() => {
    if (!orderItems) return 0;
    return orderItems.length - DISPLAY_LIMIT;
  }, [orderItems, DISPLAY_LIMIT])

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
        requestHandler({
          method: "post",
          url: "/payments/approve",
          payload: requestData,
          setLoading,
          onSuccess: (data) => {
            console.log(data)
            setTossData(data)
            setOrderItems(data.order_items)
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
            {
              !tossData || loading ? LoadingSpinner({ size:80 })
              : (
                <>
                  <div className="payments_title">
                    <h2 className="paySuccess_title">결제가 완료되었습니다</h2>
                  </div>
                  <dl className="payments_description">
                    <dt>주문번호</dt>
                    <dd>{tossData.order_code}</dd>
                    <dt>결제 금액</dt>
                    <dd>{tossData.final_amount.toLocaleString()}원</dd>
                  </dl>
                  <div className="order_items_list">
                    <h3>주문 상품</h3>
                    {
                      itemsToDisplay.map((item) => (
                        <div key={item.id} className="order_item_card">
                          <p className="item_name">{item.goods.name}</p>
                          <p className="item_details">
                            {item.goods.price.toLocaleString()}원 / {item.count}개
                          </p>
                        </div>
                      ))
                    }
                    {
                      remainingItemsCount > 0 &&
                      <button 
                        className="view_more_link" 
                        onClick={() => goTo("/myOrderList")}
                      >
                        외 {remainingItemsCount}건 더 보기
                      </button>
                    }
                  </div>
                  <div className="payments_btn">
                    <Button variant="secondary" onClick={() => goTo("/store/allgoods")}>쇼핑 계속하기</Button>
                    <Button variant="primary" onClick={() => goTo("/myOrderList")}>주문 내역</Button>
                  </div>
                </>
              )}
          </section>
        </div>
      </div>
    </>
  )
}

export default PaySuccess;