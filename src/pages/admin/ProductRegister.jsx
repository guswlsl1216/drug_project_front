import ProductForm from "./components/ProductForm"

const ProductRegister = () => {
  
  return (
    <div>
      <ProductForm 
        title={"상품 등록"} 
        method={"post"} 
        url={"/admin/goods"}
        imgbtn={"상품 이미지 등록"}
        btn={"등록하기"}
      />
    </div>
  )
}

export default ProductRegister