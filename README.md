# Vue Template Quick

一个基于 **Vue 3**、**Vite 7** 和 **TypeScript** 的现代化、高性能前端开发模版。本项目集成了混合开发（Hybrid）能力、自动化 Mock 服务、完善的请求封装及自动化部署方案，旨在提供“开箱即用”的开发体验。

---

## **🚀 项目亮点**

- **⚡ 极速启动**：基于 Vite 7 构建，利用其原生 ESM 特性实现秒级热更新（HMR）。
- **🛡️ 类型安全**：全量使用 TypeScript 5.9，提供卓越的静态检查与开发补全。
- **🔌 JSBridge 集成**：内置跨端通信方案，支持 H5 与原生（iOS/Android）的高效交互。
- **🤖 自动化 Mock**：内置基于 Nitro 的独立 Mock 服务器，支持真正的前后端并行开发。
- **📦 请求客户端**：高度封装的 Axios 客户端，集成请求拦截、异常处理、文件上传/下载功能。
- **🛠️ 自动化部署**：提供 PowerShell 及 Shell 脚本，实现跨平台的一键打包与服务器分发。
- **📏 代码规范**：集成 Antfu ESLint 配置、`simple-git-hooks` 和 `lint-staged`，确保代码质量。

---

## **🛠️ 技术栈**

- **核心框架**: [Vue 3.5+](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite 7.2+](https://vitejs.dev/)
- **状态管理**: [Pinia 3.0+](https://pinia.vuejs.org/) + [持久化插件](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- **路由管理**: [Vue Router 4.6+](https://router.vuejs.org/)
- **Mock 服务**: [Nitro 2.11+](https://nitro.unjs.io/)
- **网络请求**: [Axios 1.13+](https://axios-http.com/)
- **样式处理**: [Sass](https://sass-lang.com/) + [Normalize.css](https://necolas.github.io/normalize.css/)
- **类型定义**: [TypeScript 5.9+](https://www.typescriptlang.org/)

---

## **📂 目录结构**

```text
├── scripts/                # 自动化部署脚本 (deploy.ps1 / deploy.sh)
├── server/                 # 基于 Nitro 的独立 Mock 服务器
│   ├── api/                # Mock 接口定义目录 (支持文件系统路由)
│   └── renderer.ts         # Mock 服务渲染配置
├── src/
│   ├── api/                # 后端接口定义与业务请求逻辑
│   ├── assets/             # 静态资源 (图片、icons 等)
│   ├── components/         # 公共 UI 组件
│   ├── directives/         # 全局自定义指令 (如 debounce)
│   ├── helpers/            # 核心助手工具
│   │   ├── request-client/ # Axios 二次封装 (拦截器、上传/下载助手)
│   │   ├── router/         # 路由配置与模块合并工具
│   │   └── utils/          # 跨端 JSBridge、通用工具函数
│   ├── router/             # 路由定义、动态合并与全局守卫 (Guard)
│   ├── store/              # Pinia 状态管理仓库 (支持持久化)
│   ├── styles/             # 全局 SCSS 样式及变量定义
│   ├── types/              # 全局 TypeScript 类型声明
│   └── views/              # 业务页面组件
├── .env.development        # 开发环境环境变量
├── .env.production         # 生产环境环境变量
├── nitro.config.ts         # Mock 服务配置文件
├── vite.config.ts          # Vite 构建与代理配置
└── package.json            # 项目元数据、依赖与脚本命令
```

---

## **📦 快速开始**

### **1. 环境准备**

- **Node.js**: 推荐 `>= 24.13.0`
- **pnpm**: 推荐 `>= 9.15.4` (项目使用 `.npmrc` 强制锁定版本)

### **2. 安装依赖**

```bash
pnpm install
```

### **3. 启动开发环境**

```bash
# 同时启动 Web 服务和 Mock 服务
pnpm dev
pnpm mock
```

### **4. 项目打包**

```bash
pnpm build
```

---

## **💡 核心功能深入**

### **1. 跨端通信 (JSBridge)**

在 [jsBridge.ts](file:///e:/douyu/vue-template-quick/src/helpers/utils/jsBridge.ts) 中封装了统一的调用接口。它会自动识别当前环境（iOS/Android），并处理 Bridge 初始化、超时重试以及 Promise 化返回，确保 H5 与原生的通信像调用本地函数一样简单。

### **2. 高级请求客户端**

在 `src/helpers/request-client` 目录下，我们对 Axios 进行了深度封装：

- **拦截器管理**：在 [preset-interceptors.ts](file:///e:/douyu/vue-template-quick/src/helpers/request-client/preset-interceptors.ts) 中统一管理 Token 注入、响应格式化和错误监控。
- **文件处理**：内置 [uploader.ts](file:///e:/douyu/vue-template-quick/src/helpers/request-client/uploader.ts) 和 [downloader.ts](file:///e:/douyu/vue-template-quick/src/helpers/request-client/downloader.ts)，轻松应对复杂的上传下载场景。

### **3. 零配置 Mock 服务**

借助 Nitro，我们可以在 `server/api` 下创建 `.ts` 文件直接生成接口。Vite 已配置代理，会自动将 `/api` 请求转发至 Mock 服务器，无需手动切换环境。

### **4. 自动化部署方案**

项目内置了完善的部署逻辑：

- **Windows**: 使用 `pnpm upload` 调用 PowerShell 脚本，利用 .NET 原生能力进行压缩并上传。
- **Linux/macOS**: 使用 `pnpm deploy` 调用 Shell 脚本。
  脚本遵循：**本地压缩 -> 上传服务器 -> 远程解压 -> 环境清理** 的标准流程。

---

## **📋 开发规范**

- **代码风格**: 采用 `@antfu/eslint-config`，支持 Vue、TS、JSON 等多格式自动修复。
- **提交检查**: 通过 `simple-git-hooks` 在 Git Commit 前强制运行 `lint-staged`，确保进入仓库的代码符合规范。
- **类型提示**: 所有业务接口均应在 `src/types` 中定义类型，并与 `src/api` 绑定，实现全链路类型推断。
