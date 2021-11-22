import { createFunctionPrecondition } from '@sapphire/decorators';
import { isNullOrUndefined } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getAdminRole, getModRole } from '../database/util';

export function RequiresGuildAdmin(): MethodDecorator {
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