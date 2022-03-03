import { opendir } from "fs/promises";
async function lsa(path = "./", showHide = false) {
    const files = [],
        folders = [];
    try {
        const dir = await opendir(path);
        for await (const dirent of dir) {
            if (!showHide && dirent.name.startsWith(".")) continue;

            if (dirent.isDirectory()) {
                folders.push(dirent.name);
            } else {
                files.push(dirent.name);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return { folders, files };
}

// ls().then(console.log);
// http://nodejs.cn/api/fs.html#class-fsdirent

export default lsa;
