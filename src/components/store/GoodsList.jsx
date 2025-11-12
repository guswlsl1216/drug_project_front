import { useEffect, useMemo, useState } from "react";
import "../../styles/Store.css";
import axios from "axios";

const GoodsList = ({categoryKey, categoryValue}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 정렬 키 상태 (기본 값: 신상품순)
  const [sortKey, setSortKey] = useState('newest');

  // 상품 데이터를 서버에서 불러오는 함수
  const fetchProducts = async(currentSortKey, currentCategoryValue) => {
    setLoading(true);

    // api 호출 시 카테고리 값과 키를 쿼리 파라미터로 전달
    let apiUrl = `/api/goods?category_key=${categoryKey}&category_value=${currentCategoryValue}`;

    // 인기순일 경우 서버에 정렬 위임
    if (currentSortKey === 'popularity') {
      apiUrl += `&sort_by=popularity&order=desc`;
    }

    try {
      const response = await axios.get(apiUrl);
      setProducts(response.data);
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

  // 프론트엔드 정렬 로직
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products];

    // 인기순일 때는 이미 서버에서 정렬되어 왔다고 가정하고 프론트 정렬을 스킵
    if (sortKey === 'popularity') {
      return sortableProducts;
    }

    if (sortKey === 'newest') {
      // 신상품순 (created_at) 내림차순
      sortableProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    else if (sortKey === 'price'){
      // 낮은가격순 (price) 오름차순
      sortableProducts.sort((a, b) => a.price - b.price);
    }
    else if (sortKey === 'sales') {
      // 판매순 (sell_count) 내림차순
      sortableProducts.sort((a, b) => b.sell_count - a.sell_count);
    }

    return sortableProducts;
  }, [products, sortKey]);


  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (key) => {
    setSortKey(key);
  };

  if (loading) return <div className="loading-message">상품 목록을 불러오는 중...</div>

  if (sortedProducts.length === 0 && !loading) {
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
        {sortedProducts.map(product => (
          <div className="product-card" key={product.상품_id}>
            <div className="product-image"></div>
            <div className="product-name">{product.상품명}</div>
            <div className="product-price">{product.가격 ? product.가격.toLocaleString() : '가격 미정'}원</div>
            {sortKey === 'sales' && <div className="product-sales-info">총 {product.판매된_횟수}회 판매</div>}
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default GoodsList;