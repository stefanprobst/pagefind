import esbuild from 'esbuild';
import path from 'path';
import ImportGlobPlugin from "esbuild-plugin-import-glob";

import { createRequire } from "module";
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { version } = require('./package.json');


const build = async () => {
    const esbuildOptions = {
        write: true,
        outdir: path.join(__dirname, `../../pagefind/vendor/`),
        entryPoints: [path.join(__dirname, 'composable.js')],
        entryNames: `pagefind_[name].${version}`,
        plugins: [
            ImportGlobPlugin.default(),
        ],
        minify: true,
        loader: {},
        define: {},
        bundle: true,
    }

    const compiled = await esbuild.build(esbuildOptions);
    console.log(compiled);
}

const serve = async () => {
    const esbuildOptions = {
        outdir: path.join(__dirname, "_dev_files/_pagefind"),
        entryPoints: [path.join(__dirname, 'composable.js')],
        plugins: [
            ImportGlobPlugin.default(),
        ],
        bundle: true,
    }

    const context = await esbuild.context(esbuildOptions);
    const server = await context.serve({ servedir: path.join(__dirname, "_dev_files") });
    console.log(`Serving the dev suite on http://localhost:${server.port}`);
}

if (process.env.PAGEFIND_DEV) {
    serve();
} else {
    build();
}