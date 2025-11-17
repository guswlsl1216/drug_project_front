import { useEffect, useState } from "react"
import AddressPicker from "../../components/ui/AddressPicker"
import Button from "../../components/ui/Button"
import "../../styles/order/OrderSheet.css"
import { useLocation } from "react-router-dom"
import Changehandler from "../../utils/Changehandler"
import requestHandler from "../../utils/requestHandler"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

const OrderSheet = () => {
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

  const [orderItem, setOrderItem] = useState({
    unit_price : "",
    count : "",
    subtotal : ""
  })

  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false);
  const [sameAsBuyer, setSameAsBuyer] = useState(false)
  const [point, setPoint] = useState(0)
  const [saveAddress, setSaveAddress] = useState(false);

  const calcShippingFee = (price) => {
    return price >= 20000 ? 0 : 2500;
  };

  useEffect(() => {
    const fee = calcShippingFee(totalPrice);

    setOrder(prev => ({
      ...prev,
      items_total: totalPrice,
      shipping_fee: fee,
      final_amount: totalPrice + fee - (prev.used_points || 0)
    }));
  }, [totalPrice]);

  const calcFinalAmount = () => {
    const p = Number(order.items_total || 0);
    const s = Number(order.shipping_fee || 0);
    const u = Number(order.used_points || 0);
    return p + s - u;
  };

  const orderMe = async () => {
    await requestHandler({
      method : "get",
      url: "/orders/user",
      setLoading,
      onSuccess: (data) => {
        const u = data.user

        setOrder(prev => ({
          ...prev,
          receiver:u.nickname || "",
          phone: String(u.tel || ""),
          zipcode: u.zipcode || "",
          address: u.address || "",
          address_detail: u.detailed_address || ""
        }))
      },
      onError: (msg) => {
        alert(msg)
        setSameAsBuyer(false);
      }
    })
  }

  const fetchUserInfo = async () => {
    await requestHandler({
      method: "get",
      url: "/orders/user",
      setLoading,
      onSuccess: (data) => {
        const u = data.user;
        setPoint(u.point ?? 0);   // 적립금만!
      }
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSameAsBuyeerChange = async (e) => {
    const checked = e.target.checked;
    setSameAsBuyer(checked)

    if (checked) {
      await orderMe()
    } else {
      setOrder(prev => ({
        ...prev,
        receiver: "",
        phone: "",
        zipcode: "",
        address: "",
        address_detail: ""
      }))
    }
  }

  const allPoint = () => {
    const maxUsable = Math.min( point || 0, totalPrice || 0)

    setOrder(prev => ({
      ...prev,
      used_points: maxUsable
    }))

  }

  const resetPoint = () => {
    setOrder(prev => ({
      ...prev,
      used_points: 0
    }))
  }

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
                <input 
                  type="checkbox" 
                  checked={sameAsBuyer}
                  onChange={handleSameAsBuyeerChange}
                />
                <span className="slider"></span>
              </label>
              <span className="switch-label">주문자 정보와 동일</span>
            </div>

            <label className="field-label" htmlFor="receiver">받으시는 분</label>
            <input 
              className="field-input" id="receiver" 
              type="text" name="receiver" 
              value={order.receiver}
              onChange={Changehandler(setOrder)}
              placeholder="받으시는 분 "
            />

            <label className="field-label" htmlFor="receiver-phone">연락처</label>
            <input 
              className="field-input" id="receiver-phone" 
              type="tel" name="phone"
              value={order.phone}
              onChange={Changehandler(setOrder)}
              placeholder="휴대폰 번호 "
            />

            <label className="field-label">주소</label>
            <AddressPicker 
              className="checkout" 
              value={{
                postcode: order.zipcode || "",
                road: order.address || "",
                jibun: "",
                extras: "",
                local: "",
                type: "",
                display: {
                  raw: order.address || "",
                  compact: order.address || ""
                },
                detail: order.address_detail || ""
              }}
              onChange={(next) => {
                setOrder(prev => ({
                  ...prev,
                  zipcode: next.postcode || "",
                  address: next.road || next.jibun || next.display.raw || "",
                  address_detail: next.detail || ""
                }))
              }}
            />
            <div className="inline save-address-inline">
              <input 
                type="checkbox" 
                className="save-address-checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                id="save-address"
              />
              <label htmlFor="save-address" className="save-address-label">배송지 저장</label>
            </div>
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

            <div className="inline points-inline">
              <div className="points-box">
                <span className="point-label">사용</span>
                <div className="point-right">
                  <input
                    className="point-input"
                    id="used_points"
                    type="text"
                    name="used_points"
                    value={order.used_points}
                    onChange={Changehandler(setOrder)}
                    placeholder="0"
                    disabled={!point}
                  />
                  <span className="point-unit">원</span>
                  <Button 
                    variant="text"
                    onClick={resetPoint}
                    className="point-reset-btn"
                    disabled={!point}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    <span className="blind">입력내용 삭제</span>
                  </Button>
              </div>
              </div>
              <Button 
                variant="secondary" 
                className="ghost point-use-all" 
                onClick={allPoint}
                disabled={!point}
              >
                전액사용
              </Button>
            </div>


            <p className="muted">
              보유 적립금 <strong>&nbsp;{(point ?? 0).toLocaleString()}원</strong>
            </p>
          </div>

          <div className="card section-payments">
            <h5 className="section-title">결제수단</h5>
            <div className="pay-grid">
              <Button variant="text" className="pay-btn" >
                토스페이
              </Button>
              <Button variant="text" className="pay-btn" >
                카카오페이
              </Button>
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

          <Button variant="primary" className="buy-btn" disabled={!agree} >
            {loading ? "구매중..." : "구매하기"}
          </Button>
        </div>

      </div>
    </>
  )
}

export default OrderSheet