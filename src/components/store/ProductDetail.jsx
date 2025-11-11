import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/Store.css";
import { useParams } from "react-router-dom";
import useFavoriteToggle from "../../pages/store/usefavoriteToggle";

const currentUserId = 1;

const ProductDetail = () => {
  const {goodsId} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {isFavorite, toggleFavoriteHandler, message, setIsFavorite} = useFavoriteToggle(false, goodsId);

  const checkFavoriteStatus = async () => {
    try {
      const res = await axiosInstance.get(`/favorite/check/${goodsId}`);
      setIsFavorite(res.data.is_favorite);
    } catch (e) {
      console.error("찜 상태 조회 실패:", e);
    }
  }

  useEffect(() => {
    const ProductDetailandFavorite = async () => {
      if (!goodsId) {
        setError("유효하지 않은 상품 ID입니다.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axiosInstance.get(`/goods/${goodsId}`);
        console.log("백엔드 응답 데이터 구조:", response.data)

        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          setError("상품 데이터를 찾을 수 없습니다.")
        }

        setError(null);
        await checkFavoriteStatus();
      } catch(err) {
        console.error("상품 상세 정보 로딩 오류:", err);
        setProduct(null);
        setError("상품 정보를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false);
      }
    };

    ProductDetailandFavorite(); // 상품 상세정보 및 찜 상태
  }, [goodsId, setIsFavorite]); // goodsId가 변경될 때마다 재실행


  if (loading) return <div className="loading-message">상품 상세 정보를 불러오는 중...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!product) return <div className="no-data">상품 정보를 찾을 수 없습니다.</div>

  return (
    <div className="product-detail-container">
      {/* 팝업 메시지 (훅에서 가져옴) */}
      {message && (
        <div className="message-popup">
          {message}
        </div>
      )}

      <div className="product-detail-card">
        
        {/* 1. 상품 상세 정보 섹션: 이미지 + 구매 정보 (detail-section) */}
        <div className="detail-section">
          
          {/* A. 제품 이미지 영역 */}
          <div className="detail-image-area">
            <span>[상품 상세 이미지]</span>
          </div>
          
          {/* B. 제품 정보 및 구매 액션 영역 */}
          <div className="detail-info-area">
            
            {/* 제목 및 ID */}
            <h1 className="product-title">
              {product.goods_name}
            </h1>
            <p className="product-id">상품 ID: {product.id} | 카테고리: {product.category || '미분류'}</p>
            
            {/* 가격 */}
            <div className="price-section">
              <p className="product-price">
                {product.price ? product.price.toLocaleString() : '가격 미정'}원
              </p>
              <p>배송비 기본 2,500원 / 2만원 이상 구매 시 무료</p>
            </div>
            
            {/* 수량 및 합계 */}
            <div className="purchase-quantity">
              <label>구매 수량</label>
              <div className="quantity-controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <p className="total-price">상품 금액 합계: {product.price ? product.price.toLocaleString() : '0'}원</p>
            </div>

            {/* 구매 액션 버튼 */}
            <div className="purchase-options">
              
              {/* 찜 버튼 */}
              <button 
                className={`favorite-toggle-btn ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavoriteHandler}>
                {isFavorite ? '❤️ 찜 목록에 있음' : '🤍 찜하기'}
              </button>

              <button className="add-to-cart-btn">
                장바구니 담기
              </button>
              
              <button className="buy-now-btn">
                바로구매
              </button>
            </div>
            
            {/* 복용 약물 상호작용 확인 (제품 핵심 기능) */}
            <button className="interaction-check-btn">
              내 복용약/영양제와 섭취 여부 확인하기
            </button>
          </div>
        </div>
        
        {/* 2. 상세 정보 및 리뷰 탭 섹션 */}
        <div className="tab-section">
          
          {/* 탭 네비게이션 */}
          <div className="tab-nav">
            <h2 className="tab-title-only">제품 상세 정보</h2>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tab-content">
            <div className="product-detail-content">
              <p>
                {product.goods_desc || '상세 설명이 준비되지 않았습니다.'}
                <br/><br/>
                <span className="font-semibold text-indigo-600">재고 현황:</span> {product.stock !== undefined ? `${product.stock}개` : '확인 불가'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;