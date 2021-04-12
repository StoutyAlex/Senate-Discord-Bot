"use strict";
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
exports.isChannelParentOf = exports.getChannelByName = exports.getCategoryByName = exports.createChannel = void 0;
const createChannel = (client, channelName, categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const category = getCategoryByName(client, categoryName);
    const newChannel = yield client.channels.create(channelName, { reason: 'Testing channel', parent: category, type: 'voice' });
    return newChannel;
});
exports.createChannel = createChannel;
const getChannelByName = (guild, name) => {
    const channelName = name.toLowerCase();
    const channel = guild.channels.cache.find((channel) => (channel.type === 'voice' && channel.name.toLowerCase() === channelName));
    return channel;
};
exports.getChannelByName = getChannelByName;
const getCategoryByName = (guild, name) => {
    const categoryName = name.toLowerCase();
    const category = guild.channels.cache.find((channel) => (channel.type === 'category' && channel.name.toLowerCase() === categoryName));
    return category;
};
exports.getCategoryByName = getCategoryByName;
const isChannelParentOf = (channel, parent) => {
    const categoryName = parent.toLowerCase();
    return channel.parent.name.toLowerCase() === categoryName;
};
exports.isChannelParentOf = isChannelParentOf;
//# sourceMappingURL=channel.js.map