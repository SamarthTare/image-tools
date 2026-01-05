import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';

// --- COMPONENTS FOR TOOLS ---

// 1. CONVERTER TOOL 🖼️
const Converter = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [link, setLink] = useState("");

  const handleConvert = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', format);
    
    const res = await axios.post('http://localhost:5000/convert', formData);
    setLink(res.data.downloadLink);
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
        <button className="btn btn-primary w-100">Convert Now</button>
      </form>
    </ToolLayout>
  );
};

// 2. COMPRESSOR TOOL 📉
const Compressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(50);
  const [link, setLink] = useState("");

  const handleCompress = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality);

    const res = await axios.post('http://localhost:5000/compress', formData);
    setLink(res.data.downloadLink);
  };

  return (
    <ToolLayout title="Compress Image 📉" link={link}>
      <form onSubmit={handleCompress}>
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <label className="form-label">Compression Level: {quality}%</label>
        <input type="range" className="form-range mb-3" min="10" max="90" value={quality} onChange={e => setQuality(e.target.value)} />
        <button className="btn btn-warning w-100 text-white fw-bold">Compress Image</button>
      </form>
    </ToolLayout>
  );
};

// 3. PDF MAKER TOOL 📄
const PdfMaker = () => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  const handlePdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.post('http://localhost:5000/to-pdf', formData);
    setLink(res.data.downloadLink);
  };

  return (
    <ToolLayout title="Image to PDF 📄" link={link}>
      <form onSubmit={handlePdf}>
        <input type="file" className="form-control mb-3" onChange={e => setFile(e.target.files[0])} required />
        <button className="btn btn-danger w-100">Generate PDF</button>
      </form>
    </ToolLayout>
  );
};

// --- COMMON LAYOUT FOR TOOLS ---
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

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Global Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <Link to="/" className="navbar-brand fw-bold">⚡ ImageTools Pro</Link>
      </nav>

      {/* Routes */}
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