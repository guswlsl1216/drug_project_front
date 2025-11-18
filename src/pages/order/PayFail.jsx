import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import "../../styles/order/Payments.css"
import UseNavi from "../../utils/UseNavi";
import LoadingSpinner from "../../utils/LoadingSpinner";

const PayFail = () => {
  const { goBack } = UseNavi();

  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <>
      <div className="wrapper">
        <div className="payments_wrapper">
          <section className="payments_box_section">
            <div className="payments_title">
              <h2 className="payFail_title">결제가 완료되지 않았습니다</h2>
            </div>
            <dl className="payments_description">
              <dt>에러 코드</dt>
              <dd>{errorCode}</dd>
              
              <dt>실패 사유</dt>
              <dd>{errorMessage}</dd>
            </dl>
            <div className="payments_btn">
              <Button variant="primary" onClick={() => goBack()}>이전 페이지로 돌아가기</Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default PayFail;