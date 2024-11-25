import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
} from 'aws-lambda';
import { IncomingMessage, ServerResponse } from 'http';
import next from 'next';

import { Socket } from 'net';
const app = next({ dev: false });
const handle = app.getRequestHandler();

let isNextJsPrepared = false;

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    if (!isNextJsPrepared) {
        await app.prepare();
        isNextJsPrepared = true;
    }

    const { httpMethod, path, body, headers, queryStringParameters } = event;
    return new Promise((resolve, reject) => {
        const req = Object.assign(new IncomingMessage(new Socket()), {
            method: httpMethod,
            url:
                path +
                (queryStringParameters
                    ? '?' +
                      new URLSearchParams(
                          Object.fromEntries(
                              Object.entries(queryStringParameters).map(
                                  ([key, value]) => [key, value || '']
                              )
                          )
                      ).toString()
                    : ''),
            headers,
            body,
        });

        const res = {
            statusCode: 200,
            headers: {},
            body: '',
            setHeader: function (name: string, value: string) {
                (this as any).headers[name] = value;
            },
            write: function (chunk: string) {
                (this as any).body += chunk;
            },
            end: function (chunk?: string) {
                if (chunk) (this as any).body += chunk;
                resolve({
                    statusCode: (this as any).statusCode,
                    headers: (this as any).headers,
                    body: (this as any).body,
                });
            },
        } as unknown as ServerResponse;

        handle(req, res).catch(reject);
    });
};
