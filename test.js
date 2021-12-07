import { question, quit } from "./src/readline.js";
import { createHash } from "./src/crypto.js";
const input = await question("Generate MD5: ");
console.log(`md5: ${createHash("md5", input)}`);
quit(); // must execute quit() to quit the program
