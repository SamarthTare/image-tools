# ⚡ ImageTools Pro

**ImageTools Pro** is a full-stack MERN application designed for efficient image processing. It offers a suite of tools to convert, compress, resize, and generate PDFs from images, wrapped in a modern, user-friendly interface.

🚀 **Live Demo:** [https://image-tools-red.vercel.app](https://image-tools-red.vercel.app)

---

## 🌟 Key Features

### 🎨 Frontend (UX/UI)
* **🖐️ Drag & Drop Interface:** Modern file upload experience using `react-dropzone`.
* **📱 Responsive Design:** Fully responsive UI built with React & Bootstrap 5.
* **🖼️ Image Converter:** Convert images between **PNG, JPG, and WEBP** formats.
* **📏 Image Resizer:** Custom width & height adjustment using `sharp`.
* **⬇️ Smart Download:** Secure blob-based file downloading without redirects.

### 🛡️ Backend & Security
* **🔒 Rate Limiting:** Implemented `express-rate-limit` to prevent DDoS attacks and spam (Limit: 100 requests/15 min).
* **☁️ Secure Processing:** Images are processed in-memory or ephemeral storage on Render and cleaned up automatically.
* **🚀 Dynamic Protocol Handling:** Solved **Mixed Content (HTTP/HTTPS)** issues between Vercel and Render proxy.

---

## 🛠️ Tech Stack

### **Frontend:**
* **React.js (Vite):** Fast client-side rendering.
* **React Dropzone:** For modern drag-and-drop file uploads.
* **Axios:** Handling HTTP requests with blob responses.
* **Bootstrap 5:** Styling and responsive layout.

### **Backend:**
* **Node.js & Express:** REST API architecture.
* **Sharp:** High-performance image processing (Resize, Convert, Compress).
* **Multer:** Handling `multipart/form-data`.
* **PDFKit:** Generating PDFs programmatically.
* **Express Rate Limit:** API Security.

---

## 💡 Challenges Solved

1.  **CORS & Mixed Content Errors:**
    * The frontend (HTTPS) and backend (HTTP Proxy) mismatch caused download failures.
    * **Solution:** Implemented a dynamic `getBaseUrl` function in the backend to force HTTPS links on production and created a client-side `forceDownload` function using Blob objects.

2.  **Server Overload Protection:**
    * **Solution:** Added `express-rate-limit` middleware to restrict excessive requests from a single IP, ensuring server stability on the free tier.

3.  **User Experience (UX):**
    * Replaced standard file inputs with an interactive **Drag & Drop Zone** for a modern feel.

---

## 🚀 How to Run Locally

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/SamarthTare/image-tools.git](https://github.com/SamarthTare/image-tools.git)
    cd image-tools
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    npm start
    ```
    *Server runs on localhost:5000*

3.  **Setup Frontend** (Open a new terminal)
    ```bash
    cd client
    npm install
    npm run dev
    ```
    *Frontend runs on localhost:5173*

---

## 👨‍💻 Author

**Samarth Tare**
* **GitHub:** [github.com/SamarthTare](https://github.com/SamarthTare)
* **Contact:** samarthtare441@gmail.com

---

*Made with ❤️ using MERN Stack.*