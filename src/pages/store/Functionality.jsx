import { useState } from "react";
import GoodsList from "../../components/store/GoodsList";
import "../../styles/Store.css"

const Functionality = () => {

  const categories = [
    "간 · 위 건강",
    "구강케어",
    "눈 건강",
    "다이어트",
    "뼈 · 관절 건강",
    "남성",
    "여성",
    "장 건강 · 면역",
    "피로 개선 · 활력",
    "피부·미용",
    "혈당 · 혈압 · 콜레스테롤"
  ]
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); 

  const handleCategoryClick = (category) => {
        setSelectedCategory(category);
  }

  return (
    <>
    <div className="functionality-container">
      <div className="category-grid">
        {categories.map((item, idx) => (
          <div 
            className={`category-item ${selectedCategory === item ? 'category-active' : ''}`}
            key={idx}
            onClick={() => handleCategoryClick(item)}
          >
            {item}
          </div>
        ))}
      </div>

      <hr className="functionality-hr"/>

      <GoodsList
          categoryKey="classify" // DB 컬럼명에 맞게 조정 필요
          categoryValue={selectedCategory}
      />
    </div>
    
    </>
  );
};

export default Functionality;