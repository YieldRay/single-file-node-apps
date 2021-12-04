import http from "http";
import { readFile, access } from "fs/promises";
import { constants } from "fs";

function prependSlash(str) {
    if (str.startsWith("/")) return str;
    else return "/" + str;
}

function appendSlash(str) {
    if (str.endsWith("/")) return str;
    else return str + "/";
}
async function isFileAccessible(targetFile) {
    try {
        await access(targetFile, constants.R_OK);
    } catch {
        return false;
    }
    return true;
}

// {public: "/", local: "./public/"} match in order
async function host(mapOption = [{ public: "/", local: "./" }], port = 8080) {
    const server = http.createServer((req, res) => {
        console.log("> ", req.method, req.url);
        mapOption.forEach(async (e) => {
            // add slash
            e.public = prependSlash(e.public);
            e.public = appendSlash(e.public);
            e.local = appendSlash(e.local);

            // handle the request
            if (req.url.startsWith(e.public)) {
                let bare = req.url.replace(e.public, "");
                let targetFile;
                if (bare.length === 0) {
                    // if endsWith '/', redirect to 'index.html', no fallback
                    bare = "index.html";
                }
                targetFile = e.local + bare;
                console.log(`   target: ${targetFile}`);

                // check if file is accessable
                if (await isFileAccessible(targetFile)) {
                    // successfully read file
                    const data = await readFile(targetFile);
                    res.writeHead(200);
                    res.end(data);
                } else {
                    return;
                }
            }
        });
        // cannot read file, return 404
        res.setHeader("content-type", "text/html");
        res.writeHead(404);
        res.end(`<html>
        <head><title>404 Not Found</title></head>
        <body>
        <center><h1>404 Not Found</h1></center>
        <hr><center>node.js</center>
        </body>
        </html>`);
    });

    server.listen(port);
    server.on("listening", () =>
        console.log(`> Server listen at http://localhost:${port}`)
    );
}

// host([{ public: "/", local: "./src/" }]);
// or  host([{ public: "/", local: "./src" }]);
// or just  host([{ public: "", local: "./src" }]);

// host([{ public: "/images", local: "./picture" }]);
export default host;
