import fs from "fs/promises";

const isExists = async (filePath) =>
    await fs
        .access(filePath)
        .then(() => true)
        .catch((_) => false);

class FileDB {
    DB_PATH;
    constructor(dbPath = "./db.json") {
        this.DB_PATH = dbPath;
        if (!isExists(this.DB_PATH)) {
            fs.writeFile(this.DB_PATH, "{}", "utf8");
        } else {
            fs.readFile(this.DB_PATH, "utf8").then((data) => {
                try {
                    JSON.parse(data);
                } catch (e) {
                    fs.writeFile(this.DB_PATH, "{}", "utf8");
                }
            });
        }
    }
    async _read() {
        return JSON.parse(await fs.readFile(this.DB_PATH));
    }
    async _write(data) {
        await fs.writeFile(this.DB_PATH, JSON.stringify(data, null, 2));
    }
    async put(data, key) {
        const json = await this._read();
        json[key] = data;
        await this._write(json);
        return data;
    }
    async get(key) {
        const json = await this._read();
        return json[key];
    }
    async insert(data, key) {
        const json = await this._read();
        if (json[key]) throw new Error("Key already exists");
        json[key] = data;
        await this._write(json);
        return data;
    }
    async update(data, key) {
        const json = await this._read();
        if (!json[key]) throw new Error("Key does not exist");
        json[key] = data;
        await this._write(json);
        return data;
    }
    async delete(key) {
        const json = await this._read();
        if (!json[key]) return null;
        delete json[key];
        await this._write(json);
        return null;
    }
}

module.exports = { FileDB };
