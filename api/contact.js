// Vercel Serverless Function - 处理联系表单提交
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: '所有字段都是必填的',
        missing: {
          name: !name,
          email: !email,
          subject: !subject,
          message: !message
        }
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 这里可以添加多种处理方式：
    // 1. 发送邮件（使用 Nodemailer、SendGrid、Resend 等）
    // 2. 保存到数据库（Vercel Postgres、MongoDB 等）
    // 3. 发送到 Slack/Discord 通知
    // 4. 保存到文件系统

    // 示例：发送邮件通知（需要配置邮件服务）
    // 可以使用环境变量配置邮件服务
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'your-email@example.com';
    
    // 这里可以集成邮件服务，例如：
    // - Resend (推荐，简单易用)
    // - SendGrid
    // - Nodemailer
    // - AWS SES

    // 示例：使用 Resend 发送邮件
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@yourdomain.com',
    //   to: notificationEmail,
    //   subject: `新联系表单: ${subject}`,
    //   html: `
    //     <h2>新的联系表单提交</h2>
    //     <p><strong>姓名:</strong> ${name}</p>
    //     <p><strong>邮箱:</strong> ${email}</p>
    //     <p><strong>主题:</strong> ${subject}</p>
    //     <p><strong>消息:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `
    // });

    // 示例：保存到 Vercel KV (键值存储)
    // const kv = require('@vercel/kv');
    // await kv.set(`contact:${Date.now()}`, {
    //   name,
    //   email,
    //   subject,
    //   message,
    //   timestamp: new Date().toISOString()
    // });

    // 示例：发送到 Discord Webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '新联系表单提交',
              color: 0x1e40af, // 蓝色
              fields: [
                { name: '姓名', value: name, inline: true },
                { name: '邮箱', value: email, inline: true },
                { name: '主题', value: subject, inline: false },
                { name: '消息', value: message, inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (error) {
        console.error('Discord webhook error:', error);
      }
    }

    // 记录日志（在 Vercel 中可以通过日志查看）
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    // 返回成功响应
    return res.status(200).json({
      success: true,
      message: '消息已成功发送，我们会尽快回复您！',
      data: {
        name,
        email,
        subject,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: '服务器错误，请稍后重试',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

