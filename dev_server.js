const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // API Proxying
    if (req.url.startsWith('/api/')) {
        const proxyReq = http.request({
            host: 'localhost',
            port: 3000,
            path: req.url,
            method: req.method,
            headers: req.headers
        }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });
        proxyReq.on('error', (err) => {
            console.error(`Proxy error: ${err.message}`);
            res.writeHead(502);
            res.end(`Proxy error: ${err.message}`);
        });
        return;
    }

    // Remove query strings
    const cleanUrl = req.url.split('?')[0];
    let filePath = path.join(ROOT, cleanUrl === '/' ? 'index.html' : cleanUrl);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    const serveFile = (pathToServe, isRetry = false) => {
        fs.readFile(pathToServe, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT' && !isRetry && !path.extname(pathToServe)) {
                    // Try appending .html if no extension was provided
                    const htmlPath = pathToServe + '.html';
                    return serveFile(htmlPath, true);
                }

                if (error.code === 'ENOENT') {
                    console.error(`File not found: ${pathToServe}`);
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found', 'utf-8');
                } else {
                    console.error(`Server error: ${error.code} on ${pathToServe}`);
                    res.writeHead(500);
                    res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                }
            } else {
                const ext = String(path.extname(pathToServe)).toLowerCase();
                const actualContentType = MIME_TYPES[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': actualContentType });
                res.end(content, 'utf-8');
            }
        });
    };

    serveFile(filePath);
});

server.listen(PORT, () => {
    console.log(`Static server running at http://localhost:${PORT}/`);
    console.log(`Root directory: ${ROOT}`);
});
