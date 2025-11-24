import { useEffect, useState } from "react";
import GoodsList from "../../components/store/GoodsList";
import "../../styles/Store.css"
import { useOutletContext } from "react-router-dom";

const Ingredient = () =>{
  
  const ingredients = [
    "밀크시슬",
    "칼슘 · 마그네슘 · 아연",
    "비타민",
    "오메가 · 루테인",
    "홍삼 · 인삼",
    "프로바이오틱스 · 효소",
    "키즈",
    "기타"
  ]

  const [selectedCategory, setSelectedCategory] = useState(ingredients[0]); 
  const {resetSearchStates} = useOutletContext();

  const handleCategoryClick = (category) => {
    resetSearchStates();
    setSelectedCategory(category);
  }

  return (
    <>
      <div className="ingredient-container">
        <div className="category-grid">
          {ingredients.map((item, idx) => (
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
  )
}

export default Ingredient;