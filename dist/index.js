"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);
const fork = util.promisify(require('child_process').fork);
;
const { APE_BOT_TOKEN_1, APE_BOT_TOKEN_2 } = process.env;
const apes = [{ TOKEN: APE_BOT_TOKEN_1 }, { TOKEN: APE_BOT_TOKEN_2 }];
apes.forEach((ape, index) => {
    spawn(`node ./dist/ape-bot/ape.js`, { env: Object.assign(Object.assign({}, ape), { APE_ID: index }), cwd: undefined, stdio: 'inherit', shell: true });
});
spawn('node ./dist/senate-bot/index.js', { env: { TOKEN: process.env.SENATE_BOT_TOKEN }, cwd: undefined, stdio: 'inherit', shell: true });
//# sourceMappingURL=index.js.map