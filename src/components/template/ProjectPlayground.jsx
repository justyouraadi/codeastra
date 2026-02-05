import React, { useState } from "react";
import "./BuildPage.css";

export default function BuildPage() {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="builder-layout">
      {/* LEFT CHAT */}
      <div className="builder-chat">
        <div className="builder-chat-header">AI Builder</div>

        <div className="builder-chat-body"></div>

        <input
          className="builder-chat-input"
          placeholder="Type your idea & press Enter"
        />
      </div>

      {/* RIGHT PREVIEW */}
      <div className="builder-preview">
        <div className="builder-tabs">
          <span
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </span>
          <span
            className={activeTab === "code" ? "active" : ""}
            onClick={() => setActiveTab("code")}
          >
            Code
          </span>
        </div>

        <div className="builder-workspace">
          {activeTab === "preview" ? (
            <div className="preview-card">
              <h3>AI Generated Component</h3>
              <p>Waiting for build instruction...</p>
              <button>Get Started</button>
            </div>
          ) : (
            <pre className="code-box">// Generated JSX will appear here</pre>
          )}
        </div>
      </div>
    </div>
  );
}