#!/usr/bin/env node

var wifiled = require('./wifiled');

let host = process.argv[2];
let op = process.argv[3];

if (!op || !host) {
    console.log("Usage:", process.argv[1], " <host> <operation>");
    process.exit(1);
}

wifiled.connect(host);
switch (op) {
    case 'on': wifiled.on(); break;
    case 'off': wifiled.off(); break;
    case 'status': wifiled.status(); break;
    case 'color': wifiled.color(process.argv[4], process.argv[5], process.argv[6]); break;
    default: status;
}
