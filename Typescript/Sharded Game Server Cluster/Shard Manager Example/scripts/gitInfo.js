const child_process = require('child_process');

module.exports = function getGitInfo() {
    try {
        let commitHash = child_process.execSync('git rev-parse HEAD').toString().replace('\n', '');
        let branch = new RegExp(/(\*\ )\w+/g).exec(child_process.execSync('git branch').toString().replace('\n', ''))[0];
        return {
            commitHash,
            branch
        }
    } catch (error) {
        return {
            commitHash: "",
            branch: ""
        }
    }
};