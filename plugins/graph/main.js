// 统一图片类：
// var graph = {
//     title: "title",
//     id: 123546849,
//     small: "https://...",
//     mid: "https://...",
//     org: "https://...",
// }

// 标准错误类
// var err = {
//     err: 1
// }
// 0 非法字符
// 1 网络错误
// 2 找不到图片
// 3 其他错误

const message = require("../message");

// 将统一图片类转化为可以发送的消息类
// 0: XML, 1: 中图片, 2: 原图片, 3: 中图url, 其他: 原图url
function wrap(graph, Shared) {
    if (graph.err != undefined) {
        let reply = Shared.static.reply;
        switch (graph.err) {
            case 0: return reply.invalidReq;
            case 1: return reply.webErr;
            case 2: return reply.strangeXP;
            default: return reply.unknown;
        }
    }
    else {
        let idStr = `Pixiv id: ${graph.id}\n`;
        let fmt = Shared.db.data.value.fmt;
        switch (fmt) {
            case 0:
                return message.xml(
                    graph.title,
                    idStr,
                    graph.small,
                    graph.org);
            case 1: return message.graph(graph.mid);
            case 2: return message.graph(graph.org);
            case 3: return [idStr, graph.mid];
            default: return [idStr, graph.org];
        }
    }
}

const sese = require("./sese");
const CheckReg = /^[0-9A-Za-z\u4e00-\u9fff]+$/

async function tag_sese(str, d) {
    var res, tag;
    console.log(str);
    if (str == "") tag = d[1].db.data.value.tag;
    else tag = str;
    if (CheckReg.test(tag)) {
        res = await sese.sese(tag, d[1].db.data.value.r18);
    }
    else {
        res = { err: 0 };
    }
    return wrap(res, d[1]);
}

exports.sese = tag_sese;