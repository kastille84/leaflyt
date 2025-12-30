const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI();

exports.openai = openai;
