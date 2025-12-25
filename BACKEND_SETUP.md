# 后端功能配置说明

## 已添加的后端功能

### 1. 联系表单 API (`/api/contact`)

处理联系表单提交，包含：
- ✅ 表单数据验证
- ✅ 邮箱格式验证
- ✅ 错误处理
- ✅ 支持 Discord Webhook 通知
- ✅ 日志记录

### 2. 健康检查 API (`/api/health`)

用于检查 API 服务状态。

## 环境变量配置

在 Vercel Dashboard 中配置环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加以下变量（可选）：

### Discord Webhook（推荐）

用于接收联系表单通知：

```
变量名: DISCORD_WEBHOOK_URL
值: https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

**获取 Discord Webhook：**
1. 打开 Discord 服务器
2. 服务器设置 → 整合 → Webhooks
3. 新建 Webhook
4. 复制 Webhook URL

### 通知邮箱（可选）

```
变量名: NOTIFICATION_EMAIL
值: your-email@example.com
```

### Resend API Key（可选，用于发送邮件）

```
变量名: RESEND_API_KEY
值: re_xxxxxxxxxxxxx
```

注册地址：https://resend.com

## API 使用说明

### 联系表单提交

**端点：** `POST /api/contact`

**请求体：**
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "subject": "项目合作",
  "message": "我想咨询一下..."
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "消息已成功发送，我们会尽快回复您！",
  "data": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "subject": "项目合作",
    "submittedAt": "2024-12-25T10:00:00.000Z"
  }
}
```

**错误响应：**
```json
{
  "error": "所有字段都是必填的",
  "missing": {
    "name": false,
    "email": true,
    "subject": false,
    "message": false
  }
}
```

### 健康检查

**端点：** `GET /api/health`

**响应：**
```json
{
  "status": "ok",
  "timestamp": "2024-12-25T10:00:00.000Z",
  "service": "my-website-api",
  "version": "1.0.0"
}
```

## 扩展功能

### 添加邮件发送功能

在 `api/contact.js` 中取消注释邮件发送代码，并安装依赖：

```bash
npm install resend
```

然后更新代码使用 Resend 发送邮件。

### 添加数据库存储

可以使用 Vercel Postgres 或 MongoDB 存储表单数据：

1. 在 Vercel Dashboard 添加 Postgres 数据库
2. 安装数据库客户端库
3. 在 API 中保存数据

### 添加其他通知方式

- Slack Webhook
- Telegram Bot
- 企业微信/钉钉通知

## 测试

### 本地测试

```bash
# 安装 Vercel CLI
npm i -g vercel

# 启动本地开发服务器
vercel dev
```

然后访问 `http://localhost:3000` 测试表单提交。

### 生产环境测试

部署后，访问：
- `https://your-domain.vercel.app/api/health` - 健康检查
- 提交联系表单测试 API

## 故障排除

### API 返回 404

1. 确保 `api/` 目录在项目根目录
2. 检查 `vercel.json` 配置
3. 重新部署项目

### 表单提交失败

1. 检查浏览器控制台错误
2. 查看 Vercel 函数日志
3. 确认环境变量已正确配置

## 下一步

- [ ] 配置 Discord Webhook
- [ ] 添加邮件发送功能
- [ ] 添加数据库存储
- [ ] 添加表单数据管理后台

