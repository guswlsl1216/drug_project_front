import { useEffect, useState } from "react";
import "../../styles/Store.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";


const ProductCard = ({ product, sortKey, ProductHandler }) => {
    // 초기 찜 상태는 product.is_favorite을 사용합니다.
    const { isFavorite, toggleFavoriteHandler, message } = useFavoriteToggle(
        product.is_favorite || false, // 초기 찜 상태
        product.id // 상품 ID
    ); 

    return (
        <div className="product-card" key={product.id}>
            
            {/* 팝업 메시지 (카드에 오버레이) */}
            {message && (
                <div className="message-popup is-card-message">
                    {message}
                </div>
            )}
            
            {/* 찜 버튼 위치 (이미지 영역에 오버레이) */}
            <div className="product-favorite-wrapper">
                <button 
                    className={`favorite-card-btn ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavoriteHandler} 
                    aria-label={isFavorite ? '찜 해제' : '찜 하기'}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            
            {/* 카드 클릭 시 상세 페이지 이동 핸들러는 이미지/정보 영역에 적용 */}
            <div onClick={() => ProductHandler(product.id)} className="product-card-clickable-area">
                <div className="product-image"></div>
                <div className="product-name">{product.goods_name}</div>
                <div className="product-price">{product.price ? product.price.toLocaleString() : '가격 미정'}원</div>
            </div>

            {/* 판매순 정보 */}
            {sortKey === 'sales' && product.sell_count !== undefined && <div className="product-sales-info">총 {product.sell_count}회 판매</div>}
        </div>
    );
};


const GoodsList = ({categoryKey, categoryValue}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 정렬 키 상태 (기본 값: 신상품순)
  const [sortKey, setSortKey] = useState('newest');

  const ProductHandler = (goodsId) => {
    navigate(`/store/detail/${goodsId}`);
  }

  // 상품 데이터를 서버에서 불러오는 함수
  const fetchProducts = async(currentSortKey, currentCategoryValue) => {
    setLoading(true);

    // api 호출 시 카테고리 값과 키를 쿼리 파라미터로 전달
    let apiUrl = `/goods?category_key=${categoryKey}&category_value=${currentCategoryValue}&sort_by=${currentSortKey }`;

    // 인기순일 경우 서버에 정렬 위임
    if (currentSortKey === 'popularity') {
      apiUrl += `&sort_by=popularity&order=desc`;
    }

    try {
      const response = await axiosInstance.get(apiUrl);
      setProducts(response.data.goods || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // categoryValue나 sortKey가 변경되면 데이터를 다시 불러오기
    fetchProducts(sortKey, categoryValue);
  }, [sortKey, categoryValue, categoryKey]);


  if (loading) return <div className="loading-message">상품 목록을 불러오는 중...</div>
  if (products.length === 0 && !loading) {
      return <div className="no-results">표시할 상품이 없습니다.</div>
  }


  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (key) => {
    setSortKey(key);
  };

  if (loading) return <div className="loading-message">상품 목록을 불러오는 중...</div>

  if (products.length === 0 && !loading) {
    return <div className="no-results">표시할 상품이 없습니다.</div>;
  }

  return(
    <>
    <div className="goods-list-container">
      <h3 className="goods-list-title">{categoryValue === 'All' ? '전체 상품' : `${categoryValue} 상품`} ({products.length}개)</h3>

      <div className="sort-buttons">
        <button onClick={() => handleSortChange('popularity')} className={sortKey === 'popularity' ? 'active' : ''}>
          인기순(1달)
        </button>
        <button onClick={() => handleSortChange('newest')} className={sortKey === 'newest' ? 'active' : ''}>
          신상품순
        </button>
        <button onClick={() => handleSortChange('sales')} className={sortKey === 'sales' ? 'active' : ''}>
          판매순(총 판매)
        </button>
        <button onClick={() => handleSortChange('price')} className={sortKey === 'price' ? 'active' : ''}>
          낮은가격순
        </button>
      </div>
    
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            kdy={product.id}
            product={product}
            sortKey={sortKey}
            ProductHandler={ProductHandler}/>
        ))}
      </div>
    </div>
    </>
  )
}

export default GoodsList;