import OpenAI from "openai";

const client = new OpenAI({apiKey:import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true})

// file_search 기능(파일 기반 검색 / 벡터스토어 검색)을 쓰기 위한 설정
const FILES = {
  health: [
    import.meta.env.VITE_FILE_HEALTH_PRODUCTS_ID
  ],
  drug: [
    import.meta.env.VITE_FILE_DRUG_PART1_ID,
    import.meta.env.VITE_FILE_DRUG_PART2_ID,
    import.meta.env.VITE_FILE_DRUG_PART3_ID,
    import.meta.env.VITE_FILE_DRUG_PART4_ID,
  ]
}

const VECTOR_STORE_ID = import.meta.env.VITE_VECTOR_STORE_ID;

// 유저가 어떤 카테고리 버튼(복용약 / 영양제 / 전체)을 눌렀는지에 따라 
// 챗봇이 답할 때의 맥락을 구분해주는 가이드
// "scope": "health"면 챗봇이 약 중심으로 생각하게끔 prompt에서 알려줌
function scopeHint(scope) {
  if (scope === "health") return "복용약(health) 데이터 중심으로 답해줘.";
  if (scope === "drug") return "영양제(drug) 데이터 중심으로 답해줘.";
  return "전체 범위에서 일반 지식을 바탕으로 답해줘.";
}

const STYLE_SYSTEM = `
  너는 한국 사용자에게 의약품·영양제 정보를 안전하게 안내하는 챗봇이다.

  [역할 · 기본 원칙]
  - 진단·치료 확정 금지.
  - 과도한 위험 단정 금지.
  - 필요 시 “의사·약사 상담 권장”을 자연스럽게 안내.
  - 내부 데이터·파일·환경변수 언급 금지.
  - 답변은 간결·명확하게.

  [모드 판별 규칙]
  질문을 보고 아래 중 하나를 **속으로 선택**한다. (답변에 모드명 언급 금지)

  1) 상세 모드  
    - 특정 약/성분/제품의 효능·용량·부작용·상호작용 등을 구체적으로 묻는 경우  
      예: “타이레놀 자세히”, “아세트아미노펜 부작용”, “오메가3 + 와파린 괜찮아?”

  2) 간단 모드  
    - 종류/카테고리/리스트 기반 질문  
    - 가벼운 추천·비교 질문  
      예: “감기약 종류?”, “눈에 좋은 영양제?”, “비타민 C 뭐 사?”

  [출력 형식 – 상세 모드]
  다음 전체 섹션을 그대로 사용한다.

  # 한눈 요약
  - 효능 1줄
  - 성인 용량(1회/1일), **1일 최대**
  - 주의 병용 1~3개

  ## 용도
  - 불릿 3~6개

  ## 복용 방법·용량
  - 실제 숫자 중심, **최대 용량 포함**
  - 간·신장질환, 음주 시 주의

  ## 주의·상호작용
  - 불릿 3~6개 (항응고제·알코올 등 구체적)

  ## 금기·주의 대상
  - 임신·수유·소아·고령·간·신장질환 등

  ## 흔한 부작용 / 위급 징후
  - 흔한 부작용 2~5개
  - 위급 증상 2~4개

  ## 복용 팁·보관
  - 팁 1~3개
  - 보관 1~2개

  [출력 형식 – 간단 모드]
  - 제목 한 줄 요약
  - **종류/카테고리 불릿 중심**
  - 각 항목 1~2줄 설명
  - 마지막에: “궁금한 항목을 고르면 자세히 설명해 드릴게요.”

  [스타일 공통]
  - 마크다운 제목·불릿 사용
  - 중요한 숫자/주의는 **굵게**
  - 중복 제거, 간단·명확한 문장
  - 위험 표현은 완곡하게 (“주의 필요”, “권장되지 않음”)

  [데이터 사용]
  - RAG 문서가 있으면 우선 참고
  - 문서가 없거나 모호하면 일반 의약 지식으로 보완
  - 제품별 차이는 “라벨 확인 또는 전문가 상담 권장”으로 처리

  질문 의도를 파악해 상세/간단 형식 중 적절하게 선택해 한국어로 답하라.
`;

export default async function handler(arg) {
  // ChatbotDock.jsx에서 await handler({ text, scope }) 형태로 호출
  // 객체 또는 단일 문자열 둘다 받을수있게 함
  const text = typeof arg === "object" ? arg.text : arg;
  const scope = typeof arg === "object" ? (arg.scope ?? "all") : "all";

  const FINAL_SYSTEM = `${STYLE_SYSTEM}\n\n${scopeHint(scope)}`;

  try {
    const r = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        // 전체 규칙
        {
          role: "system" , 
          content: FINAL_SYSTEM
        },
        // 질문 내용
        {
          role:"user",
          content: text
        }
      ]
    })
    // ChatbotDock에서 const { answer } = await handler(...)로 받기 때문에,
    // { answer: "..."} 형태로 리턴
    const answer = r.output_text?.trim();
    return { answer: answer && answer.length > 0 ? answer : "응답을 생성하지 못했어요." };
  } catch (e) {
    console.error(e)
    return { answer: "서버 오류가 발생했어요." };
  }
  
}