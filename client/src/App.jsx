import { useState, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'; // 👇 New Import

// 👇👇 APKA BACKEND LINK 👇👇
const API_URL = "https://image-converter-free.onrender.com";

// --- MAGIC DOWNLOAD FUNCTION 🪄 ---
const forceDownload = async (url, filename) => {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename || 'downloaded-file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed", error);
    alert("Could not download file. Please try again.");
  }
};

// --- ✨ NEW DRAG & DROP COMPONENT ✨ ---
const DropZone = ({ onFileSelect, file }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []}, 
    multiple: false 
  });

  // Agar file select ho gayi hai, to uska naam dikhao
  if (file) {
    return (
      <div className="p-4 mb-3 text-center border rounded bg-light position-relative animate__animated animate__fadeIn">
        <div className="display-4 text-success mb-2"><i className="bi bi-file-earmark-check-fill"></i></div>
        <p className="fw-bold text-dark mb-1">{file.name}</p>
        <p className="text-muted small">{(file.size / 1024).toFixed(2)} KB</p>
        <button onClick={() => onFileSelect(null)} className="btn btn-sm btn-outline-danger mt-2">
            <i className="bi bi-x-circle me-1"></i> Remove File
        </button>
      </div>
    );
  }

  // Agar file nahi hai, to Drop Zone dikhao
  return (
    <div {...getRootProps()} 
      className={`p-5 mb-3 text-center border-2 border-dashed rounded cursor-pointer transition-all 
      ${isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-light'}`}
      style={{ cursor: 'pointer', borderStyle: 'dashed' }}
    >
      <input {...getInputProps()} />
      <div className="display-4 text-secondary mb-2">
        <i className={`bi ${isDragActive ? 'bi-box-arrow-in-down text-primary' : 'bi-cloud-upload'}`}></i>
      </div>
      {isDragActive ? (
        <p className="fw-bold text-primary mb-0">Drop the image here...</p>
      ) : (
        <div>
           <p className="fw-bold text-dark mb-1">Drag & Drop image here</p>
           <p className="text-muted small mb-0">or click to select file</p>
        </div>
      )}
    </div>
  );
};

// --- HOME PAGE COMPONENT ---
const Home = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate__animated animate__fadeInDown">
        <h1 className="display-3 fw-bold mb-3" style={{ 
          background: "linear-gradient(45deg, #FF512F, #DD2476)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent" 
        }}>
          ImageTools Pro
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
          The professional toolkit for your images. Drag, drop, and done.
        </p>
      </div>
      <div className="row g-4 justify-content-center animate__animated animate__fadeInUp">
        <FeatureCard to="/convert" title="Image Converter" desc="Convert JPG, PNG, WEBP." icon="bi-arrow-repeat" color="primary" delay="0.1s"/>
        <FeatureCard to="/compress" title="Image Compressor" desc="Reduce file size up to 90%." icon="bi-arrows-collapse" color="warning" delay="0.2s"/>
        <FeatureCard to="/pdf" title="Image to PDF" desc="Create PDFs instantly." icon="bi-file-earmark-pdf-fill" color="danger" delay="0.3s"/>
        <FeatureCard to="/resize" title="Image Resizer" desc="Change Width & Height." icon="bi-aspect-ratio" color="info" delay="0.4s"/>
      </div>
      <div className="text-center mt-5 pt-4 text-muted border-top">
        <p className="small">🔒 Secure & Free. Made with ❤️ by <a href="https://github.com/SamarthTare" target="_blank" className="text-decoration-none fw-bold">Samarth Tare</a></p>
      </div>
    </div>
  );
};

const FeatureCard = ({ to, title, desc, icon, color, delay }) => (
  <div className="col-md-6 col-lg-3" style={{ animationDelay: delay }}>
    <Link to={to} className="text-decoration-none">
      <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card" 
           style={{ transition: "transform 0.3s ease", borderRadius: "20px" }}>
        <div className={`mx-auto d-flex align-items-center justify-content-center mb-3 bg-${color} bg-opacity-10 text-${color}`} 
             style={{ width: "70px", height: "70px", borderRadius: "50%", fontSize: "30px" }}>
          <i className={`bi ${icon}`}></i>
        </div>
        <h5 className="fw-bold text-dark">{title}</h5>
        <p className="text-muted small mb-0">{desc}</p>
      </div>
    </Link>
    <style jsx>{` .hover-card:hover { transform: translateY(-10px); cursor: pointer; } `}</style>
  </div>
);

// 1. CONVERTER TOOL
const Converter = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async (e) => {
    e.preventDefault();
    if(!file) return alert("Please upload a file");
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', format);
    try {
      const res = await axios.post(`${API_URL}/convert`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error converting file"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Image Converter 🖼️" link={link} filename={`converted.${format}`}>
      <form onSubmit={handleConvert}>
        <DropZone onFileSelect={setFile} file={file} />
        <select className="form-select mb-3" onChange={e => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPG / JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>{loading ? "Converting..." : "Convert Now"}</button>
      </form>
    </ToolLayout>
  );
};

// 2. COMPRESSOR TOOL
const Compressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(50);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompress = async (e) => {
    e.preventDefault();
    if(!file) return alert("Please upload a file");
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality);
    try {
      const res = await axios.post(`${API_URL}/compress`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error compressing file"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Compress Image 📉" link={link} filename="compressed.jpeg">
      <form onSubmit={handleCompress}>
        <DropZone onFileSelect={setFile} file={file} />
        <label className="form-label fw-bold">Compression Level: {quality}%</label>
        <input type="range" className="form-range mb-3" min="10" max="90" value={quality} onChange={e => setQuality(e.target.value)} />
        <button className="btn btn-warning w-100 py-2 text-white fw-bold" disabled={loading}>{loading ? "Compressing..." : "Compress Image"}</button>
      </form>
    </ToolLayout>
  );
};

// 3. PDF MAKER TOOL
const PdfMaker = () => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePdf = async (e) => {
    e.preventDefault();
    if(!file) return alert("Please upload a file");
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(`${API_URL}/to-pdf`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error generating PDF"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Image to PDF 📄" link={link} filename="document.pdf">
      <form onSubmit={handlePdf}>
        <DropZone onFileSelect={setFile} file={file} />
        <button className="btn btn-danger w-100 py-2 fw-bold" disabled={loading}>{loading ? "Generating..." : "Generate PDF"}</button>
      </form>
    </ToolLayout>
  );
};

// 4. RESIZER TOOL
const Resizer = () => {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1080); 
  const [height, setHeight] = useState(1080);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResize = async (e) => {
    e.preventDefault();
    if(!file) return alert("Please upload a file");
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);
    try {
      const res = await axios.post(`${API_URL}/resize`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error resizing file"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Resize Image 📏" link={link} filename="resized.png">
      <form onSubmit={handleResize}>
        <DropZone onFileSelect={setFile} file={file} />
        <div className="d-flex gap-2 mb-3">
            <div className="w-50">
                <label className="form-label">Width (px)</label>
                <input type="number" className="form-control" value={width} onChange={e => setWidth(e.target.value)} required />
            </div>
            <div className="w-50">
                <label className="form-label">Height (px)</label>
                <input type="number" className="form-control" value={height} onChange={e => setHeight(e.target.value)} required />
            </div>
        </div>
        <button className="btn btn-info w-100 py-2 text-white fw-bold" disabled={loading}>{loading ? "Resizing..." : "Resize Image"}</button>
      </form>
    </ToolLayout>
  );
};

// --- COMMON LAYOUT ---
const ToolLayout = ({ title, children, link, filename }) => (
  <div className="d-flex flex-column align-items-center mt-5">
    <div className="card shadow border-0 p-4" style={{ width: '450px', borderRadius: '15px' }}>
      <h3 className="text-center mb-4 fw-bold text-dark">{title}</h3>
      {children}
      {link && (
        <button onClick={() => forceDownload(link, filename)} className="btn btn-success w-100 mt-3 animate__animated animate__fadeIn py-2 fw-bold">
          <i className="bi bi-download me-2"></i> Download File
        </button>
      )}
      <Link to="/" className="btn btn-link w-100 mt-3 text-decoration-none text-muted">⬅ Back to Home</Link>
    </div>
  </div>
);

// --- MAIN APP ---
// --- MAIN APP (UPDATED NAVBAR) ---
function App() {
  return (
    <div className="min-vh-100 bg-light font-monospace">
      
      {/* 👇 NAVBAR UPDATED: Ab ye Professional lagega */}
      <nav className="navbar navbar-dark bg-dark px-4 mb-4 justify-content-between align-items-center shadow-sm">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          {/* Lightning Icon Added */}
          <i className="bi bi-lightning-charge-fill text-warning"></i> ImageTools Pro
        </Link>
        
        {/* Right Side: GitHub & Contact (Clean Look) */}
        <div className='d-flex align-items-center gap-4'>
             
             {/* 1. GitHub Link (Portfolio Credibility) */}
             <a href="https://github.com/SamarthTare" target="_blank" rel="noreferrer" 
                className="text-white text-decoration-none d-flex align-items-center gap-2" 
                style={{ opacity: 0.9 }}>
                <i className="bi bi-github fs-5"></i>
                {/* Mobile me text chup jayega, sirf icon dikhega */}
                <span className="d-none d-md-block small">GitHub</span>
             </a>

             {/* 2. Contact Button */}
             <a href="mailto:samarthtare441@gmail.com" 
                className="btn btn-sm btn-outline-light rounded-pill px-3 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill"></i> 
                <span>Contact Me</span>
             </a>
        </div>
      </nav>
      
      {/* ROUTES (Ye waisa hi rahega) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<Converter />} />
        <Route path="/compress" element={<Compressor />} />
        <Route path="/pdf" element={<PdfMaker />} />
        <Route path="/resize" element={<Resizer />} />
      </Routes>
    </div>
  );
}

export default App;