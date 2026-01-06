const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron'); // 👇 NEW IMPORT

const app = express();

// Render Proxy Trust
app.set('trust proxy', 1);

app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false,
});
app.use(limiter);

// Upload Directory Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.static('uploads'));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 🧹 AUTO-CLEANUP CRON JOB (NEW FEATURE) ---
// Har 10 minute me chalega: '*/10 * * * *'
cron.schedule('*/10 * * * *', () => {
    console.log('🧹 Running Auto-Cleanup...');
    
    fs.readdir(uploadDir, (err, files) => {
        if (err) return console.error('Unable to scan directory:', err);

        files.forEach((file) => {
            const filePath = path.join(uploadDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                const now = Date.now();
                const fileAge = now - stats.ctimeMs; // File kitni purani hai (ms)
                const tenMinutes = 10 * 60 * 1000;

                // Agar file 10 minute se purani hai, to delete karo
                if (fileAge > tenMinutes) {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Error deleting ${file}:`, err);
                        else console.log(`🗑️ Deleted old file: ${file}`);
                    });
                }
            });
        });
    });
});

// Helper: HTTPS URL
const getBaseUrl = (req) => {
    const host = req.get('host');
    return host.includes('localhost') ? `http://${host}` : "https://image-converter-free.onrender.com";
}

// --- ROUTES ---

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    res.download(filePath, (err) => {
        if (err) console.error("Download Error:", err);
    });
});

app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        const format = req.body.format || 'png';
        const filename = `converted-${Date.now()}.${format}`;
        await sharp(req.file.buffer).toFormat(format).toFile(path.join(uploadDir, filename));
        res.json({ downloadLink: `${getBaseUrl(req)}/download/${filename}` });
    } catch (e) { res.status(500).send("Failed"); }
});

app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        const quality = parseInt(req.body.quality) || 50;
        const filename = `compressed-${Date.now()}.jpeg`;
        await sharp(req.file.buffer).jpeg({ quality }).toFile(path.join(uploadDir, filename));
        res.json({ downloadLink: `${getBaseUrl(req)}/download/${filename}` });
    } catch (e) { res.status(500).send("Failed"); }
});

app.post('/to-pdf', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        const filename = `doc-${Date.now()}.pdf`;
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(path.join(uploadDir, filename));
        doc.pipe(stream);
        doc.image(req.file.buffer, { fit: [500, 700], align: 'center', valign: 'center' });
        doc.end();
        stream.on('finish', () => res.json({ downloadLink: `${getBaseUrl(req)}/download/${filename}` }));
    } catch (e) { res.status(500).send("Failed"); }
});

app.post('/resize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        const width = parseInt(req.body.width);
        const height = parseInt(req.body.height);
        const filename = `resized-${Date.now()}.png`;
        await sharp(req.file.buffer).resize({ width, height, fit: 'fill' }).toFile(path.join(uploadDir, filename));
        res.json({ downloadLink: `${getBaseUrl(req)}/download/${filename}` });
    } catch (e) { res.status(500).send("Failed"); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));