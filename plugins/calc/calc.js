
/*

. ( ) # { }
+ - * /
sin cos tan
exp log ln lg
sqrt pow
pi e

inte
sum
mult

sum(#x{x*log(2,x)},1,2)
ans=sum((x)=>{return x*log(2,x)},1,2)
#x{   ===>>>  'x',()=>{return_
*/

var endTime;
exports.rule = {
    timeLimit: 2000,
    diffNum: 5000,
};

var $ = {
    ans: 0,

    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,

    exp: Math.exp,
    ln: Math.log,
    lg: Math.log10,
    log: (a, x) => { return Math.log(x) / Math.log(a) },

    sqrt: Math.sqrt,
    pow: Math.pow,

    pi: Math.PI,
    e: Math.E,

    sum: sum,
    int: inte,
};

$.__proto__ = null;

var $son = new Set();

function isNormNum(x) {
    return ((typeof x) == 'number' && isFinite(x) && !isNaN(x))
}

function sum(syb, func, lb, ub) {
    if (!isNormNum(lb) || !isNormNum(ub)) throw "Bound Error";
    if (syb in $) throw "Redefinition";

    var res = 0;
    $son.add(syb);
    for ($[syb] = Math.ceil(lb); $[syb] <= ub; $[syb]++) {
        if (Date.now() > endTime) throw "Time Out";
        res += func();
    }

    delete $[syb];
    $son.delete(syb);
    return res;
}

function inte(syb, func, lb, ub) {
    if (!isNormNum(lb) || !isNormNum(ub)) throw "Bound Error";
    if (syb in $) throw "Redefinition";

    var diffNum = exports.rule.diffNum;

    $son.add(syb);
    $[syb] = ub;
    var sum1 = func() / 2.0;
    $[syb] = lb
    var sum2 = -func() / 4.0;
    var vec = 1.0 * (ub - lb) / diffNum;
    for (var k = 0; k < diffNum; k += 2) {
        if (Date.now() > endTime) throw "Time Out";
        $[syb] = lb + vec * k;
        sum1 += func();
        $[syb] = lb + vec * (k + 1);
        sum2 += func();
    }

    delete $[syb];
    $son.delete(syb);
    return (sum1 * 2 + sum2 * 4) * vec / 3;
}

function pre(str) {
    str = `(${str.toLowerCase()})`;

    if (!(/^[\+\-\*\/\)\(\.\#\{\}\,a-z0-9]+$/).test(str)) return null;
    str = 'ans=' + str;

    set = new Set();
    arr = str.match(/\b[a-z]+[^a-z]/g);
    if (arr) {
        arr.forEach((x) => { set.add(x.substr(0, x.length - 1)) });
        set.forEach((x) => {
            str = str.replace(new RegExp(x, "g"), "$." + x);
        })
    }

    set = new Set();
    arr = str.match(/#\$\.[a-z]+\{/g);
    if (arr) {
        arr.forEach((x) => { set.add(x) });
        set.forEach((x) => {
            x = x.replace('#$.', '');
            x = x.replace('{', '');

            str = str.replace(
                new RegExp('\\#\\$\\.' + x + '\\{', "g"),
                "'" + x + "',()=>{return ");
        })
    }

    return str;
}

exports.calc = function (str) {
    if (str.length > 200) return "Too Long";
    if (!(str = pre(str))) return "Symbol Error";
    console.log(str);

    console.log($son);
    $son.forEach((x) => { delete $[x]; });

    $son.clear();

    endTime = Date.now() + exports.rule.timeLimit;
    try {
        eval(str);
    }
    catch (err) {
        return err.toString();
    }

    var rt;

    if (!isNormNum($.ans)) {
        $.ans = 0;
        rt = "Invalid Answer";
    }
    rt = $.ans.toFixed(6);

    return rt;
}

//var s = "int(#x{int(#y{sqrt(1-y*y)},0,sqrt(1-x*x))},0,1)*4";

