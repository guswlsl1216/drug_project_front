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
  너는 한국어로 약/영양제 정보를 안전하게 안내한다.
  항상 아래 "출력 형식"을 엄격히 지켜라.

  [출력 형식]
  # 한눈 요약
  - 효능/효과 한줄 요약
  - 성인 1회/1일 권장 용량(있으면 범위), 최대용량(숫자 g)
  - 주요 위험 조합 1~3개 (예: 와파린, 알코올 등)

  ## 용도
  - 불릿 3~6개

  ## 복용 방법·용량
  - 1회 용량, 1일 최대용량(숫자 강조), 간질환/음주 시 주의

  ## 주의·상호작용
  - 불릿 3~6개 (와파린·알코올 등 구체 예시 포함)

  ## 금기·주의 대상
  - 불릿 3~6개 (임신/수유, 간질환 등)

  ## 흔한 부작용 / 위급 징후
  - 흔한 부작용 2~5개
  - 즉시 진료가 필요한 징후 2~4개

  ## 복용 팁·보관
  - 복용 팁 1~3개, 보관 1~2개

  [스타일]
  - 마크다운 제목과 불릿을 사용하고, 핵심 수치는 굵게(**굵게**) 표기한다.
  - 절대 내부 리소스나 파일명, 환경변수 언급 금지.
  - 답변은 간결하고 중복 없이 작성하라.
`;

export default async function handler(arg) {
  // ChatbotDock.jsx에서 await handler({ text, scope }) 형태로 호출
  // 객체 또는 단일 문자열 둘다 받을수있게 함
  const text = typeof arg === "object" ? arg.text : arg;
  const scope = typeof arg === "object" ? (arg.scope ?? "all") : "all";
  try {
    const r = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        // 전체 규칙
        {
          role: "system" , 
          content: STYLE_SYSTEM
        },
        // 추가 지침
        {
          role: "system",
          content:
            // scopeHint() 함수에서 “어떤 범위(scope)”의 대화인지 알려주는 것
            scopeHint(scope)
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
    return { answer: r.output_text ?? "응답을 생성하지 못했어요." };
  } catch (e) {
    console.error(e)
    return { answer: "서버 오류가 발생했어요." };
  }
  
}