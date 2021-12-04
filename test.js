import { host, ls, runCommands } from "./index.js";
ls()
    .then(console.log)
    .then(() => runCommands("ls"))
    .then(() => host([{ public: "/", local: "./src" }]));
