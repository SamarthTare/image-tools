# ⚡ ImageTools Pro

**ImageTools Pro** is a full-stack web application designed to handle common image processing tasks efficiently. It allows users to convert image formats, compress file sizes without losing quality, and generate PDFs from images instantly.

🚀 **Live Demo:** [https://image-tools-red.vercel.app](https://image-tools-red.vercel.app)

---

## 🌟 Features

* **🖼️ Image Converter:** Convert images between **PNG, JPG/JPEG, and WEBP** formats.
* **📉 Image Compressor:** Reduce image file size with adjustable quality levels (10% - 90%).
* **📄 Image to PDF:** Instantly generate a downloadable PDF document from an uploaded image.
* **⬇️ Smart Download:** Automatically handles secure file downloads from the cloud server.
* **📱 Responsive Design:** Works seamlessly on Desktop, Tablet, and Mobile.

---

## 🛠️ Tech Stack

### **Frontend:**
* **React.js (Vite):** For building a fast and interactive UI.
* **Bootstrap 5:** For responsive styling and layout.
* **Axios:** For handling HTTP requests.
* **React Router DOM:** For seamless client-side navigation.

### **Backend:**
* **Node.js & Express.js:** RESTful API architecture.
* **Sharp:** High-performance Node.js image processing library.
* **Multer:** Middleware for handling `multipart/form-data` (file uploads).
* **PDFKit:** For generating PDF documents programmatically.

### **Deployment:**
* **Frontend:** Vercel
* **Backend:** Render (Web Service)

---

## 💡 Key Challenges & Solutions

During the development and deployment of this project, I encountered several technical challenges:

1.  **Mixed Content Error (CORS & SSL):**
    * **Problem:** The Frontend is hosted on Vercel (HTTPS), while the Backend on Render acts as a proxy, causing browsers to block "Insecure Content" when trying to download files.
    * **Solution:** Implemented **Dynamic Protocol Detection** in the backend and a **Force Download** function in the frontend using `Blob` objects to securely fetch and save files.

2.  **Ephemeral File Storage:**
    * **Problem:** Render's free tier deletes files after server restarts.
    * **Solution:** Optimized the workflow to process and serve files immediately, ensuring users get their converted files instantly before any cleanup occurs.

3.  **Client-Side Routing on Production:**
    * **Problem:** Refreshing pages like `/convert` resulted in 404 errors on Vercel.
    * **Solution:** Configured `vercel.json` rewrites to redirect all requests to `index.html`, allowing React Router to handle navigation correctly.

---

## 🚀 How to Run Locally

If you want to run this project on your local machine:

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
* **LinkedIn:** [linkedin.com/in/samarthtare](https://linkedin.com/in/samarthtare)
* **GitHub:** [github.com/SamarthTare](https://github.com/SamarthTare)

---

*Made with ❤️ using MERN Stack.*