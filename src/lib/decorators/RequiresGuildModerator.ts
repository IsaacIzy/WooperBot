import { createFunctionPrecondition } from '@sapphire/decorators';
import { isNullOrUndefined } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getAdminRole, getModRole } from '../database/controllers/guildController';
import { GuildModel } from '../database/models/Guild';

export function RequiresGuildModerator(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		if(message.guild == null) return false;
		const guildDoc = await GuildModel.findOne({discordId: message.guild.id});
		if(guildDoc == null) return false;
		const guildOwner = await message.guild!.fetchOwner();
		if(guildDoc.modRole == null || guildDoc.adminRole == null) {
			message.channel.send('Server owner must set mod AND admin roles with \`setrole\` before you can use this command');
			return false;
		}
		else {
			if (
				message.member!.roles.cache.has(guildDoc.modRole) ||
				message.member!.roles.cache.has(guildDoc.adminRole) ||
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