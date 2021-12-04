import http from "http";
import { readFile, stat } from "fs/promises";

function prependSlash(str) {
    if (str.startsWith("/")) return str;
    else return "/" + str;
}

async function isFileAccessible(targetFile) {
    try {
        return (await stat(targetFile)).isFile();
    } catch {
        return false;
    }
}

// {public: "/", local: "./public/"} match in order
async function host(mapOption = [{ public: "/", local: "./" }], port = 8080) {
    if (typeof port !== "number") throw new Error("port should be a number!");
    const server = http.createServer(async (req, res) => {
        let isSuccess = false;
        console.log("> ", req.method, req.url);
        for (const e of mapOption) {
            let isSkip = false;
            // add slash
            let targetFile = "";
            let bare = "";
            e.public = prependSlash(e.public);

            // handle the request
            if (e.public.endsWith("/")) {
                // for req folder
                if (req.url.startsWith(e.public))
                    bare = req.url.replace(e.public, "");
                else isSkip = true;

                if (bare.length === 0) {
                    // if endsWith '/', redirect to 'index.html', no fallback
                    if (e.local.endsWith("/")) bare = "index.html";
                }
            }
            targetFile = e.local + bare;
            if (isSkip)
                console.log(`   skip: public=${e.public} local=${e.local}`);
            else
                console.log(
                    `   try to access: target=${targetFile} public=${e.public} local=${e.local}`
                );

            // check if file is accessable
            if (!isSkip && (await isFileAccessible(targetFile))) {
                // successfully read file
                // stdout
                console.log(`   target: ${targetFile}`);
                const data = await readFile(targetFile);
                res.writeHead(200);
                res.end(data);
                isSuccess = true;
            }
        }
        // cannot read file, return
        if (!isSuccess) {
            res.setHeader("content-type", "text/html");
            res.writeHead(404);
            res.end(`<html>
        <head><title>404 Not Found</title></head>
        <body>
        <center><h1>404 Not Found</h1></center>
        <hr><center>node.js</center>
        </body>
        </html>`);
        }
    });

    server.listen(port);
    server.on("listening", () =>
        console.log(`> Server listen at http://localhost:${port}`)
    );
}

// host([
//     { public: "/", local: "./src/" },
//     { public: "/test.js", local: "./js/test.js" },
// ]);

// CANNOT USE  host([{ public: "/", local: "./src" }]);
// nut you can  host([{ public: "", local: "./src/" }]);

// host([{ public: "/images/", local: "./picture/" }]);
export default host;
