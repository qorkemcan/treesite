import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_B11r3IrT.mjs';
import { manifest } from './manifest_DavedB73.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/contact.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/county/_county_.astro.mjs');
const _page6 = () => import('./pages/gallery.astro.mjs');
const _page7 = () => import('./pages/join-network.astro.mjs');
const _page8 = () => import('./pages/privacy.astro.mjs');
const _page9 = () => import('./pages/services/commercial-services.astro.mjs');
const _page10 = () => import('./pages/services/emergency-response.astro.mjs');
const _page11 = () => import('./pages/services/land-clearing.astro.mjs');
const _page12 = () => import('./pages/services/stump-grinding.astro.mjs');
const _page13 = () => import('./pages/services/tree-removal.astro.mjs');
const _page14 = () => import('./pages/services/tree-trimming.astro.mjs');
const _page15 = () => import('./pages/services.astro.mjs');
const _page16 = () => import('./pages/thank-you.astro.mjs');
const _page17 = () => import('./pages/trust-safety.astro.mjs');
const _page18 = () => import('./pages/_slug_.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/contact.js", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/county/[county].astro", _page5],
    ["src/pages/gallery.astro", _page6],
    ["src/pages/join-network.astro", _page7],
    ["src/pages/privacy.astro", _page8],
    ["src/pages/services/commercial-services.astro", _page9],
    ["src/pages/services/emergency-response.astro", _page10],
    ["src/pages/services/land-clearing.astro", _page11],
    ["src/pages/services/stump-grinding.astro", _page12],
    ["src/pages/services/tree-removal.astro", _page13],
    ["src/pages/services/tree-trimming.astro", _page14],
    ["src/pages/services.astro", _page15],
    ["src/pages/thank-you.astro", _page16],
    ["src/pages/trust-safety.astro", _page17],
    ["src/pages/[slug].astro", _page18],
    ["src/pages/index.astro", _page19]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "107fb93b-e1c1-4db0-bfb3-3c763dbaea37",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
