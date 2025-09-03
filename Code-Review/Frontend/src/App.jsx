import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Highlight.js theme for Markdown blocks
import "./App.css";

// Load Prism languages
import "prismjs/components/prism-javascript";

function App() {
  const [code, setCode] = useState(""); // start empty for placeholder
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      setReview("⚠️ Please write some code first.");
      return;
    }

    setLoading(true);
    setReview(""); // clear old review

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        { code }
      );
      console.log("Review Response:", response.data);
      setReview(response.data.response || response.data);
    } catch (error) {
      console.error("Error during code review:", error);
      setReview("❌ Failed to fetch review. Check server logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    
      <main>
        
       <div className="header">
  <h1>
    <img src="./Fevicon/Rx.png" alt="logo" />
    RefactorX
  </h1>
</div>

        
        {/* Left Panel */}
        <div className="left">
          <div className="code">
            {code.trim() === "" && (
              <div className="placeholder">💡 Start typing your code here...</div>
            )}
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.javascript, "javascript")
              }
              padding={12}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                height: "100%",
                width: "100%",
                borderRadius: "5px",
                outline: "none",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            🚀 Review
          </div>
        </div>

        {/* Right Panel */}
        <div className="right">
          <h2>AI Review Output</h2>
          <div className="review-output">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Analyzing your code...</p>
              </div>
            ) : review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <p className="placeholder">🤖 The AI review will appear here once you submit code.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
