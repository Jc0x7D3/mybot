const fs = require("fs")
const iconv = require("iconv-lite");

function readFrom(file) {
    var str = fs.readFileSync(file);
    str = iconv.decode(str, 'utf8')
    return str.split('\r\n');
}
function randChoice(list) {
    return list[Math.floor(Math.random() * list.length)]
}

var words = readFrom("./plugins/echo/rec.txt")
var ans = readFrom("./plugins/echo/ans.txt")
var touch = readFrom("./plugins/echo/touch.txt")

const Num = 11;

const fout = fs.createWriteStream("./plugins/echo/rec.txt", {flags: 'a'})

exports.touch = () => {
    return randChoice(touch);
}

exports.get = (str) => {
    if (!(/\u7684$/).test(str)) {
        str = str.replace(/\s/g, '');
        if (!(/\u5417$/).test(str) || str.length <= 3) return null;
        else {
            var buf = iconv.encode(str, 'utf8');
            for (var i = 0, vr = 1, ret = 0; i < buf.length; i++, vr = vr * 256 % Num) {
                ret += vr * buf[i];
                ret %= Num;
            }
            return ans[ret];
        }
    }
    else {
        let word = str.substr(Math.max(0, str.length - 5));

        if (!(words.includes(word))) {
            fout.write("\r\n" + word);
            words.push(word);
        }

        return randChoice(words);
    }
}

const axios = require("axios");

exports.trans = trans;
async function trans(mess) {
    if (str.length < 2 || str.length > 100) throw "Too long / short";

    let url = 'https://www.qiwangming.com/jsjs/process-fzl.php?wm=' + mess.replace(/\s/g,'');

    return axios.get(encodeURI(url))
        .then(res => {
            let ml = res.data.match(/card\-text\"\>(.*?)\<\/\p\>\<\/button\>/);
            return ml[1];
        })
}
