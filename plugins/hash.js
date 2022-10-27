function hash(str) {
    const Mod = 1000003;
    const Base = 257;

    let buf = iconv.encode(str, 'utf8');
    let ans = 500009;
    for (let i = 0, vr = 199999; i < buf.length; i++) {
        ans += vr * buf[i];
        ans %= Mod;
        vr = vr * Base % Mod;
    }

    return ans;
}
exports.hash = hash;