import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

const extensions = [".ts"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.devDependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

const globals = ['preact', 'preact/hooks'];

export default [
  // CommonJS
  {
    // input: {
    //   index: "src/index.ts",
    //   "preact/index": "src/preact/index.ts",
    //   "middleware/index": "src/middleware/index.ts",
    //   "utils/index": "src/utils/index.ts",
    //   "devtools/index": "src/devtools/index.ts",
    // },
    input: "src/index.ts",
    output: {
      // dir: "lib",
      file: "lib/redux-zero.js",
      // entryFileNames: "[name].min.js",
      format: "cjs",
      indent: false,
      globals,
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]),
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        extensions,
        plugins: [
          ["@babel/plugin-transform-runtime", { version: babelRuntimeVersion }],
          ["./scripts/mangleErrors.js", { minify: false }],
        ],
        babelHelpers: "runtime",
      }),
    ],
  },

  // ES
  {
    input: "src/index.ts",
    output: { file: "es/redux-zero.js", format: "es", indent: false, globals },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]),
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            { version: babelRuntimeVersion, useESModules: true },
          ],
          ["./scripts/mangleErrors.js", { minify: false }],
        ],
        babelHelpers: "runtime",
      }),
    ],
  },

  // ES for Browsers
  {
    input: "src/index.ts",
    output: { file: "es/redux-zero.mjs", format: "es", indent: false, globals },
    plugins: [
      peerDepsExternal(),
      nodeResolve({
        extensions,
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: "node_modules/**",
        plugins: [["./scripts/mangleErrors.js", { minify: true }]],
        skipPreflightCheck: true,
        babelHelpers: "bundled",
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },

];
