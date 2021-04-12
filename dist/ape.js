"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const inversify_config_1 = require("./inversify.config");
const types_1 = require("./types");
const bot = inversify_config_1.default.get(types_1.TYPES.Bot);
const APE_ID = process.env.APE_ID;
bot.listen().then(() => {
    console.log('Logged in!', 'Ape:', APE_ID);
}).catch((error) => {
    console.log('Oh no! ', error);
});
//# sourceMappingURL=ape.js.map