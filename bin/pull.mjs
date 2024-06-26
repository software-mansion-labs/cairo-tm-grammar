import * as fs from "node:fs/promises";
import {fileURLToPath} from "node:url";

const syntaxPath = packagePath("syntaxes/cairo.tmLanguage.json");
const packageJsonPath = packagePath("package.json");

const syntax = await fetch("https://raw.githubusercontent.com/starkware-libs/cairo/main/vscode-cairo/syntaxes/cairo.tmLanguage.json").then(p => p.json())
await fs.writeFile(syntaxPath, JSON.stringify(syntax, null, 2), "utf-8");

const {version} = await fetch("https://github.com/starkware-libs/cairo/raw/main/vscode-cairo/package.json").then(p => p.json());
const origPackageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
const packageJson = {...origPackageJson, version};
await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");

function packagePath(path) {
  return fileURLToPath(new URL(`../${path}`, import.meta.url))
}
