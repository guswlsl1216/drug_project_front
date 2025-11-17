import { use, useEffect, useState } from "react"
import AddressPicker from "../../components/ui/AddressPicker"
import Button from "../../components/ui/Button"
import "../../styles/order/OrderSheet.css"
import PaymentsSheet from "./PaymentsSheet"
import { v4 as uuidv4 } from 'uuid';
import requestHandler from "../../utils/requestHandler"
import { useLocation } from "react-router-dom"
import Changehandler from "../../utils/Changehandler"
import useLoginRedirect from '../../utils/useLoginRedirect';

const OrderSheet = () => {
  const [loading, setLoading] = useState(false);
  const { requireLogin } = useLoginRedirect();

  const location = useLocation();
  const state = location.state || {};

  const buyer = state?.buyer || {};
  const items = state?.items || [];
  const totalPrice = state?.total_price ?? 0;

  const [order, setOrder] = useState({
    items_total: "", // 상품 총합
    shipping_fee: "", // 배송비
    used_points:"", // 사용 포인트
    final_amount: "", // 최종 결제 금액
    total_count:"",
    zipcode:"",
    address :"",
    address_detail :"",
    receiver: "",
    phone: ""
  })

  // db 저장용 orderItem 스테이트
  const [orderItem, setOrderItem] = useState([]);
  const [agree, setAgree] = useState(false)

  const calcShippingFee = (price) => {
    return price >= 20000 ? 0 : 2500;
  };
  
  const calcFinalAmount = () => {
    const p = Number(order.items_total || 0);
    const s = Number(order.shipping_fee || 0);
    const u = Number(order.used_points || 0);
    return p + s - u;
  };

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: calcFinalAmount(),
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  
    useEffect(() => {
      const processedItems = items.map(item => {
        return {
          goods_id: item.goods_id,
          count: item.count,
          unit_price: item.unit_price,
          subtotal: item.count * item.unit_price
        };
      });
      setOrderItem(processedItems)
    }, [items]);

  useEffect(() => {
    const fee = calcShippingFee(totalPrice);

    setOrder(prev => ({
      ...prev,
      items_total: totalPrice,
      shipping_fee: fee,
      final_amount: totalPrice + fee - (prev.used_points || 0),
    }));

    setAmount({
      currency: "KRW",
      value: calcFinalAmount(),
    });
  }, [totalPrice, calcFinalAmount()]);

  const requestPayHandler = async (orderId) => {
    requireLogin(async () => {
      if(!agree) {
        alert("결제 정보 확인 및 동의가 필요합니다.");
        return false;
      } else if(!order.receiver || !order.zipcode) {
        alert("수령인 정보를 입력해 주세요.");
        return false;
      } else if(!order.zipcode || !order.address || !order.address_detail) {
        alert("배송지 정보를 입력해 주세요.");
        return false;
      }
  
      const payInfo = {
        // 서버 세션에 저장 (검증용)
        orderId: orderId,
        amount: amount,
        // 주문 정보, 주문 항목
        order: order,
        orderItem: orderItem,
        // 배송지 저장 여부
        saveAddress : false // saveAddress
      };
  
      try {
        await requestHandler({
          method: "post",
          url: "/payments/ready",
          payload: payInfo,
          setLoading,
          onSuccess: (data) => {
            if (data && data.ok === false) {
              throw new Error(data.message || "주문 정보 저장 실패");
            }
            return true;
            // !!!구현 후 삭제!!!
            console.log(data);
          },
          onError: (msg) => {
            throw new Error(msg);
          }
        });
      } catch (e) {
        throw e;
      }
    });
  };

  // test
  useEffect(() => {
    console.log(orderItem)
  }, [])

  return(
    <>
      <h2 className="order-title">주문/결제</h2>
      <div className="order-sheet">
        <div className="order-left">
          <div className="card section-buyer">
            <h5 className="section-title">주문자</h5>
            <label className="field-label" htmlFor="buyer-name">이름</label>
            <input 
              className="field-input" 
              id="buyer-name" type="text" 
              name="nickname"
              defaultValue={buyer.nickname || ""}
            />

            <label className="field-label" htmlFor="buyer-tel">연락처</label>
            <input 
              className="field-input" 
              id="buyer-tel" type="tel" 
              name="tel" 
              defaultValue={buyer.tel || ""} 
            />
          </div>
          <div className="card section-shipping">
            <h5 className="section-title">배송지</h5>

            <div className="inline">
              <label className="field-label">배송지 선택</label>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
              <span className="switch-label">주문자 정보와 동일</span>
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
              주문상품 <span className="muted">{items.length}건</span>
            </h5>
            {items.length === 0 ? (
              <p className="muted">주문 상품이 없습니다.</p>
            ) : (
              items.map((item) => (
                <div className="item" key={item.goods_id}>
                  <img src={item.image_path} alt="상품 이미지" className="item-thumb" />
                  <div className="item-info">
                    <p className="item-name">
                      {item.goods_name}{" "}<span className="muted">{item.count}개</span>
                    </p>
                  </div>
                  <strong className="item-price" name="items_total">
                    {totalPrice.toLocaleString()}원
                  </strong>
                </div>
              ))
            )}
          </div>

          <div className="card section-points">
            <h5 className="section-title">적립금</h5>

            <div className="inline">
              <label className="field-label" htmlFor="point">적립금</label>
              <Button variant="secondary" className="ghost" >전액사용</Button>
            </div>

            <input 
              className="field-input" 
              id="used_points" type="number" 
              name="used_points"
              value={order.used_points} 
              onChange={Changehandler(setOrder)}
              placeholder="적립금" 
            />

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
            <strong className="price">{order.items_total.toLocaleString()}원</strong>
          </div>
          <div className="price-row">
            <span>총 배송비</span>
            <strong className="price-row">{order.shipping_fee.toLocaleString()}원</strong>
          </div>
          <div className="price-row total">
            <span>최종결제금액</span>
            <strong className="price">{calcFinalAmount().toLocaleString()}원</strong>
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
                
                const isReady = await requestPayHandler(orderId);

                if (isReady) {
                  await widgets.requestPayment({
                    orderId: orderId, // 주문번호
                    orderName: `${items[0].goods_name} 외 ${items.length}건`,
                    successUrl: window.location.origin + "/success",
                    failUrl: window.location.origin + "/fail",
                  })
                }
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