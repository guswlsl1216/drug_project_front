import ProductForm from "./components/ProductForm"

const ProductRegister = () => {
  
  return (
    <div>
      <ProductForm 
        title={"상품 등록"} 
        method={"post"} 
        url={"/admin/goods"}
      />
    </div>
  )
}

export default ProductRegister