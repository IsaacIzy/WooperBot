import { send } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed} from 'discord.js';
import { RandomLoadingMessage } from './constants';

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
	return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

/**
 * Sends a nice formatted help message for a command
 * @param message The message that triggered the command
 * @param name The name of the command
 * @param description The description of the command
 * @param detailedDescription Additional details about the commands functionality
 */
export async function sendHelpMessage(message: Message, name: string, description: string, detailedDescription: string) {
	const helpEmbed = new MessageEmbed()
		.setTitle(name)
		.setDescription(description)
		.addField('Usage and examples', detailedDescription);
	await message.channel.send({embeds: [helpEmbed]})
	return;

}
