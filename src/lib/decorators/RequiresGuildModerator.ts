import { createFunctionPrecondition } from '@sapphire/decorators';
import { isNullOrUndefined } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getAdminRole, getModRole } from '../database/util';

export function RequiresGuildModerator(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		const modRole = await getModRole(message.guild!);
		const adminRole = await getAdminRole(message.guild!);
		const guildOwner = await message.guild!.fetchOwner();
		if(isNullOrUndefined(modRole) || isNullOrUndefined(adminRole)) {
			message.channel.send('Server owner must set a mod/admin roles with \`\`\`setrole\`\`\` before you can use this command');
			return false;
		}
		else {
			// console.log(`has mod role: ${message.member!.roles.cache.has(modRole)}`);
			// console.log(`has admin role: ${message.member!.roles.cache.has(adminRole)}`);
			// console.log(`is owner: ${message.member!.id === guildOwner.id}`);
			if (
				message.member!.roles.cache.has(modRole) ||
				message.member!.roles.cache.has(adminRole) ||
				message.member!.permissions.has('ADMINISTRATOR') ||
				message.member!.id === guildOwner.id
			) {
				return true;
			}
			else {
				message.channel.send('This command can only be run by moderators!')
				return false;
			}
		}
	});
}