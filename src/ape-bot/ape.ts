require('dotenv').config();

import container from "./inversify.config";
import { TYPES } from "./types";
import { Bot } from "./bot";

const bot = container.get<Bot>(TYPES.Bot);

const APE_ID = process.env.APE_ID;

bot.listen().then(() => {
  console.log('Logged in!', 'Ape:', APE_ID);
}).catch((error) => {
  console.log('Oh no! ', error)
});
