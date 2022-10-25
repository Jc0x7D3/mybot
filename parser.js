const { read } = require("./jsonFile");

var grTree = {};

function load_pr(tree, conf, path) {
    // 三种节点类型：叶子($function[, $dir])，别名($alias)，子命令($cmd[, $dir])
    let np = (conf.$dir) ? path + conf.$dir : path;

    if (conf.$function) {
        tree.$ = require(np)[conf.$function];
    }
    else {
        var cmd = conf.$cmd;
        for (let key in cmd) {
            let val = cmd[key];
            if (val.$alias) continue;
            tree[key] = {};
            load_pr(tree[key], val, np);
        }
        for (let key in cmd) {
            if (cmd[key].$alias) {
                tree[key] = { $: tree[cmd[key].$alias].$ };
            }
        }
    }
}

function headOf(Comm, head) {
    if (Comm.length < head.length) return false;

    let same = true;
    for (let i = 0; i < head.length; i++) {
        if (head[i] != Comm[i]) {
            same = false;
            break;
        }
    }
    return same;
}

function match(command, tree, params) {
    var comm = command.replace(/^\s*/, '');

    for (let key in list) {
        if (key === otherStr) continue;

        if (headOf(comm, key)) {
            let newComm = comm.substr(key.length).replace(/^\s*/, '');

            //
            if (typeof list[key] === "string") key = list[key];

            //Ö´ÐÐ
            if (typeof list[key] === "function") list[key](newComm);
            else throw "Command parsing failure!";

            return;
        }
    }

    if (otherStr in list) list[otherStr](comm);
}

function load(filename) {
    var config = read(filename);
    load_pr(grTree, config, '');
    console.log(grTree);
}

const otherStr = "$default";

function parse(str, params) {
    cmd = str.replace(/^\s*/, '');
    let tree = grTree;
    while (true) {
        let matched = false;
        for (let key in tree) {
            if (key === otherStr) continue;
            let val = tree[key];
            if (headOf(cmd, key)) {
                cmd = cmd.substr(key.length).replace(/^\s*/, '');
                if (val.$) {
                    return (val.$)(cmd, params);
                }
                else {
                    tree = val;
                    matched = true;
                    break;
                }
            }
        }
        if (!matched) {
            if (otherStr in tree) return (tree[otherStr].$)(cmd, params);
            else break;
        }
    }
}

exports.load_config = load;
exports.parse = parse;