import * as fs from "fs/promises";
import http from "http";

async function init(jsonFilePath) {
    if (typeof jsonFilePath !== "string") throw new Error("jsonFilePath should be a string!");
    try {
        if ((await fs.stat(jsonFilePath)).isFile()) {
            const data = await fs.readFile(jsonFilePath, "utf8");
            if (data.length === 0) await fs.writeFile(jsonFilePath, "{}", "utf8");
            return true;
        }
    } catch {
        return await fs.writeFile(jsonFilePath, "{}", "utf8");
    }
}

const CURD = {
    keys: {
        create: ["create", "add", "c"],
        update: ["update", "set", "u"],
        retrieve: ["retrieve", "get", "r"],
        delete: ["delete", "remove", "d"],
    },
    tempData: null,
    // request -> readDatabase -> CURD -> writeDatabase
    async readDatabase(jsonFilePath) {
        // only read once
        if (!!!this.tempData) {
            const data = await fs.readFile(jsonFilePath, "utf8");
            this.tempData = JSON.parse(data);
        }
        return this.tempData;
    },
    async writeDatabase(jsonFilePath) {
        // only write once
        if (this.tempData === null) this.tempData = {};
        const result = await fs.writeFile(jsonFilePath, JSON.stringify(this.tempData), "utf8");
        this.tempData = null;
        return result;
    },

    // namespace: ["path1", "path2", "path3(max)"], [""] as global which is not allowed, avoid using  it, check before
    // Written by Copilot...
    create(namespace, val) {
        val = String(val);
        if (this.tempData[namespace] === undefined) {
            this.tempData[namespace] = val;
            return true;
        }
        return false;
    },
    update(namespace, val) {
        val = String(val);
        if (this.tempData[namespace] !== undefined) {
            this.tempData[namespace] = val;
            return true;
        }
        return false;
    },
    retrieve(namespace) {
        if (this.tempData[namespace] !== undefined) {
            return this.tempData[namespace];
        }
        return null;
    },
    delete(namespace) {
        if (this.tempData[namespace] !== undefined) {
            delete this.tempData[namespace];
            return true;
        }
        return false;
    },
};

function htmlTempale(html) {
    return `<!DOCTYPE html><html><head><title>JSON Hosting</title></head><body><h1>JSON Hosting</h1>${html}</body></html>`;
}

function res400(res, msg) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(htmlTempale(`<p>${msg}</p>`));
}

// only use GET
async function host(jsonFilePath = "data.json", port = 8000) {
    if (typeof port !== "number") throw new Error("port should be a number!");
    await init(jsonFilePath);
    const server = http.createServer(async (req, res) => {
        if (req.url === "/favicon.ico") return;
        console.log("> ", req.method, req.url);
        if (req.method === "GET") {
            const requestURL = new URL("http://0.0.0.0" + req.url);
            const path = requestURL.search ? requestURL.pathname.replace(requestURL.search) : requestURL.pathname;
            if (path === "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(
                    htmlTempale(`
                        <h2> GET /{namespace}={value(ifNeeded)} </h2>
                        <p> where namespace should fit /^[a-zA-Z_][a-zA-Z0-9_]*$/</p>
                        <p> where actionName is one of:</p>
                        <ul>
                            <li>c create add - if item is not exist, create with input value and return true, otherwise return false</li>
                            <li>u update set - if item already exists, return false, otherwise update with input value</li>
                            <li>r retrieve get - if item is not exist, return false, otherwise return requested item</li>
                            <li>d delete remove - if item is not exist, return false, otherwise delete requested item</li>
                        </ul>
                        <h2>Example:</h2>
                        <ul>
                            <li>GET /path1=test_string?create</li>
                            <li>GET /path1?update=new_test_string</li>
                            <li>GET /path1?retieve</li>
                            <li>GET /path1?delete</li>
                        </ul>
                        <h2>Response</h2>
                        <code>{"statue":Boolean, "data":String}</code>
                        <p> if action name is not set, alaways return false</p>
                        <p> only first valid action will be executed</p>
                    `)
                );
                return;
            }
            const namespace = path.slice(1);
            const response = { success: false, data: "" };
            if (namespace.length === 0 || namespace.length > 255 || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(namespace) === false) {
                response.data = "namespace should fit /^[a-zA-Z_][a-zA-Z0-9_]*$/";
            } else {
                const params = requestURL.searchParams;
                // handle CreateUpdateRetrieveDelete,read json file, execute actions from left to right, then store data back to json file
                if (!(await CURD.readDatabase(jsonFilePath))) res400(res, "read json file failed!");
                res.writeHead(200, { "Content-Type": "application/json" });
                let isNoSearch = true;
                for (const key of params.keys()) {
                    isNoSearch = false;
                    if (CURD.keys.create.includes(key)) {
                        //c
                        response.success = CURD.create(namespace, params.get(key));
                        break;
                    } else if (CURD.keys.update.includes(key)) {
                        //u
                        response.success = CURD.update(namespace, params.get(key));
                        break;
                    } else if (CURD.keys.retrieve.includes(key)) {
                        //r
                        response.data = CURD.retrieve(namespace);
                        response.success = Boolean(response.data);
                        break;
                    } else if (CURD.keys.delete.includes(key)) {
                        //d
                        response.success = CURD.delete(namespace);
                    } else {
                        response.success = false;
                        response.data = "invalid action name!";
                    }
                }
                if (isNoSearch) response.data = "no action name!";
            }
            res.end(JSON.stringify(response));
            if (!(await CURD.writeDatabase(jsonFilePath))) res400(res, "write json file failed!");
            return;
        } else {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end(htmlTempale(`<p> Method is not Supported! </p>`));
            return;
        }
    });
    server.listen(port);
    console.log(`Server is running at http://localhost:${port}/`);
}

export default host;
