import { opendir } from "fs/promises";
async function ls(path = "./", onlyFiles = false, showHideFiles = false) {
    const files = [];
    try {
        const dir = await opendir(path);
        for await (const dirent of dir) {
            if (!showHideFiles && dirent.name.startsWith(".")) continue;
            
            if (dirent.isDirectory()) {
                if (!onlyFiles) files.push(dirent.name + "/");
            } else {
                files.push(dirent.name);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return files;
}

// ls().then(console.log);
// http://nodejs.cn/api/fs.html#class-fsdirent

export default ls;
