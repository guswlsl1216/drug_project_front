import { useEffect, useState } from "react"
import AddressPicker from "../../components/ui/AddressPicker"
import Button from "../../components/ui/Button"
import "../../styles/order/OrderSheet.css"
import PaymentsSheet from "./PaymentsSheet"
import requestHandler from "../../utils/requestHandler"
import { useLocation } from "react-router-dom"
import Changehandler from "../../utils/Changehandler"
import useLoginRedirect from '../../utils/useLoginRedirect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

const OrderSheet = () => {
  const { requireLogin } = useLoginRedirect();

  const location = useLocation();
  const state = location.state || {};

  const buyer = state?.buyer || {};
  const items = state?.items || [];
  const totalPrice = state?.total_price ?? 0;

  const [order, setOrder] = useState({
    items_total: "", // 상품 총합
    shipping_fee: "", // 배송비
    used_points: 0, // 사용 포인트
    final_amount: "", // 최종 결제 금액
    total_count:"",
    zipcode:"",
    address :"",
    address_detail :"",
    address_extra: "",
    receiver: "",
    phone: ""
  })

  // db 저장용 orderItem 스테이트
  const [orderItem, setOrderItem] = useState([]);
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false);
  const [sameAsBuyer, setSameAsBuyer] = useState(false)
  const [point, setPoint] = useState(0)
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

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
        subtotal: item.count * item.unit_price,
        cart_id: item.cart_id
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
    return new Promise((resolve, reject) => {
      requireLogin(async () => {
        if(!agree) {
          alert("결제 정보 확인 및 동의가 필요합니다.");
          return resolve(false);
        } else if(!order.receiver || !order.phone) {
          alert("수령인 정보를 입력해 주세요.");
          return resolve(false);
        } else if(!order.zipcode || !order.address || !order.address_detail) {
          alert("배송지 정보를 입력해 주세요.");
          return resolve(false);
        }
    
        const payInfo = {
          // 서버 세션에 저장 (검증용)
          orderId: orderId,
          amount: amount,
          // 주문 정보, 주문 항목
          order: order,
          orderItem: orderItem,
          // 배송지 저장 여부
          saveAddress : saveAddress
        };
    
        try {
          await requestHandler({
            method: "post",
            url: "/payments/ready",
            payload: payInfo,
            setLoading,
            onSuccess: (data) => {
              if (data && data.ok === false) {
                return reject(new Error(data.message || "주문 정보 저장 실패"));
              }
            },
            onError: (msg) => {
              return reject(new Error(msg));
            }
          });
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    })
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
          address_detail: u.detail || ""
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

  const handleSameAsBuyerChange = async (e) => {
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
        address_detail: "",
        address_extra: ""     // 같이 초기화
      }))
    }
  }

  const allPoint = () => {
    const maxUsable = Math.min( point || 0, calcFinalAmount() || 0)

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

  const openAddressModal = async () => {
    await requestHandler({
      method: "get",
      url: "/orders/addresses",
      onSuccess: (data) => {
        setAddressList(data.addresses || [])
        setShowAddressModal(true)
      },
      onError:(msg) => alert(msg || "배송지 목록을 불러오지 못했습니다.")
    })
  }

  const handleSelectAddress = (addr) => {
    setOrder(prev => ({
      ...prev,
      receiver:addr.receiver || "",
      phone: addr.phone || "",
      zipcode: addr.zipcode || "",
      address: addr.address || "",
      address_detail: addr.address_detail || "",
      address_extra: addr.address_extra || ""
    }))
    setShowAddressModal(false)
  }

  const handleAddressChange = (next) => {
  setOrder(prev => ({
    ...prev,
    zipcode: next.postcode || "",
    address: next.road || next.jibun || next.display.raw || "",
    address_detail: next.detail || "",
    address_extra: next.extras || ""  
  }));
};

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

            <div className="shipping-header">
              <div className="inline shipping-select-row">
                <label className="field-label">배송지 선택</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={sameAsBuyer}
                    onChange={handleSameAsBuyerChange}
                  />
                  <span className="slider"></span>
                </label>
                <span className="switch-label">주문자 정보와 동일</span>
              </div>

              <Button
                variant="text"
                className="address-list-btn"
                onClick={openAddressModal}
              >
                배송지 목록에서 찾기
              </Button>
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
                jibun: order.address || "",
                extras: order.address_extra || "",   
                local: "",
                type: "",
                display: {
                  raw: order.address || "",
                  compact: order.address || ""
                },
                detail: order.address_detail || ""
              }}
              onChange={handleAddressChange}
            />
            <div className="inline save-address-inline">
              <input 
                type="checkbox" 
                className="save-address-checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                id="save-address"
              />
              <label htmlFor="save-address" className="save-address-label">기본 배송지에 저장</label>
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
                    {(item.unit_price * item.count).toLocaleString()}원
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
                // 주문번호 생성 (날짜시간 + 랜덤번호)
                const now = new Date();
                const datePart = [
                  now.getFullYear(),
                  String(now.getMonth() + 1).padStart(2, '0'),
                  String(now.getDate()).padStart(2, '0'),
                  String(now.getHours()).padStart(2, '0'),
                  String(now.getMinutes()).padStart(2, '0'),
                  String(now.getSeconds()).padStart(2, '0')
                ].join('');
                const randomPart = String(Math.floor(Math.random() * 9000) + 1000);
                const orderId = datePart + randomPart;
                
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
            {loading ? "구매중..." : "구매하기"}
          </Button>
        </div>
        {showAddressModal && (
          <div className="address-modal-backdrop">
            <div className="address-modal">
              <h4>배송지 선택</h4>
              {addressList.length === 0 ? (
                <p>사용 가능한 배송지가 없습니다.</p>
              ) : (
                addressList.map((addr, idx) => (
                  <button
                    key={idx}
                    className="address-item"
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <div>{addr.receiver} / {addr.phone}</div>
                    <div>{addr.zipcode} {addr.address}</div>
                    <div>{addr.address_detail}</div>
                    <div>{addr.address_extra}</div>
                  </button>
                ))
              )}
              <Button onClick={() => setShowAddressModal(false)}>닫기</Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderSheet