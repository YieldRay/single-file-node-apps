import crypto from "crypto";
const createHmac = (algorithm, data, salt, digest = "hex") => crypto.createHmac(algorithm, salt).update(data).digest(digest);

export default class {
    constructor(salt = "", algorithm = "sha256") {
        this.salt = salt;
        this.algorithm = algorithm;
    }
    check(input, password) {
        return createHmac(this.algorithm, input, this.salt) === password;
    }
    encrypt(input) {
        return createHmac(this.algorithm, input, this.salt);
    }
}
