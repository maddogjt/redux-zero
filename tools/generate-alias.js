/**
 * Alias subpath import (`dist/cjs/*`) to top-level path mapping (`predux/*`)
 * Previously this was done by placing cjs to top-level package when it's published -
 * Now build uses `dist` as explicit output subpath so we generate top-level alias here instead.
 */
const fs = require('fs-extra');
const path = require('path');

const aliasRoot = [
  'utils', 'middleware', 'preact', 'devtools'
]

aliasRoot.map((alias) => path.resolve(__dirname, `../${alias}`)).forEach((alias) => {
  if (fs.existsSync(alias)) {
    fs.removeSync(alias);
  }
  fs.ensureDirSync(alias);
});

aliasRoot.forEach((alias) => {
  const pkgManifest = {
    "name": `predux/${alias}`,
    "types": `../dist/types/${alias}/index.d.ts`,
    "main": `../dist/cjs/${alias}/index.js`,
    "module": `../dist/esm/${alias}/index.js`,
    "sideEffects": false
  };

  fs.writeJSON(path.resolve(__dirname, `../${alias}/package.json`), pkgManifest, { spaces: 2 });
});

