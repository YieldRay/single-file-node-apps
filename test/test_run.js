import { exec } from "../src/runCommand.js";
console.log((await exec("ls --help")).stdout);
