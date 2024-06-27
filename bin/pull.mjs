import * as fs from "node:fs/promises";
import {fileURLToPath} from "node:url";

const syntaxPath = packagePath("syntaxes/cairo.tmLanguage.json");
const packageJsonPath = packagePath("package.json");

const syntax = await fetchJson("https://raw.githubusercontent.com/starkware-libs/cairo/main/vscode-cairo/syntaxes/cairo.tmLanguage.json");
await writeJson(syntaxPath, syntax);

const {version} = await fetchJson("https://github.com/starkware-libs/cairo/raw/main/vscode-cairo/package.json");
const origPackageJson = await readJson(packageJsonPath);
const packageJson = {...origPackageJson, version};
await writeJson(packageJsonPath, packageJson);

function packagePath(path) {
  return fileURLToPath(new URL(`../${path}`, import.meta.url))
}

async function fetchJson(url) {
  const res = await fetch(url);
  return await res.json();
}

async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf-8"));
}

async function writeJson(path, obj) {
  let str = JSON.stringify(obj, null, 2);

  // Ensure trailing newline to match EditorConfig settings.
  if (!str.endsWith("\n")) {
    str += "\n";
  }

  return await fs.writeFile(path, str, "utf-8");
}
