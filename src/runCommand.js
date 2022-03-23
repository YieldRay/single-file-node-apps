import { exec } from "child_process";
import { promisify } from "util";
const execP = promisify(exec); // => { stdout, stderr }
export { execP as exec };
