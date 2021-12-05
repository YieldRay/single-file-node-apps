import { question, quit } from "./src/readline.js";
console.log("You anwsered: " + (await question("Do you like wan you xi? ")));
quit(); // must execute quit() to quit the program
