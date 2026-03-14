# Microsoft To-Do with Next.js

使用 Next.js 16 和 React 19 复现的 Microsoft To-Do 任务管理应用。

[English](./README.md)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)
![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-f43f5e?logo=auth0)

---

## ✨ 功能特性

- 📋 **智能列表** - 我的一天、重要、计划内、收件箱
- 🎨 **自定义列表** - 使用表情符号创建个性化任务分类
- ✅ **子任务** - 将任务分解为可管理的步骤
- 🌙 **深色模式** - 内置主题支持
- 🔐 **OAuth 认证** - GitHub 和谷歌登录
- 💾 **自动保存** - 使用 Zustand 本地持久化
- 📊 **智能设置** - 配置列表可见性偏好

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm / yarn / pnpm / bun
- SQLite（开发环境）或 PostgreSQL（生产环境）

### 安装步骤

```bash
# 克隆仓库
git clone <repository-url>
cd microsoft-todo

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 生成 Prisma 客户端
npm run db:gen

# 运行数据库迁移
npm run db:md

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 🛠️ 技术栈

### 前端
- **框架:** Next.js 16 (App Router)
- **UI 库:** React 19
- **样式:** Tailwind CSS v4 + shadcn/ui
- **状态管理:** Zustand (带持久化)
- **拖拽:** @dnd-kit/core

### 后端
- **数据库 ORM:** Prisma
- **认证:** Better Auth
- **数据库:** SQLite (开发) / PostgreSQL (生产)

### 核心库
| 库 | 用途 |
|----|-----|
| `lucide-react` | 图标库 |
| `react-hook-form` | 表单处理 |
| `zod` | 模式验证 |
| `sonner` | 消息通知 |
| `@radix-ui` | 无头 UI 组件 |

---

## 📁 项目结构

```
microsoft-todo/
├── app/                          # Next.js 应用路由
│   ├── api/                      # API 端点
│   │   ├── auth/[...all]/        # Better Auth 处理器
│   │   ├── todos/                # 任务 CRUD 端点
│   │   └── user/[id]/            # 用户端点
│   ├── login/                    # 登录页
│   ├── register/                 # 注册页
│   ├── profile/[userid]/         # 用户资料
│   └── todo/                     # 待办应用页面
│       ├── tasks/[setId]/        # 任务列表视图
│       └── setting/              # 设置页面
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 组件
│   └── ...                       # 其他组件
├── lib/                          # 工具与操作
│   ├── actions/                  # 服务端操作
│   │   ├── todo/                 # 任务操作
│   │   └── user/                 # 用户操作
│   ├── auth.ts                   # 认证配置
│   ├── auth-client.ts            # 客户端认证钩子
│   └── prisma.ts                 # 数据库客户端
├── store/                        # Zustand 状态管理
│   ├── index.ts                  # 状态导出
│   └── todo-app.ts               # 主状态
├── prisma/                       # 数据库模式
│   └── schema.prisma
└── generated/                    # 生成的 Prisma 客户端
```

---

## 📝 可用脚本

| 命令 | 描述 |
|-----|------|
| `npm run dev` | 使用 Turbopack 启动开发服务器 |
| `npm run build` | 生产环境构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run db:gen` | 生成 Prisma 客户端 |
| `npm run db:md` | 创建并应用迁移 |
| `npm run db:mr` | 重置数据库（清空所有数据） |
| `npm run db:studio` | 打开 Prisma Studio 图形界面 |
| `npm run db:format` | 格式化 Prisma 模式 |

---

## 🔧 环境变量

| 变量 | 描述 | 默认值 |
|-----|------|-------|
| `DATABASE_URL` | 数据库连接字符串 | `file:./dev.db` |
| `BETTER_AUTH_URL` | 认证基础 URL | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | GitHub OAuth 客户端 ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth 密钥 | - |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 密钥 | - |

---

## 📦 数据库模式

| 模型 | 描述 |
|-----|------|
| `user` | 用户账户 |
| `account` | OAuth 提供者账户 |
| `session` | 用户会话 |
| `todoSet` | 任务分类（自定义列表） |
| `todoTask` | 任务 |
| `todoTaskStep` | 子任务 |
| `verification` | 邮箱验证令牌 |

---

## 🎨 默认智能列表

应用内置 6 个智能列表：

| ID | 标签 | 图标 |
|----|------|-----|
| `myday` | 我的一天 | ☀️ |
| `important` | 重要 | ⭐ |
| `planned` | 计划内 | 📋 |
| `assigned_to_me` | 已分配给我 | 👤 |
| `flagged` | 标记的电子邮件 | 🚩 |
| `inbox` | 任务 | 🏠 |

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

---

## 📄 许可证

本项目用于教育目的。

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Microsoft To-Do](https://todo.microsoft.com/) - 设计灵感
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件
- [Better Auth](https://better-auth.com/) - 认证服务

---

<p align="center">Made with ❤️ by the community</p>
