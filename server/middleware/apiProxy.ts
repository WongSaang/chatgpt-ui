import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware'
export default defineEventHandler((event) => {
    // @ts-ignore
    if (event.node.req.url.startsWith('/api/')) {
        return proxyRequest(
            event,
            (process.env.SERVER_DOMAIN || 'http://localhost:8000') + event.node.req.url
        )
    }
})
