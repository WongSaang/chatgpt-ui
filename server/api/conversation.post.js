import ChatGPTClient from '@waylaidwanderer/chatgpt-api'
import { PassThrough } from 'node:stream'

const serializeSSEEvent = (chunk) => {
    let payload = "";
    if (chunk.id) {
        payload += `id: ${chunk.id}\n`;
    }
    if (chunk.event) {
        payload += `event: ${chunk.event}\n`;
    }
    if (chunk.data) {
        payload += `data: ${chunk.data}\n`;
    }
    if (chunk.retry) {
        payload += `retry: ${chunk.retry}\n`;
    }
    if (!payload) {
        return "";
    }
    payload += "\n";
    return payload;
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const conversationId = body.conversationId ? body.conversationId.toString() : undefined
    const parentMessageId = body.parentMessageId ? body.parentMessageId.toString() : undefined
    const tunnel = new PassThrough()
    const writeToTunnel = (data) => {
        tunnel.write(serializeSSEEvent(data))
    }
    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    if (!body.openaiApiKey) {
        writeToTunnel({
            event: 'error',
            data: JSON.stringify({
                code: 503,
                error: 'You haven\'t set the api key of openai',
            }),
        })
        return sendStream(event, tunnel)
    }

    const clientOptions = {
        // (Optional) Parameters as described in https://platform.openai.com/docs/api-reference/completions
        modelOptions: {
            // The model is set to text-chat-davinci-002-20221122 by default, but you can override
            // it and any other parameters here
            model: body.model,
        },
        // (Optional) Set custom instructions instead of "You are ChatGPT...".
        // promptPrefix: 'You are Bob, a cowboy in Western times...',
        // (Optional) Set a custom name for the user
        // userLabel: 'User',
        // (Optional) Set a custom name for ChatGPT
        // chatGptLabel: 'ChatGPT',
        // (Optional) Set to true to enable `console.debug()` logging
        debug: false,
    };

    const cacheOptions = {
        // Options for the Keyv cache, see https://www.npmjs.com/package/keyv
        // This is used for storing conversations, and supports additional drivers (conversations are stored in memory by default)
        // For example, to use a JSON file (`npm i keyv-file`) as a database:
        // store: new KeyvFile({ filename: 'cache.json' }),
        uri: 'sqlite://database.sqlite'
    };

    const chatGptClient = new ChatGPTClient(body.openaiApiKey, clientOptions, cacheOptions);

    try {
        const response = await chatGptClient.sendMessage(body.message, {
            conversationId,
            parentMessageId,
            onProgress: (token) => {
                // console.log(token)
                writeToTunnel({ data: JSON.stringify({
                        type: 'token',
                        data: token
                    })
                })
            }
        });
        writeToTunnel({ data: JSON.stringify({
                type: 'done',
                data: response
            }) })
        console.log(response)
    } catch (e) {
        const code = e?.json?.data?.code || 503;
        const message = e?.json?.error?.message || 'There was an error communicating with ChatGPT.';
        writeToTunnel({
            event: 'error',
            data: JSON.stringify({
                code,
                error: message,
            }),
        })
    }

    return sendStream(event, tunnel)
})