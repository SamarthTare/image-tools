const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

// 👇 1. CORS Setup (Sabke liye open)
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

// ==========================================
// 🚀 APP ROUTES
// ==========================================

// 1. 🖼️ CONVERT IMAGE
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const format = req.body.format || 'png';
        const filename = `converted-${Date.now()}.${format}`;
        const outputPath = path.join(uploadDir, filename);
        
        await sharp(req.file.buffer)
            .toFormat(format)
            .toFile(outputPath);

        // 👇 MAGIC: Ye automatic link banayega (Localhost ya Render dono par chalega)
        const protocol = req.protocol;
        const host = req.get('host');
        const downloadLink = `${protocol}://${host}/${filename}`;

        res.json({ downloadLink });
    } catch (e) {
        console.error(e);
        res.status(500).send("Conversion Failed");
    }
});

// 2. 📉 COMPRESS IMAGE
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const quality = parseInt(req.body.quality) || 50; 
        const filename = `compressed-${Date.now()}.jpeg`;
        const outputPath = path.join(uploadDir, filename);
        
        await sharp(req.file.buffer)
            .jpeg({ quality: quality }) 
            .toFile(outputPath);

        const protocol = req.protocol;
        const host = req.get('host');
        const downloadLink = `${protocol}://${host}/${filename}`;

        res.json({ downloadLink });
    } catch (e) {
        console.error(e);
        res.status(500).send("Compression Failed");
    }
});

// 3. 📄 IMAGE TO PDF
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
            const protocol = req.protocol;
            const host = req.get('host');
            const downloadLink = `${protocol}://${host}/${filename}`;
            res.json({ downloadLink });
        });

    } catch (e) {
        console.error(e);
        res.status(500).send("PDF Generation Failed");
    }
});

// ==========================================
// 🚀 START SERVER
// ==========================================

// 👇 2. Dynamic Port (Deployment ke liye zaroori)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});