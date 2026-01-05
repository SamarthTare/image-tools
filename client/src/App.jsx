import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';

// 👇👇 YAHAN APKA NAYA BACKEND LINK HAI 👇👇
const API_URL = "https://image-converter-free.onrender.com";

// 1. CONVERTER TOOL 🖼️
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
      // 👇 Link Updated
      const res = await axios.post(`${API_URL}/convert`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error converting file"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Image Converter 🖼️" link={link}>
      <form onSubmit={handleConvert}>
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <select className="form-select mb-3" onChange={e => setFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPG / JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Converting..." : "Convert Now"}
        </button>
      </form>
    </ToolLayout>
  );
};

// 2. COMPRESSOR TOOL 📉
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
      // 👇 Link Updated
      const res = await axios.post(`${API_URL}/compress`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error compressing file"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Compress Image 📉" link={link}>
      <form onSubmit={handleCompress}>
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <label className="form-label">Compression Level: {quality}%</label>
        <input type="range" className="form-range mb-3" min="10" max="90" value={quality} onChange={e => setQuality(e.target.value)} />
        <button className="btn btn-warning w-100 text-white fw-bold" disabled={loading}>
            {loading ? "Compressing..." : "Compress Image"}
        </button>
      </form>
    </ToolLayout>
  );
};

// 3. PDF MAKER TOOL 📄
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
      // 👇 Link Updated
      const res = await axios.post(`${API_URL}/to-pdf`, formData);
      setLink(res.data.downloadLink);
    } catch (error) { alert("Error generating PDF"); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Image to PDF 📄" link={link}>
      <form onSubmit={handlePdf}>
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <button className="btn btn-danger w-100" disabled={loading}>
            {loading ? "Generating..." : "Generate PDF"}
        </button>
      </form>
    </ToolLayout>
  );
};

// --- COMMON LAYOUT ---
const ToolLayout = ({ title, children, link }) => (
  <div className="d-flex flex-column align-items-center mt-5">
    <div className="card shadow p-4" style={{ width: '400px' }}>
      <h3 className="text-center mb-4">{title}</h3>
      {children}
      {link && (
        <a href={link} download className="btn btn-success w-100 mt-3 animate__animated animate__fadeIn">
          ⬇️ Download File
        </a>
      )}
      <Link to="/" className="btn btn-link w-100 mt-2 text-decoration-none">⬅ Back to Home</Link>
    </div>
  </div>
);

// --- MAIN APP ---
function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <Link to="/" className="navbar-brand fw-bold">⚡ ImageTools Pro</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<Converter />} />
        <Route path="/compress" element={<Compressor />} />
        <Route path="/pdf" element={<PdfMaker />} />
      </Routes>
    </div>
  );
}

export default App;