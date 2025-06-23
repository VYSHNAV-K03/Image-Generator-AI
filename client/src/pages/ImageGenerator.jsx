import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ImageArticleGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));

  console.log(user);

  const generateContent = async () => {
    setLoading(true);
    setImage(null);
    setArticle("");
    setUploadSuccess(false);

    try {
      const imgRes = await axios.post("http://localhost:7000/generate-image", {
        prompt,
      });
      setImage(imgRes.data.image);

      const textRes = await axios.post("http://localhost:7000/generate-text", {
        prompt,
      });
      setArticle(textRes.data.article);
    } catch (err) {
      console.error(err);
      setArticle("An error occurred while generating content.");
    }

    setLoading(false);
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  const uploadToDatabase = async () => {
    if (!image || !article) return;

    setUploading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("prompt", prompt);
      formData.append("article", article);
      formData.append("image", file);

      await axios.post("http://localhost:7000/api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    setUploading(false);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">🎨 VisionCraft Image Generator</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="d-grid gap-2 mb-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={generateContent}
          disabled={loading || !prompt}
        >
          {loading ? "Generating..." : "Generate Image & Description"}
        </button>
      </div>

      {(image || article) && (
        <div className="card shadow fade show p-3 animate__animated animate__fadeIn">
          <div className="row g-0 align-items-center">
            {image && (
              <div className="col-md-5 text-center mb-3 mb-md-0">
                <img
                  src={image}
                  alt="Generated AI"
                  className="img-fluid image-card shadow-sm"
                />
                <button
                  className="btn btn-secondary mt-2"
                  onClick={downloadImage}
                >
                  Download Image
                </button>
              </div>
            )}
            {article && (
              <div className="col-md-6 text-center">
                <div className="card-body">
                  <h5 className="card-title">📝 AI-Generated Description</h5>
                  <p className="card-text">{article}</p>
                </div>
              </div>
            )}
          </div>

          <div className="d-grid gap-2 mt-3">
            <button
              className="btn btn-success btn-lg"
              onClick={uploadToDatabase}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload to Post Gallery"}
            </button>
            {uploadSuccess && (
              <div className="alert alert-success mt-2" role="alert">
                ✅ Uploaded successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageArticleGenerator;
