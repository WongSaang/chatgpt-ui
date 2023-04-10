import { createProxyMiddleware } from 'http-proxy-middleware'
export default defineEventHandler(async (event) => {
    await new Promise((resolve, reject) => {
        createProxyMiddleware({
            target: 'http://localhost:8001',
            pathFilter: '/api',
        })(event.node.req, event.node.res, (err) => {
            if (err)
                reject(err)
            else
                resolve(true)
        })
    })
})
