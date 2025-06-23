const express = require("express");
const router = express.Router();
const axios = require("axios");
const pdfParse = require("pdf-parse");
const multer = require("multer");
const { appendBezierCurve } = require("pdf-lib");

const COHERE_API_URL = "https://api.cohere.ai/v1/generate";
const API_KEY = "7Dbjk8G3UCx4QSkXxuApvNpPH4AFKaW1aOy743z3"; // Store API key securely
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_API = "https://api.cohere.ai/v1/generate";

const HUGGING_FACE_API =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const HF_API_KEY = process.env.HF_API_KEY;

// Image Generation Endpoint
router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      HUGGING_FACE_API,
      JSON.stringify({ inputs: prompt }),
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png", // Explicitly set the expected content type
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    console.log("Status Code:", response.status);

    if (response.status !== 200) {
      const errorData = Buffer.from(response.data, "binary").toString("utf-8");
      console.error("Error Data:", errorData);
      return res.status(response.status).json({ error: JSON.parse(errorData) });
    }

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    res.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Text Generation with Cohere
router.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      COHERE_API,
      {
        model: "command",
        prompt: `Describe the following scene: ${prompt}`,
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data.generations[0]?.text?.trim() || "No description.";
    res.json({ article: text });
  } catch (error) {
    console.error("Text generation failed:", error.message);
    res.status(500).json({ error: "Text generation failed" });
  }
});

module.exports = router;
