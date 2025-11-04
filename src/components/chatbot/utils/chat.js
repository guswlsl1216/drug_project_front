import OpenAI from "openai";

const openai = new OpenAI(input);

const response = await openai.responses.create({
  model: "gpt-5-nano",
  input: input,
  tools:[
    {
      type: "file_search",
      vector_store_ids: ""
    }
  ]
})