import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { AppServerModule } from './client/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
    const server = express();
    const distFolder = join(process.cwd(), 'htdocs');
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

    // Share the same proxy as non-SSR development mode for SSR development mode
    // But SSR production mode will not use this and instead directly hit nginx
    const proxyConfig = JSON.parse(readFileSync('proxy.conf.json', 'utf8')) as { [key: string]: Options; };
    Object.entries(proxyConfig).forEach(
        ([route, config]) => {
            const c = {...config, changeOrigin: true};
            server.use(route, createProxyMiddleware(c));
            console.log(route, c);
        },
    );

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
    server.engine('html', ngExpressEngine({
        bootstrap: AppServerModule,
    }) as any);

    server.set('view engine', 'html');
    server.set('views', distFolder);

    // Serve static files from /browser
    server.get('*.*', express.static(distFolder, {
        maxAge: '1y',
    }));

    // All regular routes use the Universal engine
    server.get('*', (req, res) => {
        res.render(indexHtml, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
    });

    return server;
}

function run() {
    const port = process.env.PORT || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}

export * from './client/main.server';
