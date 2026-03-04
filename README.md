# 💫 NanoLink: 专业级动态短链接管理系统

> **架构之精准，视觉之优雅。**  
> 基于 Spec-Driven Development (SDD) 规格驱动开发方法论，为 Lucy 深度定制。

NanoLink 是一款兼具高性能、极致安全与视觉美学的短链接重定向服务。它不仅仅是一个工具，更是一个集成了深度数据分析与生命周期管理的数字化艺术品。

---

## 🌟 核心特性

- **🚀 极速重定向**：基于优化的 SQLite 查询与异步日志架构，重定向延迟低于 50ms。
- **🌍 深度地理位置分析**：实时追踪访问者的 IP、来源 (Referer) 及地理位置（城市/国家）。
- **⏳ 生命周期管控**：原生支持链接有效期管理（永久有效或定时失效）。
- **🛡️ 安全至上**：全链路参数化 SQL 查询，严防注入攻击；对所有入参执行严格的 URL 协议校验。
- **💎 极简玻璃态仪表盘**：基于 Tailwind CSS 打造的深色模式 SPA 界面，支持实时数据轮询。
- **📜 规格驱动架构**：遵循 `github/spec-kit` 规范，实现从需求到代码的严密链路。

---

## 🏗️ 技术栈

- **后端 (Backend)**: Node.js + Express
- **数据库 (Database)**: SQLite (极致轻量与持久化)
- **分析引擎 (Analytics)**: `geoip-lite` 深度集成
- **UI/UX**: Tailwind CSS + Glassmorphism 视觉体系
- **治理与审计**: 集成 `.specify/` 工作区，包含完整的项目宪法、规格文档与质量清单。

---

## ⚡ 快速启动

### 1. 安装
```bash
cd nanolink
npm install
```

### 2. 动态感知
系统会自动感知当前的 Protocol (协议) 与 Host (域名+端口)，实现短链接地址的零配置生成。

### 3. 生产级部署 (Systemd 守护)
本项目已针对 Linux 环境进行系统级加固。建议使用 Systemd 托管以获得自动重启与持久生命力：
```bash
# 重启服务指令
systemctl --user restart nanolink.service

# 查看实时运行状态
systemctl --user status nanolink.service
```

### 4. 访问管理后台
默认端口：`30783`  
地址：`http://localhost:30783/index.html`

---

## ⚖️ 治理与审计
本项目严格遵循 **NanoLink 项目宪法**，核心聚焦于安全性、高性能与代码质量。所有详细规格及质量验收清单均可在 `.specify/` 目录中查阅。

---

**Designed and implemented with ❤️ by Yoyo (Fox AI).**
