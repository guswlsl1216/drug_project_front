import { useEffect, useState } from "react";
import "../../styles/Store.css";
import { NavLink, Outlet, useOutletContext, useParams } from "react-router-dom";
import useFavoriteToggle from "./usefavoriteToggle";
import InteractionAnalysisModal from "../../components/ui/InteractionAnalysisModal";
import UseNavi from "../../utils/UseNavi";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import { useUser } from "../../components/context/UserContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import useLoginRedirect from "../../utils/useLoginRedirect";


const ProductDetail = () => {
  const { triggerUpdate, triggerCartUpdate } = useOutletContext();

  const {goodsId} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const {isFavorite, toggleFavoriteHandler, message, setIsFavorite} = useFavoriteToggle(false, goodsId);
  const {goTo} = UseNavi()
  const {user} = useUser()
  const { requireLogin } = useLoginRedirect();

  // 상호작용 분석 모달 열림 닫힘 관리 state
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const addRecentItem = (newItem) => {
    let items = sessionStorage.getItem("recentItems");
    items = items ? JSON.parse(items) : [];

    let newItems = items.filter(item => item.id !== newItem.id);
    
    newItems.unshift(newItem);

    if (newItems.length > 15) {
      newItems.pop();
    }

    sessionStorage.setItem("recentItems", JSON.stringify(newItems));
    triggerUpdate();
  }

  useEffect(() => {
    const ProductDetailandFavorite = async () => {
      await requestHandler({
        method: "get",
        url: `/goods/${goodsId}`,
        setLoading,
        onSuccess: (data) => {

          if (data && data.product) {
            const productData = data.product;

            setProduct(productData);

            // 찜 상태 세팅
            if (productData.is_favorite !== undefined) {
              setIsFavorite(productData.is_favorite);
            } else {
              setIsFavorite(false);
            }

            setError(null); // 에러 초기화
            addRecentItem(productData);
          } else {
            setProduct(null)
            setIsFavorite(false)
            setError("상품 데이터를 찾을 수 없습니다.");
          }
        },
        onError: (msg, err) => {
          console.error("상품 상세 정보 로딩 오류:", err);
          setProduct(null);
          setError(msg || "상품 정보를 불러오는 데 실패했습니다.");
        }
      })
    };

    ProductDetailandFavorite();
  }, [goodsId, setLoading, setProduct, setIsFavorite, setError]); // goodsId가 변경될 때마다 재실행


  const handleQuantityChange = (type) => {
    setQuantity(prevQuantity => {
      if(type === 'increment') { 
        // 재고가 있을 경우에만 증가(재고가 없으면 무한정 증가 방지)
        // 재고 상태 : product.stock
        const maxStock = product?.stock || Infinity;
        return prevQuantity < maxStock ? prevQuantity + 1 : prevQuantity;
      } else if (type === 'decrement') {
        // 최소 수량 1 미만으로 감소 방지
        return prevQuantity > 1 ? prevQuantity - 1 : 1;
      }
      return prevQuantity;
    })
  }

  const totalPrice = (product?.price || 0) * quantity;

  const handleCart = () => { // 재고 이상으로 계속 담겨서 수정 필요 일단 재고는 넘어가니까 다음 작업 
    // 여기 수정 후 에러남

    if (product.stock === 0 ) {
      alert("재고가 없습니다.");
      return;
    }
    
    requestHandler({
        method:"post",
        url:`cart/${goodsId}`,
        payload:{ count: quantity }, // 수량을 data에 담아서 보냄
        setLoading,
        onSuccess:(data) => {
          if (data.message) {
            alert(`${data.message}`);
          } else {
            alert(`총 ${data.count}개가 장바구니에 담겼습니다.`); 
          }
          triggerCartUpdate();
          console.log(data);
        },
        onError: (msg) => {
          alert(msg);
        }
    });  
  };

  const handleOrder = () => {
    requireLogin(() => {
      goTo("/orders", {
        buyer: {
          nickname: user?.nickname ?? "",
          tel: user?.tel ?? ""
        },
        items: [
          {
            goods_id: product.id,
            goods_name: product.goods_name,
            image_path: product.image_path,
            unit_price: product.price,
            count: quantity
          }
        ],
        total_price: totalPrice
      })
    })
  }


  if (loading) return <LoadingSpinner label="상품 상세 정보를 불러오는 중..." />
  if (error) return <div className="error-message">{error}</div>
  if (!product) return <div className="no-data">상품 정보를 찾을 수 없습니다.</div>

  const supplementIngredients = product.ingredients || [
    {name: "비타민C", amount: "1000mg"},
    {name: "징코", amount: "50mg"},
  ];
  
  return (
    <div className="product-detail-container">
      {/* 팝업 메시지 (훅에서 가져옴) */}
      {message && <div className="message-popup">{message}</div>}

      <div className="product-detail-card">
        {/* 1. 상품 상세 정보 섹션: 이미지 + 구매 정보 (detail-section) */}
        <div className="detail-section">
          {/* A. 제품 이미지 영역 */}
          <div className="detail-image-area">
            <img src={product.image_path} alt="[상품 상세 이미지]" />
          </div>

          {/* B. 제품 정보 및 구매 액션 영역 */}
          <div className="detail-info-area">
            {/* 제목 및 ID */}
            <h1 className="product-title">{product.goods_name}</h1>
            <p className="product-id">
              상품 ID: {product.id} | 카테고리: {product.category || "미분류"}
            </p>

            {/* 가격 */}
            <div className="price-section">
              <p className="product-price">
                {product.price ? product.price.toLocaleString() : "가격 미정"}원
              </p>
              <p>배송비 기본 2,500원 / 2만원 이상 구매 시 무료</p>
            </div>

            {/* 수량 및 합계 */}
            <div className="purchase-quantity">
              <label>구매 수량</label>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange("decrement")} disabled={quantity <= 1}>
                  -
                </button>
                <span>{quantity}</span> {/* */}
                <button
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= (product?.stock || Infinity)}
                >
                  +
                </button>
              </div>
              <p className="total-price">상품 금액 합계: {totalPrice.toLocaleString()}원</p>
            </div>

            {/* 구매 액션 버튼 */}
            <div className="purchase-options">
              <button className="add-to-cart-btn" onClick={handleCart}>장바구니 담기</button>
              
              <div className="buy-and-favorite-group"> 
                <Button
                  variant="text"
                  className="buy-now-btn"
                  onClick={handleOrder}
                >
                  바로구매
                </Button>

                <button
                  className={`favorite-icon-btn ${isFavorite ? "active" : ""}`}
                  onClick={toggleFavoriteHandler}
                >
                  {isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            {/* 복용 약물 상호작용 확인 (제품 핵심 기능) */}
            <button className="interaction-check-btn" onClick={() => setIsAnalysisModalOpen(true)}>
              내 복용약/영양제와 섭취 여부 확인하기
            </button>
          </div>
        </div>

        {/* 2. 상세 정보 및 리뷰 탭 섹션 */}
        <div className="tab-section">
          {/* 탭 네비게이션 */}
          <div className="tab-nav">
            <nav className="tab-links">
              <NavLink
                to={`/store/detail/${goodsId}/desc`}
                className={({isActive}) => (isActive ? "tab-link active" : "tab-link")}
              >
                <h2 className="tab-title-only">제품 상세 정보</h2>
              </NavLink>
              <NavLink
                to={`/store/detail/${goodsId}/review`}
                className={({isActive}) => (isActive ? "tab-link active" : "tab-link")}
              >
                <h2 className="tab-title-only">리뷰</h2>
              </NavLink>
              <NavLink
                to={`/store/detail/${goodsId}/qna`}
                className={({isActive}) => (isActive ? "tab-link active" : "tab-link")}
              >
                <h2 className="tab-title-only">Q&A</h2>
              </NavLink>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tab-content">
            <Outlet context={{product}} />
          </div>
        </div>
      </div>

      {/* 상호작용 분석 모달 컴포넌트 추가 */}
      <InteractionAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        supplementIdForAnalysis={product.id}
        supplementInfo={{
          id: product.id,
          name: product.goods_name,
          ingredients: supplementIngredients, // 상품 성분 정보 전달
        }}
      />
    </div>
  );
}

export default ProductDetail;