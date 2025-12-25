# 前端开发者作品集网站

这是一个现代化的前端开发者作品集网站，使用 HTML + Tailwind CSS + Vanilla JS 构建，部署在 Vercel 上。

## 功能特性

- ✅ 完全响应式设计
- ✅ 现代化 UI/UX
- ✅ 联系表单后端处理
- ✅ SEO 优化
- ✅ 快速加载性能

## 项目结构

```
my-website/
├── api/                 # Vercel Serverless Functions
│   ├── contact.js       # 联系表单处理API
│   └── health.js        # 健康检查API
├── assets/              # 静态资源
│   ├── css/
│   ├── images/
│   └── js/
├── index.html          # 主页面
├── script.js           # 前端JavaScript
├── styles.css          # 自定义样式
├── vercel.json         # Vercel配置
└── package.json        # 项目配置
```

## 后端功能

### 联系表单 API (`/api/contact`)

处理联系表单提交，支持：
- 表单验证
- 数据存储（可配置）
- 邮件通知（可配置）
- Discord Webhook 通知（可选）

### 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中添加：

```env
# Discord Webhook（可选）
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# 通知邮箱（可选）
NOTIFICATION_EMAIL=your-email@example.com

# 如果使用 Resend 发送邮件（可选）
RESEND_API_KEY=re_...
```

## 本地开发

```bash
# 安装 Vercel CLI
npm i -g vercel

# 启动本地开发服务器
vercel dev
```

## 部署

### 自动部署

推送到 GitHub 的 `main` 分支会自动触发 Vercel 部署。

### 手动部署

```bash
# 使用 Vercel CLI
vercel --prod
```

## API 端点

- `POST /api/contact` - 提交联系表单
- `GET /api/health` - 健康检查

## 技术栈

- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Vercel Serverless Functions
- Vercel Platform

## 许可证

MIT

