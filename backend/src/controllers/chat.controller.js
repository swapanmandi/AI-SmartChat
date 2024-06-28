import { GoogleGenerativeAI } from "@google/generative-ai";


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const chatGenerate = async (req, res) => {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  try {
    const model = genAI.getGenerativeModel({ model:  "gemini-1.5-flash" });
    const code = req.body;

    const prompt = code.receivedObj.data;
    
    console.log("received prompt:", code.receivedObj.data);

    const result = await model.generateContent(prompt);
    
    const response = result.response;
    const text = response.text();
    
    res.status(200).json({chat: text });
  } catch (error) {
    console.error("Error while generationg prompt chat.", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { chatGenerate };
