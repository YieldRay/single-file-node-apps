import { exec } from "../src/runCommand.js";
console.log((await exec("ls")).stdout);
