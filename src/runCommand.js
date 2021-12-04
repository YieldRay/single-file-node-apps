import { spawn } from "child_process";

function runCommands(...commands) {
    function create(cmd, opt) {
        const ls = spawn(cmd, opt);

        ls.on("spawn", () => {
            console.log("> Spawn command: ", cmd, opt.join(" "));
        });

        ls.stdout.on("data", (data) => {
            console.log("\n ");
            console.log("$", cmd, opt.join(" "));
            console.log(String(data));
        });

        ls.on("close", (code) => {
            console.log(`> child process close all stdio with code ${code}`);
        });

        ls.on("exit", (code) => {
            console.log(`> child process exited with code ${code}`);
        });
    }

    commands.forEach((cmd) => {
        const cmds = cmd.split(" ").filter((e) => e != "");
        create(cmds[0], cmds.slice(1));
    });
}

//runCommands("ls -a -l", "curl --help");

export default runCommands;
