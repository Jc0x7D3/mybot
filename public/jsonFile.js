const fs = require("fs");
const ic = require("iconv-lite");

exports.read = (path) => {
    let buffer = fs.readFileSync(path);
    return JSON.parse(ic.decode(buffer, "utf-8"));
}

exports.write = (path, obj) => {
    let buffer = ic.encode(JSON.stringify(obj), "utf-8");
    fs.writeFileSync(path, buffer);
}