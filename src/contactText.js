import fs from "fs/promises";
async function getString(path) {
    return (await fs.readFile(path)).toString();
}

export default async function (dist, ...sources) {
    try {
        const fileStat = await fs.stat(dist);
        if (fileStat.isFile()) {
            // 文件存在
            throw new Error(`Target '${dist}' already exists!`);
        } else {
            throw new Error(`Target '${dist}' is a folder!`);
        }
    } catch {
        // 文件不存在
        let combined = "";
        for (let filepath of sources) {
            combined += await getString(filepath);
            // combined += (await getString(filepath)) + "\r\n";
        }
        return fs.writeFile(dist, combined);
    }
}
