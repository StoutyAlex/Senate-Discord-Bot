"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const message_responder_1 = require("./services/message-responder");
const channel_1 = require("./helpers/channel");
const unique_names_generator_1 = require("unique-names-generator");
const customConfig = {
    dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.animals],
    separator: ' ',
    length: 2,
};
let Bot = class Bot {
    constructor(client, token, messageResponder) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }
    listen() {
        this.client.on('message', (message) => {
            if (message.author.bot) {
                console.log('Ignoring bot message!');
                return;
            }
            console.log("Message received! Contents: ", message.content);
            this.messageResponder.handle(message).then(() => {
                console.log("Response sent!");
            }).catch(() => {
                console.log("Response not sent.");
            });
        });
        this.client.on('voiceStateUpdate', (before, after) => __awaiter(this, void 0, void 0, function* () {
            if (before.channel) {
                if ((before.channel.name !== 'Join Game Room' && before.channel.name !== 'Create Temp Room') && (channel_1.isChannelParentOf(before.channel, 'Gaming') || channel_1.isChannelParentOf(before.channel, 'Temp Rooms'))) {
                    const gameChannel = before.channel;
                    const userSize = gameChannel.members.size;
                    console.log('User size', userSize, gameChannel.name);
                    if (userSize === 0)
                        yield gameChannel.delete();
                }
            }
            if (after.channel) {
                if (after.channel.name === 'Join Game Room') {
                    const playing = after.member.user.presence.activities.find(x => x.type === "PLAYING");
                    if (!playing) {
                        after.member.voice.setChannel(before.channel);
                        return;
                    }
                    const gameChannel = yield channel_1.getChannelByName(after.guild, playing.name);
                    if (gameChannel) {
                        after.member.voice.setChannel(gameChannel);
                        return;
                    }
                    const channel = yield channel_1.createChannel(after.guild, playing.name, 'Gaming');
                    after.member.voice.setChannel(channel);
                }
                if (after.channel.name === 'Create Temp Room') {
                    const randomName = unique_names_generator_1.uniqueNamesGenerator(customConfig).split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
                    const channel = yield channel_1.createChannel(after.guild, randomName, 'Temp Rooms');
                    after.member.voice.setChannel(channel);
                }
            }
        }));
        return this.client.login(this.token);
    }
};
Bot = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.Token)),
    __param(2, inversify_1.inject(types_1.TYPES.MessageResponder)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, message_responder_1.MessageResponder])
], Bot);
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map