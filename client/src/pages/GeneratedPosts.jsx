import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function GeneratedPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const fetchGeneratedPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/user/all-uploads"
        );
        setPosts(res.data);
        setFilteredPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
      setLoading(false);
    };

    fetchGeneratedPosts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = posts.filter(
      (post) =>
        post.prompt.toLowerCase().includes(term.toLowerCase()) ||
        post.article.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredPosts(filtered);
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const downloadImage = async (imageUrl, filename = "ai_image.jpg") => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:7000/api/user/delete-upload/${postId}`
      );
      setPosts(posts.filter((post) => post._id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-dark display-6">
        🚀 AI Creations
      </h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by prompt or description..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-muted fs-4">No matching posts found.</p>
      ) : (
        <div className="row g-4">
          {filteredPosts.map((post) => {
            const imageUrl = `http://localhost:7000/${post.image}`;

            return (
              <div key={post._id} className="col-md-6 col-lg-4">
                <div className="card shadow border-0 rounded-4 h-100 bg-white">
                  <div className="position-relative">
                    <img
                      src={imageUrl}
                      className="card-img-top rounded-top-4"
                      alt="Generated Visual"
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        aspectRatio: "1 / 1",
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <button
                        className="btn btn-sm btn-outline-light border-0"
                        title="Download Image"
                        onClick={() =>
                          downloadImage(imageUrl, `${post._id}.jpg`)
                        }
                      >
                        ⬇
                      </button>
                      {user && user.role === "admin" && (
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Delete Post"
                          onClick={() => deletePost(post._id)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center text-primary fw-semibold mb-3">
                      📝 Description
                    </h5>
                    <p className="card-text text-dark small flex-grow-1">
                      {expandedPosts[post._id] || post.article.length <= 150
                        ? post.article
                        : `${post.article.slice(0, 150)}...`}
                      {post.article.length > 150 && (
                        <span
                          className="text-primary d-block mt-2"
                          role="button"
                          onClick={() => toggleExpand(post._id)}
                        >
                          {expandedPosts[post._id] ? "Show less" : "Read more"}
                        </span>
                      )}
                    </p>
                    <p className="card-text text-muted small mt-3">
                      <strong>Prompt:</strong> {post.prompt}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GeneratedPosts;
