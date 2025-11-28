import { useOutletContext } from "react-router-dom";
import "../../styles/Store.css";


const ProductDescription = () => {
  const {product} = useOutletContext();

    if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;
    
    return (
        <div className="product-description-content">
            <div
                className="goods-desc"
                dangerouslySetInnerHTML={{ __html: product.goods_desc || "상세 설명이 준비되지 않았습니다." }}
            />
            <p>
                <span className="font-semibold text-indigo-600">재고 현황:</span> {product.stock !== undefined ? `${product.stock}개` : '확인 불가'}
            </p>
            {/* 추가적인 상세 정보 내용 */}
        </div>
    );
};

export default ProductDescription;