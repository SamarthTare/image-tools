import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const tools = [
    { name: "Image Converter", path: "/convert", icon: "🖼️", desc: "Convert JPG to PNG, WEBP, etc." },
    { name: "Compress Image", path: "/compress", icon: "📉", desc: "Reduce file size without losing quality." },
    { name: "Image to PDF", path: "/pdf", icon: "📄", desc: "Turn your images into PDF documents." },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4 text-primary">⚡ Super Image Tools</h1>
        <p className="lead text-muted">All your image editing tools in one place.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {tools.map((tool, index) => (
          <div className="col-md-4" key={index}>
            <Link to={tool.path} className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 hover-effect p-4 text-center">
                <div className="display-1 mb-3">{tool.icon}</div>
                <h3 className="fw-bold text-dark">{tool.name}</h3>
                <p className="text-muted">{tool.desc}</p>
                <button className="btn btn-outline-primary rounded-pill px-4 mt-2">Open Tool 🚀</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;