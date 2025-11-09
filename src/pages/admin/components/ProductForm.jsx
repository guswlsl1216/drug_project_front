import { useEffect, useRef, useState } from "react"
import Editor from "./Editor"
import Changehandler from "../../../utils/Changehandler";
import Button from "../../../components/ui/Button";
import "./ProductForm.css"
import requestHandler from "../../../utils/requestHandler";
import UseNavi from "../../../utils/UseNavi";

const CATEGORIES = {
  기능성: ["남성", "여성", "장 건강 · 면역", "다이어트", "간 · 위 건강", "피부 · 미용", "구강케어", "혈당 · 혈압 · 콜레스테롤", "뼈 · 관절 건강", "피로 개선 · 활력", "눈 건강"],
  성분별: ["밀크시슬", "칼슘 · 마그네슘 · 아연", "비타민", "오메가 · 루테인", "홍삼 · 인삼", "프로바이오틱스 · 효소", "키즈", "기타"],
};

const ProductForm = ({title, method, url, initialData, onSaved}) => {
  const [goods, setGoods] = useState({
    goods_name: "",
    price: "",
    goods_desc: "",
    category: "",
    classify: "",
    stock: "",
    image_path: "",
    is_active: true
  })
  const {goTo} = UseNavi()
  const [loading,setLoading] = useState(false);
  const fileRef = useRef(null);
  const handleChange = Changehandler(setGoods);

  useEffect(() => {
    if(initialData) {
      setGoods((prev) => ({
        ...prev,
        ...initialData,
        price: initialData.price ?? "",
        stock: initialData.stock ?? "",
        is_active: Boolean(initialData.is_active)
      }))
    }
  }, [initialData])

  const classifyOptions =
  goods.category && CATEGORIES[goods.category]
    ? CATEGORIES[goods.category]
    : [];

  const submit = async (e) => {
    e.preventDefault(); 
    requestHandler({
      method,
      url,
      payload: goods,
      setLoading,
      onSuccess: (data) => {
        console.log("등록 성공:", data);
        alert(data.message);
        goTo("/admin/products"); 
        onSaved?.(data);
      },
      onError: (msg, err) => {
        console.error("등록 실패:", msg, err);
        alert(msg || "상품 등록 중 오류가 발생했습니다.");
      },
    })
  }

  const onPickImage = () => fileRef.current?.click();

  const imageSubmit = async (file) => {
    if(!file) return

    const fd = new FormData()
    fd.append("file", file)

    requestHandler({
      method: "post",
      url: "/admin/upload",
      payload: fd,
      userImage: true,
      setLoading,
      onSuccess: (res) => {
        const imagePath =
        res?.url || res?.path || res?.image_path || res?.data?.url || "";

        if (!imagePath) {
          alert("이미지 업로드 응답에 경로가 없습니다.");
          return;
        }
        setGoods((prev) => ({ ...prev, image_path: imagePath }));
        alert(res.message);
      },
      onError: (msg, err) => {
        console.error("이미지 업로드 실패:", msg, err);
        alert(msg || "이미지 업로드 중 오류가 발생했습니다.");
      },
    })
  }
  
  return(
    <div className="product-form">
      <h2>{title}</h2>

      <form onSubmit={submit}>
        <label>카테고리</label>
        <select name="category" value={goods.category} onChange={handleChange}>
          <option value="">카테고리를 선택하세요</option>
          {Object.keys(CATEGORIES).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>분류</label>
        <select
          name="classify"
          value={goods.classify}
          onChange={handleChange}
          disabled={!goods.category}
        >
          <option value="">
            {goods.category ? "분류를 선택하세요" : "카테고리를 먼저 선택하세요"}
          </option>
          {classifyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>


        <label>가격</label>
        <input
          type="number"
          name="price"
          value={goods.price}
          onChange={handleChange}
          required
        />

        <label>상품명</label>
        <input
          type="text"
          name="goods_name"
          value={goods.goods_name}
          onChange={handleChange}
          required
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => imageSubmit(e.target.files?.[0])}
        />

        <Button 
          type="button" 
          variant="outline" 
          className="mt-4 upload-btn"
          onClick={onPickImage}
          disabled={loading}
        >
          상품 이미지 등록
        </Button>
        
        {goods.image_path && (
          <div style={{ gridColumn: "2", marginTop: 8, fontSize: 13, opacity: 0.85 }}>
            등록된 이미지: <code>{goods.image_path}</code>
          </div>
        )}

        <label className="desc-label">상품 설명</label>
        {/* ✨ Editor 사용 */}
        <div className="editor-card">
          <Editor
            name="goods_desc"
            content={goods.goods_desc}
            onChange={handleChange}
          />
        </div>

        <label>재고</label>
        <input
          type="number"
          name="stock"
          value={goods.stock}
          onChange={handleChange}
          min={0}
          required
        />

        <div className="form-actions">
          <label className="inline">
            <input
              type="checkbox"
              name="is_active"
              checked={goods.is_active}
              onChange={(e) =>
                setGoods(prev => ({ ...prev, is_active: e.target.checked }))
              }
            />
            구매 가능(활성)
          </label>

          <Button 
            type="submit" 
            variant="primary" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "저장 중..." : "등록하기"}
          </Button>
        </div>
        
      </form>
    </div>
  )
}

export default ProductForm