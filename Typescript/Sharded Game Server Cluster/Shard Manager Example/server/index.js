const path = require("path");
const fs = require("fs");
const child_process = require('child_process');

const distFolder = path.join(__dirname, "..", "dist");

const server = require("./server");

// check if the app has been built...
if (fs.existsSync(distFolder) === false || fs.existsSync(path.join(distFolder, "index.html")) === false) {
    // looks like the app isnt built yet
    console.log("\x1b[33m", "Could not find built production source, building now...", "\x1b[0m");
    // build app
    try {
        child_process.execSync("yarn build", {
            stdio: [0, 1, 2]
        });
        console.log("\x1b[42m\x1b[30m", "Build Successful! Starting Server...", "\x1b[0m");
    } catch (e) {
        console.error("\x1b[41m\x1b[30m", "Build Failed! Throwing...", "\x1b[0m");
        throw e;
        return;
    }
} else {
    console.log("\x1b[42m\x1b[30m", "Build Found, Starting Server...", "\x1b[0m");
}

server.startServer(distFolder);