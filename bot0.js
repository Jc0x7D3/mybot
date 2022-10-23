'use strict';

//�ͻ�������
const Client = require("./public/clinet")
const client = Client.client
const { segment, Message } = require("oicq");

//�����������
const ctr = require("./public/commandTree").check;
const global = require("./public/global").val;

//������
const calculate = require("./plugins/calc/calc").calc;
const echo = require("./plugins/echo/echo")
const pixiv = require("./plugins/pixiv/pixMain");

//����
var BlackList = new Set([234267997]);
var BotOn = true;
const RootId = 1951360581;
const Self = 514195896;

//������¼
//var listening = new Set();

//����

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
//     //ɨ��󰴻س���¼
//     process.stdin.once("data", () => {
//         this.login()
//     })
// }).login()

client.on("system.online", () => {
    console.log("Success to login!");
    StaticTest();
})

//��̬������
function StaticTest() {

}
//��̬������
function DynamicTest() {

}

//��¼
client.login(global.password);

//��¼ʱ��ʾ

//Ӧ����
client.on("message", e => {
    console.log(e)


    //����Ȩ�޹���
    if (RootId == e.user_id && e.raw_message[0] == '/') {
        var str = e.raw_message.substr(1).toLowerCase();
        console.log("Get root request: ", str);

        let ok = 1;

        ctr(str, {

            //on off
            'on': () => { BotOn = true; },
            'off': () => { BotOn = false; },

            //���������
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

                //����ֵ
                if (res) {
                    let key = res[1], val = res[2];
                    if (key in global) {
                        ok = 1;
                        global[key] = val;
                        global.__write__();
                    }
                }
                //��ȡֵ
                else {
                    if (str in global)
                        e.reply(JSON.stringify(global[str]), true);
                }
            },
        });

        if (ok) e.reply(global.reply.rootOK, true);
        return;
    }

    //�رպͺ���������
    if (!BotOn || BlackList.has(e.user_id)) {
        return;
    }

    //��ͨ������Ӧ
    ctr(firstText(e), {

        //echo����
        '?': (str) => {
            e.reply(str + '?')
        },

        //�������﷭����
        '~': (str) => {
            echo.trans(str)
                .then(res => { e.reply(res); })
                .catch((err) => { console.log("Err: ", err); })
        },

        //������
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

        //����ͼƬ
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

        //Ӧ����
        '$other$': (str) => {
            var ret = echo.get(str);
            if (ret) e.reply(ret);
        }
    })

})

//��һ�Ĺ���
client.on("notice.group.poke", e => {
    if (e.target_id == Self && !BlackList.has(e.operator_id)) {
        e.group.sendMsg(echo.touch())
    }
})



