
const PayloadMethods = new Set(["PATCH", "POST", "PUT", "DELETE"]);

export default defineEventHandler(async (event) => {
    // @ts-ignore
    if (event.node.req.url.startsWith('/api/')) {
        // TODO: fix fetch failed
        const target = (process.env.SERVER_DOMAIN || 'http://localhost:8000') + event.node.req.url
        // Method
        const method = getMethod(event)
        // Body
        let body;
        if (PayloadMethods.has(method)) {
            body = await readRawBody(event).catch(() => undefined);
        }
        // Headers
        const headers = getProxyRequestHeaders(event);

        if (method === 'DELETE') {
            delete headers['content-length']
        }

        return sendProxy(event, target, {
            sendStream: event.node.req.url === '/api/conversation/',
            fetchOptions: {
                headers,
                method,
                body,
            },
        });

    }
})
