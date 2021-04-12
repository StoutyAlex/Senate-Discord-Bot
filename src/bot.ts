import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { MessageResponder } from "./services/message-responder";
import { createChannel, getChannelByName, isChannelParentOf } from "./helpers/channel";

import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  separator: ' ',
  length: 2,
};

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;
  private messageResponder: MessageResponder;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder) {
    this.client = client;
    this.token = token;
    this.messageResponder = messageResponder;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      if (message.author.bot) {
        console.log('Ignoring bot message!')
        return;
      }

      console.log("Message received! Contents: ", message.content);

      this.messageResponder.handle(message).then(() => {
        console.log("Response sent!");
      }).catch(() => {
        console.log("Response not sent.")
      })
    });

    this.client.on('voiceStateUpdate', async (before, after) => {

      if (before.channel) {
        if ((before.channel.name !== 'Join Game Room' && before.channel.name !== 'Create Temp Room') && (isChannelParentOf(before.channel, 'Gaming') || isChannelParentOf(before.channel, 'Temp Rooms'))) {
          const gameChannel = before.channel;
          const userSize = gameChannel.members.size;

          console.log('User size', userSize, gameChannel.name);

          if (userSize === 0) await gameChannel.delete();
        }
      }

      if (after.channel) {
        if (after.channel.name === 'Join Game Room') {
          const playing = after.member.user.presence.activities.find(x => x.type === "PLAYING");

          if (!playing) {
            after.member.voice.setChannel(before.channel);
            return;
          }

          const gameChannel = await getChannelByName(after.guild, playing.name);

          if (gameChannel) {
            after.member.voice.setChannel(gameChannel);
            return;
          }

          const channel = await createChannel(after.guild, playing.name, 'Gaming');
          after.member.voice.setChannel(channel);
        }

        if (after.channel.name === 'Create Temp Room') {
          const randomName = uniqueNamesGenerator(customConfig).split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');

          const channel = await createChannel(after.guild, randomName, 'Temp Rooms');
          after.member.voice.setChannel(channel);
        }
      }
    })

    return this.client.login(this.token);
  }
}
