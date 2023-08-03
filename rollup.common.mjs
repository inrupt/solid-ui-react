//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// FIXME: Remove this file once it is available in https://github.com/inrupt/typescript-sdk-tools/pull/288/files
//        the rollup-plugin-typescript2 devDependency can also be removed at the same time
import typescript from "rollup-plugin-typescript2";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export const createSharedConfig = pkg => ({
  plugins: [
    typescript({
      // Use our own version of TypeScript, rather than the one bundled with the plugin:
      typescript: require("typescript"),
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext",
        },
      },
    }),
  ],
  external: Object.keys(pkg.dependencies),
  // The following option is useful because symlinks are used in monorepos
  preserveSymlinks: true,
});

export default pkg => [
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    ...createSharedConfig(pkg),
  },
];
