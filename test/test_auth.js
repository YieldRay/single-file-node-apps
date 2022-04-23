import Auth from "../src/auth.js";
const auth = new Auth("salt$", "md5");
const rawPassword = "password";
const encrypted = auth.encrypt(rawPassword);
const isSame = auth.check(rawPassword, encrypted);
console.log(encrypted, isSame);
