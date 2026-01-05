import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// 👇👇 APKA BACKEND LINK 👇👇
const API_URL = "https://image-converter-free.onrender.com";

// --- MAGIC DOWNLOAD FUNCTION 🪄 ---
const forceDownload = async (url, filename) => {
  try {
    const response = await axios.get(url, {
      responseType: 'blob', 
    });
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

// --- HOME PAGE COMPONENT ---
const Home = () => (
  <div className="container mt-5">
    <h1 className="text-center mb-5 display-4 fw-bold text-dark">🚀 ImageTools Pro</h1>
    <div className="row justify-content-center">
      
      {/* Card 1: Converter */}
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm h-100 text-center p-4">
          <h3>🖼️ Converter</h3>
          <p className="text-muted">Convert images to PNG, JPG, WEBP.</p>
          <Link to="/convert" className="btn btn-primary">Go to Converter</Link>
        </div>
      </div>

      {/* Card 2: Compressor */}
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm h-100 text-center p-4">
          <h3>📉 Compressor</h3>
          <p className="text-muted">Reduce file size efficiently.</p>
          <Link to="/compress" className="btn btn-warning text-white">Go to Compressor</Link>
        </div>
      </div>

      {/* Card 3: PDF Maker */}
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm h-100 text-center p-4">
          <h3>📄 PDF Maker</h3>
          <p className="text-muted">Turn your images into PDF.</p>
          <Link to="/pdf" className="btn btn-danger">Go to PDF Maker</Link>
        </div>
      </div>

      {/* 👇 NEW CARD 4: Resizer */}
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm h-100 text-center p-4">
          <h3>📏 Resizer</h3>
          <p className="text-muted">Change Width & Height (px).</p>
          <Link to="/resize" className="btn btn-info text-white">Go to Resizer</Link>
        </div>
      </div>

    </div>
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
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <select className="form-select mb-3" onChange={e => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPG / JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Converting..." : "Convert Now"}</button>
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
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <label className="form-label">Compression: {quality}%</label>
        <input type="range" className="form-range mb-3" min="10" max="90" value={quality} onChange={e => setQuality(e.target.value)} />
        <button className="btn btn-warning w-100 text-white" disabled={loading}>{loading ? "Compressing..." : "Compress Image"}</button>
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
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <button className="btn btn-danger w-100" disabled={loading}>{loading ? "Generating..." : "Generate PDF"}</button>
      </form>
    </ToolLayout>
  );
};

// 4. RESIZER TOOL 📏 (NEW FEATURE)
const Resizer = () => {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1080); 
  const [height, setHeight] = useState(1080);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResize = async (e) => {
    e.preventDefault();
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
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
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
        <button className="btn btn-info w-100 text-white" disabled={loading}>{loading ? "Resizing..." : "Resize Image"}</button>
      </form>
    </ToolLayout>
  );
};

// --- COMMON LAYOUT ---
const ToolLayout = ({ title, children, link, filename }) => (
  <div className="d-flex flex-column align-items-center mt-5">
    <div className="card shadow p-4" style={{ width: '400px' }}>
      <h3 className="text-center mb-4">{title}</h3>
      {children}
      {link && (
        <button onClick={() => forceDownload(link, filename)} className="btn btn-success w-100 mt-3 animate__animated animate__fadeIn">
          ⬇️ Download File
        </button>
      )}
      <Link to="/" className="btn btn-link w-100 mt-2 text-decoration-none">⬅ Back to Home</Link>
    </div>
  </div>
);

// --- MAIN APP (ROUTES & NAVBAR) ---
function App() {
  return (
    <div className="min-vh-100 bg-light">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <Link to="/" className="navbar-brand fw-bold">⚡ ImageTools Pro</Link>
        <div className='d-flex gap-3'>
             <Link to="/convert" className="text-white text-decoration-none">Convert</Link>
             <Link to="/compress" className="text-white text-decoration-none">Compress</Link>
             <Link to="/pdf" className="text-white text-decoration-none">PDF</Link>
             <Link to="/resize" className="text-white text-decoration-none">Resize</Link>
        </div>
      </nav>
      
      {/* ROUTES (Ye Link ko Component se jodta hai) */}
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