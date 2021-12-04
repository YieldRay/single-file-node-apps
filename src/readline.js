import { stdin, stdout, title } from "process";
import { promisify } from "util";
import readline from "readline";
// http://nodejs.cn/api/readline.html

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
