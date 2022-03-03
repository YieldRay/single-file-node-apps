import { stdin, stdout, title } from "process";
import { promisify } from "util";
import readline from "readline";
// http://nodejs.cn/api/readline.html
// in Node.js 17, the question API has been provided by node:readline/promises
// which means you do not need this custom API anymore.

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});

const question = promisify(rl.question).bind(rl);
const quit = () => process.stdin.unref();
const history = [];
rl.on("line", (line) => {
    history.push(line);
});

export { title, rl, question, history, quit };
