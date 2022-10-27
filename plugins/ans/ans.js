const { read } = require("../../jsonFile");
const { hash } = require("../hash");

var config = read("./plugins/ans/ans.json");
var regs = [];
var index = [];

for (let key in config) {
    let val = config[key];
    for (let str of val.reg) {
        regs.push(new RegExp(str));
        index.push(key);
    }
}

var size = regs.length;

function roll(poss) {
    return Math.random() <= poss;
}

function randChoice(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function Answer(str) {
    for (let i = 0; i < size; i++) {
        if (regs[i].test(str)) {
            let action = config[index[i]];
            if (roll(action.pos)) {
                if (action.rand) {
                    return randChoice(action.ans);
                }
                else {
                    return action.ans[hash(str) % action.ans.length];
                }
            }
            else {
                return;
            }
        }
    }
}

exports.ans = Answer;