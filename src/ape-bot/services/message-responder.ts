import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class MessageResponder {

  constructor() {}

  handle(message: Message): Promise<Message | Message[]> {
    return Promise.reject();
  }
}