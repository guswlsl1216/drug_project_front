import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/Store.css";
import { NavLink, Outlet, useParams } from "react-router-dom";
import useFavoriteToggle from "./usefavoriteToggle";
import requestHandler from "../../utils/requestHandler";


const ProductDetail = () => {
  const { goodsId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewInfo, setReviewInfo] = useState({ 'length': 0, 'star_avg': 0 });

  const { isFavorite, toggleFavoriteHandler, message, setIsFavorite } = useFavoriteToggle(false, goodsId);


  useEffect(() => {
    const ProductDetailandFavorite = async () => {
      try {
        const response = await axiosInstance.get(`/goods/${goodsId}`)
        console.log("백엔드 응답 데이터 구조:", response.data)

        if (response.data && response.data.product) {
          const productData = response.data.product;

          setProduct(productData)
          if (productData.is_favorite !== undefined) {
            setIsFavorite(productData.is_favorite)
          } else {
            setIsFavorite(false)
          }
        } else {
          setError("상품 데이터를 찾을 수 없습니다.")
        }

        setError(null);
      } catch (err) {
        console.error("상품 상세 정보 로딩 오류:", err);
        setProduct(null);
        setError("상품 정보를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false);
      }

    };

    ProductDetailandFavorite(); // 상품 상세정보 및 찜 상태
  }, [goodsId, setIsFavorite]); // goodsId가 변경될 때마다 재실행

  const getInfo = async () => {
    const res = await requestHandler({
      method: "get",
      url: "/review/goodsReviewInfo/" + goodsId
    })
    console.log(res.data['info'])
    setReviewInfo(res.data['info'])
  }
  useEffect(() => {
    getInfo()
  }, [])

  const handleQuantityChange = (type) => {
    setQuantity(prevQuantity => {
      if (type === 'increment') {
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
            <img src={product.image_path} alt="[상품 상세 이미지]" />
          </div>

          {/* B. 제품 정보 및 구매 액션 영역 */}
          <div className="detail-info-area">

            {/* 제목 및 ID */}
            <div className="d-flex align-items-center gap-2">
              <h1 className="product-title">
                {product.goods_name}
              </h1>
              <span className="text-warning fw-bold">
                ⭐ {reviewInfo['star_avg']}점
              </span>
            </div>
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
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  disabled={quantity <= 1}>
                  -
                </button>
                <span>{quantity}</span> {/* */}
                <button
                  onClick={() => handleQuantityChange('increment')}
                  disabled={quantity >= (product?.stock || Infinity)}>
                  +
                </button>
              </div>
              <p className="total-price">상품 금액 합계: {totalPrice.toLocaleString()}원</p>
            </div>

            {/* 구매 액션 버튼 */}
            <div className="purchase-options">

              <button className="add-to-cart-btn">
                장바구니 담기
              </button>

              <div className="buy-and-favorite-group">
                <button className="buy-now-btn">
                  바로구매
                </button>

                <button
                  className={`favorite-icon-btn ${isFavorite ? 'active' : ''}`}
                  onClick={toggleFavoriteHandler}>
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
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
            <nav className="tab-links">
              <NavLink to={`/store/detail/${goodsId}/desc`} className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                <h2 className="tab-title-only">제품 상세 정보</h2>
              </NavLink>
              <NavLink to={`/store/detail/${goodsId}/review`} className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                <h2 className="tab-title-only">리뷰({reviewInfo['length']})</h2>
              </NavLink>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tab-content">
            <Outlet context={{ product }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;