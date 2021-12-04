import { host, ls, runCommands } from "./index.js";
// ls()
//     .then(console.log)
//     .then(() => runCommands("ls"));

host([
    { public: "a.js", local: "/" },
    { public: "/", local: "./public/" },
    {
        public: "/test/",
        local: "./test.js",
    },
]);
