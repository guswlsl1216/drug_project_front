import { useParams } from "react-router-dom"
import ProductForm from "./components/ProductForm"
import { useEffect, useState } from "react"
import requestHandler from "../../utils/requestHandler"
import Spinner from "../../components/ui/Spinner"

const ProductEdit = () => {
  const {id} =  useParams()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    requestHandler({
      method:"get",
      url : `/admin/goods/${id}`,
      onSuccess: (data) => setInitialData(data.goods),
      onError: (msg) => alert(msg),
    })
  }, [id])

  
  return (
    <div>
      {initialData ? (
        <ProductForm
          title={"상품 수정"} 
          method={"put"} 
          url={`/admin/edit/${id}`}
          initialData={initialData} 
          imgbtn={"상품 이미지 변경"}
          btn={"수정하기"}
        />
      ) : (
        <div className="loading">
          <Spinner size={28} showLabel label="상품 정보를 불러오는 중..." />
        </div>
      )}
    </div>
  )
}

export default ProductEdit