import { useState } from "react";
import Changehandler from "../../utils/Changehandler";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import "../../styles/ContactUs.css"

const INQUIRY_TYPES = [
    {value:'', label:'선택하세요'},
    {value:'product', label:'상품문의'},
    {value:'order', label:'주문/배송문의'},
    {value:'system', label:'시스템 오류 신고'},
    {value:'etc', label:'기타'}
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    type:'',
    title:'',
    content:''
  })
  
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFormChange = Changehandler(setFormData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    setError(null);

    if (!formData.name || !formData.email || !formData.type || !formData.title || !formData.content){
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    await requestHandler({
      method:'post',
      url:'/inquiry/contact',
      data: formData,
      setLoading,
      onSuccess: (data) => {
        setFormMessage(data.message);
        setFormData({
          name:'', email:'', type:'', title:'', content:'',
        });
      },
      onError:(msg) => {
        setError(msg || "문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    })
  }

  return(
    <>
    <div className="contact-container">
      <h2>고객 문의하기</h2>
      <p className="contact-description">
        문의하신 내용은 영업일 기준 1~2일 내에 답변을 드립니다. 급한 사항은 FAQ를 먼저 확인해 주세요.
      </p>

      {formMessage && <div className="success-message">{formMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="inquiry-form">
        <div className="form-group">
          <label htmlFor="name">이름 *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} disabled={loading} />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일 *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} disabled={loading} />
        </div>
        <div className="form-group">
          <label htmlFor="type">문의 유형</label>
          <select name="type" id="type" value={formData.type} onChange={handleFormChange} disabled={loading}>
            {INQUIRY_TYPES.map(option => (
              <option key={option.value} value={option.value} disabled={option.value === ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">제목 *</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} disabled={loading}/>
        </div>
        <div className="form-group">
          <label htmlFor="content">내용 *</label>
          <textarea type="text" id="content" name="content" rows="5" value={formData.content} onChange={handleFormChange} disabled={loading}/>
        </div>
        <div className="form-group privacy-consent">
          <input type="checkbox" id="privacy" required />
          <label htmlFor="privacy">개인정보 수집 및 이용에 동의합니다. *</label>
        </div>

        <Button type='submit' disabled={loading}>
          {loading ? '접수 중...' : '문의 접수하기'}
        </Button>
      </form>
    </div>
    
    </>
  )
}

export default ContactUs;