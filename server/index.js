const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit'); // 👇 NEW IMPORT

const app = express();

// 👇 IMPORTANT FOR RENDER (Proxy Trust)
// Render ek proxy ke peeche chalta hai, isliye ye zaroori hai
// taaki hum user ka asli IP address pehchan sakein.
app.set('trust proxy', 1);

app.use(express.json());

// CORS Setup
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// 👇 SECURITY: RATE LIMITER ADDED HERE
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true, 
    legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Uploads folder public access
app.use(express.static('uploads'));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- HELPER FUNCTION: FORCE HTTPS ---
const getBaseUrl = (req) => {
    const host = req.get('host');
    if (host.includes('localhost')) {
        return `http://${host}`;
    }
    return "https://image-converter-free.onrender.com";
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
            const downloadLink = `${getBaseUrl(req)}/download/${filename}`;
            res.json({ downloadLink });
        });

    } catch (e) {
        console.error(e);
        res.status(500).send("PDF Generation Failed");
    }
});

// 5. 📏 RESIZE IMAGE
app.post('/resize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        const width = parseInt(req.body.width);
        const height = parseInt(req.body.height);

        if (!width || !height) return res.status(400).send("Width and Height are required");

        const filename = `resized-${Date.now()}.png`; 
        const outputPath = path.join(uploadDir, filename);
        
        await sharp(req.file.buffer)
            .resize({ width: width, height: height, fit: 'fill' }) 
            .toFile(outputPath);

        const downloadLink = `${getBaseUrl(req)}/download/${filename}`;

        res.json({ downloadLink });
    } catch (e) {
        console.error(e);
        res.status(500).send("Resizing Failed");
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});