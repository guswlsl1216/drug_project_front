import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 테스트키
const customerKey = uuidv4();

const PaymentsSheet = ({  }) => {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50_000,  // OrderSheets에서 받아올 최종결제금액
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  
  // 결제위젯 인스턴스 생성
  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey); // 토스페이먼츠 객체 반환
      const widgets = tossPayments.widgets({ customerKey });  // 결제위젯 객체 반환

      setWidgets(widgets);
    };

    fetchPaymentWidgets();
  }, [clientKey]);

  // 결제위젯 UI 렌더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      // 결제 금액 설정
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "DEFAULT"
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <>
      <div className="payment_wrap">
        <div className="box_section">
          <div id="payment-method" />
          <div id="agreement"/>
        </div>
      </div>
    </>
  )

}

export default PaymentsSheet;