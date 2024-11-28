import * as fs from "node:fs/promises";
import {fileURLToPath} from "node:url";

// Pull Cairo syntax.
const syntaxPath = packagePath("syntaxes/cairo.tmLanguage.json");
const [syntax, syntaxSource] = await fetchJson("https://raw.githubusercontent.com/software-mansion/vscode-cairo/main/syntaxes/cairo.tmLanguage.json");
await writeJson(syntaxPath, withCredits(syntax, syntaxSource));

// Pull Cairo Zero syntax.
const syntax0Path = packagePath("syntaxes/cairo0.tmLanguage.json");
let [syntax0, syntax0Source] = await fetchJson("https://github.com/starkware-libs/cairo-lang/raw/master/src/starkware/cairo/lang/ide/vscode-cairo/syntaxes/cairo.tmLanguage.json");
// Modify it to use `cairo0` name & scope name.
// Also remove $schema for consistency with Cairo syntax.
delete syntax0.$schema;
delete syntax0.name;
delete syntax0.scopeName;
syntax0 = {
  name: "Cairo Zero",
  scopeName: "source.cairo0",
  ...syntax0
};
await writeJson(syntax0Path, withCredits(syntax0, syntax0Source));

// Update package.json version.
const packageJsonPath = packagePath("package.json");
const [{version}] = await fetchJson("https://raw.githubusercontent.com/software-mansion/vscode-cairo/main/package.json");
const origPackageJson = await readJson(packageJsonPath);
const packageJson = {...origPackageJson, version};
await writeJson(packageJsonPath, packageJson);

function packagePath(path) {
  return fileURLToPath(new URL(`../${path}`, import.meta.url))
}

async function fetchJson(url) {
  const res = await fetch(url);
  return [await res.json(), res.url];
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

function withCredits({credits, ...obj}, source) {
  const sourceCredit = `Pulled from: ${source}.`;
  credits = credits ? `${sourceCredit} ${credits}` : sourceCredit;
  return {credits, ...obj};
}
