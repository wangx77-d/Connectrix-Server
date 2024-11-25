import fs from 'fs';
import path from 'path';

const tmpDir = '/tmp/.next';
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log('Created /tmp/.next directory');
}

const buildIdPath = path.join(tmpDir, 'BUILD_ID');
if (!fs.existsSync(buildIdPath)) {
    fs.writeFileSync(buildIdPath, 'static-build-id');
    console.log('Created BUILD_ID in /tmp');
}

// Redirect runtime interactions to /tmp
process.env.NEXT_RUNTIME_CACHE_DIR = path.join(tmpDir, 'cache');
process.env.NEXT_BUILD_ID = buildIdPath; // Use the mock BUILD_ID

import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

export const handler = async (event: any, context: any) => {
    // Ensure Next.js is initialized
    await app.prepare();

    // Adapt AWS Lambda `event` to Node.js-like `req` and `res`
    const {
        path,
        httpMethod,
        headers,
        body: rawBody,
        queryStringParameters,
    } = event;

    // Parse the body if it's a JSON string
    let parsedBody = undefined;
    if (rawBody && typeof rawBody === 'string') {
        try {
            parsedBody = JSON.parse(rawBody);
        } catch (err) {
            console.error('Error parsing request body:', err);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Invalid JSON body' }),
            };
        }
    }

    console.log('parsedBody:', parsedBody);

    // Construct the full URL with query parameters
    const queryString = queryStringParameters
        ? `?${new URLSearchParams(
              queryStringParameters as Record<string, string>
          ).toString()}`
        : '';
    const url = path + queryString;

    // Mocked request and response objects
    const req = new IncomingMessageMock(httpMethod, url, headers, parsedBody);
    const res = new ServerResponseMock(req);

    // Return a Promise to handle asynchronous completion
    return new Promise((resolve, reject) => {
        res.on('finish', () => {
            resolve({
                statusCode: res.statusCode || 200,
                headers: res.headers,
                body: res.body,
                isBase64Encoded: false,
            });
        });

        res.on('error', reject);

        handle(req as any, res as any, parse(url, true));
    });
};

// Mock IncomingMessage to simulate AWS Lambda HTTP request
class IncomingMessageMock extends IncomingMessage {
    constructor(
        method: string,
        url: string,
        headers: any,
        body: string | null
    ) {
        super(null as any);
        this.method = method;
        this.url = url;
        this.headers = headers;
        if (body) {
            this.push(JSON.stringify(body));
        }
        this.push(null);
    }
}

// Mock ServerResponse to collect response data
class ServerResponseMock extends ServerResponse {
    body: string = '';
    headers: Record<string, string> = {};

    constructor(req: IncomingMessageMock) {
        super(req);
    }

    setHeader(name: string, value: string | number | readonly string[]): this {
        this.headers[name.toLowerCase()] = String(value);
        return this;
    }

    write(
        chunk: any,
        encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
        callback?: (error: Error | null | undefined) => void
    ): boolean {
        if (typeof chunk === 'string') {
            this.body += chunk;
        } else if (Buffer.isBuffer(chunk)) {
            // Only use encoding if it's a BufferEncoding, not a callback function
            const bufferEncoding =
                typeof encoding === 'string' ? encoding : 'utf-8';
            this.body += chunk.toString(bufferEncoding);
        }

        if (callback) {
            process.nextTick(callback); // Ensure the callback is invoked asynchronously
        }

        return true; // Always return true to signal backpressure is not an issue
    }

    end(
        chunk?: any,
        encoding?: BufferEncoding | (() => void),
        callback?: () => void
    ): this {
        if (typeof encoding === 'function') {
            callback = encoding;
            encoding = undefined;
        }
        if (chunk) {
            this.write(chunk, encoding as BufferEncoding);
        }
        if (callback) {
            callback();
        }
        return this;
    }
}
