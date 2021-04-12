import { Client, Message, VoiceChannel } from 'discord.js';
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { MessageResponder } from './services/message-responder';

const fs = require('fs');

import { uniqueNamesGenerator, Config, adjectives } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives],
  separator: '',
  length: 1,
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
        console.log('Ignoring bot!')
        return;
      }

      console.log("Message received! Contents: ", message.content);
    });

    this.client.on('voiceStateUpdate', async (before, after) => {
      if (after.channel && after.channel.name.toLowerCase().includes('ape room')) {

        const alreadyInRoom = after.channel.members.find(member => member.id === this.client.user.id);
        if (!alreadyInRoom) {
          const randomName = uniqueNamesGenerator(customConfig);
          const botName = randomName.charAt(0).toUpperCase() + randomName.slice(1) + ' Ape'
          
          const connection = await after.channel.join();

          try {
            connection.channel.members.find(member => member.id === this.client.user.id).setNickname(botName);
          } catch (error) {
            console.log('Name change too soon try again later', error);
          }

          const randomWait = Math.floor(Math.random() * 4) + 0 * 1000;

          console.log('Waiting for:', randomWait);

          setTimeout(async () => {
            try {
              const dispatcher = await connection.play('./assets/monke.mp3')
                
              dispatcher.on('finish', () => {
                connection.play('./assets/monke.mp3')
              });
  
            } catch (error) {
              console.log('Error playing audio file', error)
            }
          }, randomWait * 1000);

        }
      }

      if (before.channel && before.channel.name.toLowerCase().includes('ape room')) {
        console.log('User left the ape room');

        const userSize = before.channel.members.size;
        
        if (userSize === 2) {
          before.channel.leave();
        }
      }
    })

    return this.client.login(this.token);
  }
}
