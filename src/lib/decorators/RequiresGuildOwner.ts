import { createFunctionPrecondition } from '@sapphire/decorators';
import type { Message } from 'discord.js';

export function RequiresGuildOwner(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		const guildOwner = await message.guild!.fetchOwner();
        if (message.member!.id === guildOwner.id) {
            return true;
        }
        else {
            message.channel.send('This command can only be run by the server owner!')
            return false;
        }
	});
}