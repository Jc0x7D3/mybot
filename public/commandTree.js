const otherStr = '$other$';

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

exports.check = function (command, list) {
    var comm = command.replace(/^\s*/, '');

    for (let key in list) {
        if (key === otherStr) continue;

        if (headOf(comm, key)) {
            let newComm = comm.substr(key.length).replace(/^\s*/, '');

            //ÃüÁî±ðÃû
            if (typeof list[key] === "string") key = list[key];

            //Ö´ÐÐ
            if (typeof list[key] === "function") list[key](newComm);
            else throw "Command parsing failure!";

            return;
        }
    }

    if (otherStr in list) list[otherStr](comm);
}