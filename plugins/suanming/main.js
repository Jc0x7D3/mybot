const { read } = require("../../jsonFile");
var config = read("./plugins/suanming/res.json");
var todos = JSON.stringify(config.todos);
const { at } = require("../message");

const { MersenneTwister19937, shuffle } = require("random-js");
const { parse } = require("oicq/lib/message");

function Mod(a, b) {
    let s = a % b;
    return s >= 0 ? s : s + b;
}

function ming(_, d) {
    var dat = new Date();
    let arr = [
        d[0].sender.user_id,
        dat.getFullYear(),
        dat.getMonth() + 1,
        dat.getDate(),
        114514,
        1919810,
        233333,
    ]
    let engine = MersenneTwister19937
        .seedWithArray(arr);
    
    for (let k = 0; k < 10; k++){
        engine.next()
    }
    
    let rsi = Mod(engine.next(), 7);
    let to = 1 + rsi + Mod(engine.next(), 3) - 2;
    let unto = 7 - rsi + Mod(engine.next(), 3) - 2;

    let shuffled = shuffle(engine, JSON.parse(todos));
    
    var mess = [];
    if (rsi == 0) {
        mess.push(config.bad);
    }
    else if (rsi == 6) {
        mess.push(config.good);
    }
    else {
        mess.push(config.goods);
        mess = mess.concat(shuffled.slice(0, to));
        mess.push(config.bads);
        mess = mess.concat(shuffled.slice(to, to + unto));
    }

    return [at(arr[0]), `\n${arr[2]}月${arr[3]}日运势:${config.rs[rsi]}\n${mess.join("\n")}`];
}

exports.ming = ming;