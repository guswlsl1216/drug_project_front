import "../../styles/Store.css"
import GoodsList from "../../components/store/GoodsList";

const Allgoods = () => {
    return(
      <div className="allgoods-container">
        {/* 전체 상품을 의미하는 'All' 값을 전달 */}
        <GoodsList 
          categoryKey="전체" 
          categoryValue="All" 
        />
      </div>
    )
}

export default Allgoods;