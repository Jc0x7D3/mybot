'use strict';

//客户端配置
const Client = require("./public/clinet")
const client = Client.client
const { segment, Message } = require("oicq");

//导入基础功能
const ctr = require("./public/commandTree").check;
const global = require("./public/global").val;

//导入插件
const calculate = require("./plugins/calc/calc").calc;
const echo = require("./plugins/echo/echo")
const pixiv = require("./plugins/pixiv/pixMain");

//常数
var BlackList = new Set([234267997]);
var BotOn = true;
const RootId = 1951360581;
const Self = 514195896;

//其他记录
//var listening = new Set();

//功能

function makeXML(Title, Summary, CoverURL, url) {
    return (segment.xml(
        `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>\
<msg serviceID="1" templateID="-1" action="web" brief="${Title}" sourceMsgId="0" url="" flag="0" adverSign="0" multiMsgFlag="0">\
<item layout="2" advertiser_id="0" aid="0">\
<picture cover="${CoverURL}" w="0" h="0" action="web" url="${url}"/>\
<title>${Title}</title>\
<summary>${Summary}</summary>\
</item>\
<source name="" icon="" action="" appid="0" />\
</msg>`))
}

function getGroupRefered(e) {
    if (!e.source || !e.group) {
        throw "Not (ref & in group)";
    }
    else {
        return e.group.getChatHistory(e.source.seq, 1)
            .then(res => res[0])
            .then(res => {
                if (res.seq != e.source.seq) throw "Not found.";
                else return res;
            })
    }
}
function firstText(e) {
    var ms = e.message;
    for (let i = 0; i < ms.length; i++) {
        if (ms[i].type == 'text') return ms[i].text;
    }
    return "";
}

// client.on("system.login.qrcode", function (e) {
//     //扫码后按回车登录
//     process.stdin.once("data", () => {
//         this.login()
//     })
// }).login()

client.on("system.online", () => {
    console.log("Success to login!");
    StaticTest();
})

//静态测试区
function StaticTest() {

}
//动态测试区
function DynamicTest() {

}

//登录
client.login(global.password);

//登录时提示

//应答功能
client.on("message", e => {
    console.log(e)


    //顶级权限功能
    if (RootId == e.user_id && e.raw_message[0] == '/') {
        var str = e.raw_message.substr(1).toLowerCase();
        console.log("Get root request: ", str);

        let ok = 1;

        ctr(str, {

            //on off
            'on': () => { BotOn = true; },
            'off': () => { BotOn = false; },

            //封禁两件套
            'ban': () => {
                e.message.forEach((obj) => {
                    if (obj.type == 'at') {
                        BlackList.add(obj.qq);
                    }
                })
            },
            'pardon': () => {
                e.message.forEach((obj) => {
                    if (obj.type == 'at' && BlackList.has(obj.qq)) {
                        BlackList.delete(obj.qq);
                    }
                })
            },

            '$other$': (str) => {
                if (str == "") DynamicTest();

                ok = 0;
                let res = /^(\S+?)\s+(\S.*?)$/.exec(str);
                console.log("Exec: ", res);

                //设置值
                if (res) {
                    let key = res[1], val = res[2];
                    if (key in global) {
                        ok = 1;
                        global[key] = val;
                        global.__write__();
                    }
                }
                //获取值
                else {
                    if (str in global)
                        e.reply(JSON.stringify(global[str]), true);
                }
            },
        });

        if (ok) e.reply(global.reply.rootOK, true);
        return;
    }

    //关闭和黑名单拦截
    if (!BotOn || BlackList.has(e.user_id)) {
        return;
    }

    //普通请求响应
    ctr(firstText(e), {

        //echo调试
        '?': (str) => {
            e.reply(str + '?')
        },

        //非主流语翻译器
        '~': (str) => {
            echo.trans(str)
                .then(res => { e.reply(res); })
                .catch((err) => { console.log("Err: ", err); })
        },

        //计算器
        '%': (str) => {
            e.reply(calculate(str), true);
        },

        //sese
        'sese': (str) => {
            pixiv.sese(str)
                .then((res) => {
                    console.log(res);
                    if (!res) e.reply(global.reply.strangeXP, true);
                    else {
                        let XML =
                            makeXML(global.reply.setull,
                                `Pixiv id: ${res.id}\n-By Async's Bot`,
                                res.cover,
                                res.org);
                        Client.group.sendMsg(XML);
                        //e.reply(XML);
                    }
                })
        },
        'se': "sese",
        '-': "sese",

        //查找图片
        'search': () => {
            getGroupRefered(e)
                .then(ref => {
                    if (!ref) throw "Ref not found";

                    ref.message.forEach(obj => {
                        if (obj.type == 'image') {
                            pixiv.searchURL(obj.url)
                                .then(res => {
                                    if (res) e.reply(res, true);
                                    else e.reply(global.reply.searchNoGraph, true);
                                })
                                .catch((err) => { console.log("Err: ", err); });
                        }
                    })

                })
                .catch(err => {
                    console.log(err);
                });
        },
        'fd': "search",

        //pixiv
        '#': (str) => {
            ctr(str, {
                '#': (id) => {
                    pixiv.id(id)
                        .then((urls) => {
                            let Ret = "";
                            for (let i = 0; i < 3; i++) {
                                if (urls[i]) {
                                    Ret += urls[i];
                                    Ret += "\n";
                                }
                            }
                            if (urls.length > 3) Ret += `${urls.length - 3} more...`;
                            else e.reply(Ret);
                        })
                },
                //'$other$': (tag) => {
                //    pixiv.tag(tag)
                //        .then((res) => {
                //            console.log(res);
                //            if (!res) e.reply(global.reply.strangeXP, true);
                //            else e.reply(res);
                //        })
                //},
            });
        },

        //应答功能
        '$other$': (str) => {
            var ret = echo.get(str);
            if (ret) e.reply(ret);
        }
    })

})

//拍一拍功能
client.on("notice.group.poke", e => {
    if (e.target_id == Self && !BlackList.has(e.operator_id)) {
        e.group.sendMsg(echo.touch())
    }
})



