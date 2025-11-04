// import OpenAI from "openai";

// const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

// const FILES = {
//   health: [
//     process.env.FILE_HEALTH_PRODUCTS_ID
//   ],
//   drug: [
//     process.env.FILE_DRUG_PART1_ID,
//     process.env.FILE_DRUG_PART2_ID,
//     process.env.FILE_DRUG_PART3_ID,
//     process.env.FILE_DRUG_PART4_ID,
//   ]
// }

// const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID;

// export default async function handler(req, res) {
//   try {
//     const {text, scope = "all"} = typeof req.body === "string" ? JSON.parse(req.body) : req.body

//     // scope → 사용할 파일 목록
//     const fileIds = scope === "health" ? FILES.health
//                   : scope === "drug" ? FILES.drug
//                   : VECTOR_STORE_ID
    
//     const attachments = fileIds
//         .filter(Boolean)
//         .map((id) => ({file_id: id, tools: [{type:"file_search"}]}))
    
//     const r = 
//   }
  
  

// }