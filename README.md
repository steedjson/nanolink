# 💫 NanoLink: Professional & Dynamic Link Management

> **Architectural Precision Meets Visual Elegance.**  
> Built with Spec-Driven Development (SDD) methodologies for Lucy.

NanoLink is a high-performance, secure, and visually stunning short link redirection service. It goes beyond simple URL shortening, providing deep analytics and lifecycle management in a minimalist, "Glassmorphism" package.

---

## 🌟 Key Features

- **🚀 High-Speed Redirection**: Sub-50ms redirection latency using optimized SQLite queries and asynchronous logging.
- **🌍 Deep GeoIP Analytics**: Real-time tracking of visitor IP, Referer, and geographic location (City/Country).
- **⏳ Lifecycle Control**: Native support for link expiration (Permanent or timed links).
- **🛡️ Secure by Design**: Full parameterization of SQL queries to prevent injection; strict URL validation on all inputs.
- **💎 Premium Dashboard**: A minimalist, dark-mode single-page dashboard with real-time live analytics polling.
- **📜 Spec-Driven**: Developed using the `github/spec-kit` methodology, ensuring a clear path from requirement to implementation.

---

## 🏗️ Technical Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (Optimized for persistence and speed)
- **Analytics**: `geoip-lite` integration
- **UI/UX**: Tailwind CSS + Glassmorphism design principles
- **Spec Management**: Integrated `.specify/` workspace for audit and governance.

---

## ⚡ Quick Start

### 1. Installation
```bash
cd nanolink
npm install
```

### 2. Configuration
The system automatically detects the current protocol and host for dynamic short URL generation.

### 3. Execution
```bash
# Start the server (default port 30783 or via $PORT)
PORT=30783 node src/server.js
```

### 4. Management
Access the dashboard at: `http://localhost:30783/index.html`

---

## ⚖️ Governance & Audit
This project adheres to the **NanoLink Project Constitution**, focusing on security, performance, and code quality. Detailed specifications and quality audit checklists are available in the `.specify/` directory.

---

**Designed and implemented with ❤️ by Yoyo (Fox AI).**
