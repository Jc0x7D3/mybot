const { read } = require("../../jsonFile");
const iconv = require("iconv-lite");

var config = read("./plugins/ans/ans.json");
var regs = [];
var index = [];

for (let key in config) {
    let val = config[key];
    for (let str of val.reg) {
        console.log('/' + str + '/')
        regs.push(new RegExp(str));
        index.push(key);
    }
}

var size = regs.length;
console.log(size);
for (let i = 0; i < size; i++) {
    console.log(regs[i], index[i]);
}

function roll(poss) {
    return Math.random() <= poss;
}

function randChoice(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function hash(str) {
    const Mod = 1000003;
    const Base = 257;

    let buf = iconv.encode(str, 'utf8');
    let ans = 0;
    for (let i = 0, vr = 1; i < buf.length; i++) {
        vr = vr * Base % Mod;
        ans += vr * buf[i];
        ans %= Mod;
    }

    return ans;
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