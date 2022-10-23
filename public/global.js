var globalVals = {
    password: "?name=Jc03",
    reply: {
        rootOK: "\u6536\u5230\uFF0C\u4E3B\u4EBA\uFF01",
        strangeXP: "\u867D\u6027\u81EA\uFF0C\u4F46\u5EFA\u533B",
        pixivNoId: "\u8FD9\u56FE\u5C0F\u5B69\u5B50\u4E0D\u8981\u770B\uFF08\u56FE\u7247\u4E0D\u5B58\u5728\u6216\u4E3A\u9650\u5236\u7EA7\uFF09",
        searchNoGraph: "\u8001\u5A18\u627E\u4E0D\u5230\u8FD9\u5F20\u56FE",
        setull: "\u5b66\u4e60\u8d44\u6599\u6765\u55bd",
    }
};

const jf = require(__dirname + "/jsonFile");
var dynamicVals = jf.read(__dirname + "/dynamic.json");

for (key in dynamicVals) globalVals[key] = dynamicVals[key];

globalVals.__write__ = function () {
    let obj = {};
    for (key in dynamicVals) obj[key] = globalVals[key];
    console.log(obj);
    jf.write("./public/dynamic.json", obj);
}

//console.log("dynamicVals: ", dynamicVals);
//console.log("globalVals: ", globalVals);

exports.val = globalVals;