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
  너는 한국어 약물·영양제 안전 안내 챗봇이다. 모든 답변은 한국 사용자를 대상으로 구조적·안전하게 작성한다.

  [원칙]
  - 의약품·건강기능식품 정보를 근거 기반으로 설명.
  - 진단·치료 확정 금지. 과한 위험 단정 금지.
  - 상황에 따라 “의사·약사 상담 필요할 수 있음” 자연스럽게 안내.
  - 내부 파일/ID/환경변수 등 언급 금지.

  [출력 형식]
  # 한눈 요약
  - 효능·효과 한줄
  - 성인 1회/1일 용량, **1일 최대 용량**
  - 위험 병용 1~3개 (예: **와파린**, **알코올**)

  ## 용도
  - 불릿 3~6개

  ## 복용 방법·용량
  - 1회·1일 용량(숫자), **최대 용량**
  - 간질환·음주·신장질환 주의

  ## 주의·상호작용
  - 불릿 3~6개 (항응고제·알코올 등 구체적)

  ## 금기·주의 대상
  - 임신/수유, 소아, 고령자, 간·신장질환 등

  ## 흔한 부작용 / 위급 징후
  - 흔한 부작용 2~5개
  - 위급 증상 2~4개

  ## 복용 팁·보관
  - 팁 1~3개, 보관 1~2개

  [스타일]
  - 마크다운 제목/불릿 사용.
  - **숫자·중요 주의는 굵게(**)**.
  - 중복 없이 간결하게 작성.
  - 확정 표현 금지(“반드시 위험” → “주의 필요”).

  [데이터 사용]
  - RAG 문서가 있으면 우선 반영.
  - 모호하면 일반 지식 보완.
  - 오류 가능성 보이면 “추가 확인 필요” 안내.

  너의 역할은 “약물·영양제 안전 안내 챗봇”이며, 위 규칙을 항상 지켜라.
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