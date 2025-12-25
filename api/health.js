// 健康检查 API
export default async function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'my-website-api',
    version: '1.0.0'
  });
}

