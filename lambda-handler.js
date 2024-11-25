const { createServer } = require('http');
const next = require('next');

const app = next({ dev: false }); // Use production mode
const handle = app.getRequestHandler();

exports.handler = async (event) => {
    // Create an HTTP server to handle requests
    const server = createServer((req, res) => {
        // Map API Gateway event to HTTP request
        req.url = event.rawPath || event.path || '/';
        req.method = event.httpMethod;
        req.headers = event.headers;

        // API Gateway sends the body as a string. Parse it if it exists.
        if (event.body) {
            req.body = JSON.parse(event.body);
        }

        handle(req, res);
    });

    return new Promise((resolve, reject) => {
        server.on('error', reject);
        server.on('close', resolve);

        // Simulate an incoming HTTP request using the Lambda event
        server.emit('request', event, {
            end: resolve,
            setHeader: () => {},
            writeHead: () => {},
            write: () => {},
        });
    });
};
