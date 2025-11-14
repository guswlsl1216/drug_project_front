import { useState } from "react"
import AddressPicker from "../../components/ui/AddressPicker"
import Button from "../../components/ui/Button"
import "../../styles/order/OrderSheet.css"
import PaymentsSheet from "./PaymentsSheet"
import { v4 as uuidv4 } from 'uuid';
import requestHandler from "../../utils/requestHandler"

const OrderSheet = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({
    total_price : "",
    total_count:"",
    zipcode:"",
    address :"",
    address_detail :"",
    receiver: "",
    phone: ""
  })

  const [orderItem, setOrderItem] = useState({
    unit_price : "",
    count : "",
    subtotal : ""
  })

  const [agree, setAgree] = useState(false)

  // console.log(order.zipcode)
  // console.log(order.address)
  // console.log(order.address_detail)

  const [amount, setAmount] = useState({
    currency: "KRW",
    // !!!OrderSheet 완성 후 수정!!!
    value: 100,  // order.total_price
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  const requestPayHandler = async (orderId) => {
    // 결제 요청 전 서버로 orderId, amount 보내놓기 => 서버 세션 저장
    const payInfo = {
      orderId: orderId,
      amount: amount
    };

    requestHandler({
      method: "post",
      url: "/payments/ready",
      payload: payInfo,
      setLoading,
      onSuccess: (data) => {
        // !!!구현 후 삭제!!!
        console.log(data);
      },
      onError: (msg) => {
        console.error(msg);
      }
    });
  };

  return(
    <>
      <h2 className="order-title">주문/결제</h2>
      <div className="order-sheet">
        <div className="order-left">
          <div className="card section-buyer">
            <h5 className="section-title">주문자</h5>
            <label className="field-label" htmlFor="buyer-name">이름</label>
            <input className="field-input" id="buyer-name" type="text" name="nickname"/>

            <label className="field-label" htmlFor="buyer-tel">연락처</label>
            <input className="field-input" id="buyer-tel" type="tel" name="tel" />
          </div>
          <div className="card section-shipping">
            <h5 className="section-title">배송지</h5>

            <div className="inline">
              <label className="field-label">배송지 선택</label>
              <Button variant="secondary" className="ghost">
                주문자 정보와 동일
              </Button>
            </div>

            <label className="field-label" htmlFor="receiver">받으시는 분</label>
            <input className="field-input" id="receiver" type="text" name="receiver" />

            <label className="field-label" htmlFor="receiver-phone">연락처</label>
            <input className="field-input" id="receiver-phone" type="tel" name="phone" />

            <label className="field-label">주소</label>
            <AddressPicker 
              className="checkout" 
              onChange={(next) => {
                setOrder(prev => ({
                  ...prev,
                  zipcode: next.postcode || "",
                  address: next.road || next.jibun || next.display.raw || "",
                  address_detail: next.detail || ""
                }))
              }}
            />
          </div>

          <div className="card section-items">
            <h5 className="section-title">
              주문상품 <span className="muted">몇건</span>
            </h5>

            <div className="item">
              <img src={null} alt="상품 이미지" className="item-thumb" />
              <div className="item-info">
                <p className="item-name">
                  상품명 <span className="muted">구매한 수량</span>
                </p>
              </div>
              <strong className="item-price">가격원</strong>
            </div>
          </div>

          <div className="card section-points">
            <h5 className="section-title">적립금</h5>

            <div className="inline">
              <label className="field-label" htmlFor="point">적립금</label>
              <Button variant="secondary" className="ghost" >전액사용</Button>
            </div>

            <input className="field-input" id="point" type="number" name="point" placeholder="적립금" />

            <p className="muted">
              보유 적립금 
              <strong>&nbsp;0원</strong>
            </p>
          </div>

          <div className="card section-payments">
            <h5 className="section-title">결제수단</h5>
            <div className="payments-box">
              <PaymentsSheet
                amount={amount}
                setAmount={setAmount}
                setReady={setReady}
                widgets={widgets}
                setWidgets={setWidgets}
                order = {order}
              />
            </div>
          </div>
        </div>

        <div className="card section-summary">
          <h5 className="section-title">주문 예정 금액</h5>

          <div className="price-row">
            <span>총 상품금액</span>
            <strong className="price">구매한 가격</strong>
          </div>
          <div className="price-row">
            <span>총 배송비</span>
            <strong className="price-row">배송비</strong>
          </div>
          <div className="price-row total">
            <span>최종결제금액</span>
            <strong className="price">가격+배송비</strong>
          </div>

          <label className="agree">
            <input 
              type="checkbox" 
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              구매하실 상품의 결제정보를 확인하였으며, 구매진행에 동의합니다.
              <em className="required">필수</em>
            </span>
          </label>

          <Button
            variant="primary"
            className="buy-btn"
            disabled={!agree || !ready}
            onClick={async () => {
              try {
                const orderId = uuidv4();
                
                await requestPayHandler(orderId);

                await widgets.requestPayment({
                  // ===== 위 form에서 받아올 정보들 =====
                  // sdk 문서 보면서 추가할 거 있는지 확인해도 될 듯
                  orderId: orderId,
                  orderName: "토스 티셔츠 외 2건", // `${첫번째상품명} 외 2건`
                  successUrl: window.location.origin + "/success",
                  failUrl: window.location.origin + "/fail",
                  customerName: "김토스", // order.receiver
                  customerMobilePhone: "01012341234", // order.phone
                })
              } catch (e) {
                alert(e);
                console.error(e);
              }
            }}
          >
            구매하기
          </Button>
        </div>

      </div>
    </>
  )
}

export default OrderSheet