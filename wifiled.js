var net = require('net');
var wifiled = module.exports;

let operations = {
    on:     [ 0x71, 0x23, 0x0f ],
    off:    [ 0x71, 0x24, 0x0f ],
    query:  [ 0x81, 0x8a, 0x8b ],
    color_pre:  [ 0x31 ],
    color_post: [ 0x00, 0x00, 0x0f ],
}

let client;
let query = false;
 
wifiled.connect = (host) => {

    client = new net.Socket();
    client.connect(5577, host);

    client.on('data', function(data) {
        if (query) wifiled.decode(data);
        client.destroy(); // kill client after server's response
    });

    client.on('close', function() {
        console.log('Connection closed');
    });

}

wifiled.status = () => {
    query = true;
    client.write(wifiled.code(operations.query));
}

wifiled.on = () => {
    client.write(wifiled.code(operations.on));
}

wifiled.off = () => {
    client.write(wifiled.code(operations.off));
}

wifiled.color = (r,g,b) => {
    client.write(wifiled.code([].concat(operations.color_pre , r , g , b , operations.color_post)));
}

wifiled.code = (seq) => {
    console.log(seq);
    let checksum=0;

    seq.forEach((digit) => { checksum += parseInt(digit); });

    seq.push(checksum & 0xff);

    let ret = new Buffer(seq.map((d) =>  parseInt(d)));

    return ret;
}

wifiled.decode = (data) => {
    let ret = {
        power: data[2] == 35,
        mode: data[3],
        running: data[4],
        speed: data[5],
        red: data[6],
        green: data[7],
        blue: data[8],
    }

    console.log(ret);
}
