const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

// CORS Setup
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Uploads folder public access
app.use(express.static('uploads'));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- HELPER FUNCTION: Smart Protocol Detection ---
// Ye check karega: Agar localhost hai to HTTP, warna HTTPS (Render ke liye)
const getBaseUrl = (req) => {
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

// 1. 👇 DOWNLOAD ROUTE
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error("Download Error:", err);
            res.status(500).send("Could not download file.");
        }
    });
});

// 2. 🖼️ CONVERT IMAGE
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const format = req.body.format || 'png';
        const filename = `converted-${Date.now()}.${format}`;
        const outputPath = path.join(uploadDir, filename);
        
        await sharp(req.file.buffer)
            .toFormat(format)
            .toFile(outputPath);

        // 👇 FIXED: Use Smart Protocol
        const downloadLink = `${getBaseUrl(req)}/download/${filename}`;

        res.json({ downloadLink });
    } catch (e) {
        console.error(e);
        res.status(500).send("Conversion Failed");
    }
});

// 3. 📉 COMPRESS IMAGE
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const quality = parseInt(req.body.quality) || 50; 
        const filename = `compressed-${Date.now()}.jpeg`;
        const outputPath = path.join(uploadDir, filename);
        
        await sharp(req.file.buffer)
            .jpeg({ quality: quality }) 
            .toFile(outputPath);

        // 👇 FIXED: Use Smart Protocol
        const downloadLink = `${getBaseUrl(req)}/download/${filename}`;

        res.json({ downloadLink });
    } catch (e) {
        console.error(e);
        res.status(500).send("Compression Failed");
    }
});

// 4. 📄 IMAGE TO PDF
app.post('/to-pdf', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const filename = `doc-${Date.now()}.pdf`;
        const filePath = path.join(uploadDir, filename);
        const doc = new PDFDocument();

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        
        doc.image(req.file.buffer, {
            fit: [500, 700],
            align: 'center',
            valign: 'center'
        });
        
        doc.end();

        stream.on('finish', () => {
            // 👇 FIXED: Use Smart Protocol
            const downloadLink = `${getBaseUrl(req)}/download/${filename}`;
            res.json({ downloadLink });
        });

    } catch (e) {
        console.error(e);
        res.status(500).send("PDF Generation Failed");
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});