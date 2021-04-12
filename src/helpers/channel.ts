import { Channel, Client, Guild, GuildChannel, VoiceChannel } from "discord.js"

const createChannel = async (client: Guild, channelName: string, categoryName: string) => {
  const category = getCategoryByName(client, categoryName);
  const newChannel = await client.channels.create(channelName, { reason: 'Testing channel', parent: category, type: 'voice' });
  return newChannel;
};

const getChannelByName = (guild: Guild, name: string) => {
  const channelName = name.toLowerCase();

  const channel = guild.channels.cache.find((channel: GuildChannel) =>
    (channel.type === 'voice' && channel.name.toLowerCase() === channelName));
  
  return channel;
};

const getCategoryByName = (guild: Guild | Client, name: string) => {
  const categoryName = name.toLowerCase();

  const category = guild.channels.cache.find((channel: GuildChannel) =>
    (channel.type === 'category' && channel.name.toLowerCase() === categoryName));

  return category;
};

const isChannelParentOf = (channel: VoiceChannel, parent: string) => {
  const categoryName = parent.toLowerCase();
  return channel.parent.name.toLowerCase() === categoryName;
}

export { createChannel, getCategoryByName, getChannelByName, isChannelParentOf };
