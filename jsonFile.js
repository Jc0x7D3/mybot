'use strict';

const fs = require("fs");
const ic = require("iconv-lite");

function flush() {
    let buffer = ic.encode(JSON.stringify(this.data), this.encoding);
    fs.writeFileSync(this.path, buffer);
}

function JsonFile(path, encoding = "utf-8") {
    this.path = path;
    this.encoding = encoding;
    if (fs.existsSync(path)) {
        let buffer = fs.readFileSync(path);
        this.data = JSON.parse(ic.decode(buffer, encoding));
    }
    else {
        this.data = {};
    }
}

function read(path, encoding = "utf-8") {
    return (new JsonFile(path, encoding)).data;
}

JsonFile.prototype.flush = flush;

exports.JsonFile = JsonFile;
exports.read = read;