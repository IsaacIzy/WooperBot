import { sendHelpMessage } from '../../lib/utils';
import { ApplyOptions, RequiresGuildContext } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Guild, Message, Role } from 'discord.js';
import type { Args, Resolvers } from '@sapphire/framework';
import { isNullOrUndefined } from '@sapphire/utilities';
import { send } from '@skyra/editable-commands';
import { GuildModel } from '../../lib/database/models/Guild';
import { RequiresGuildOwner } from '../../lib/decorators/RequiresGuildOwner';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 
	`Set admin/moderator/muted roles. Roles can be entered as discord IDs, role names, or role mentions`,
	detailedDescription: 
	`Sets moderator role
	\`\`\`[p]setrole mod <role>\`\`\`
	Sets admin role
	\`\`\`[p]setrole admin <role>\`\`\`
	Sets Muted role
	\`\`\`[p]setrole muted <role>\`\`\`
	Lists current role assignments
	\`\`\`[p]setrole list\`\`\`
	`,
	aliases: ['setrole', 'setroles'],
	subCommands: [{input: 'setrole', default: true}, {input: 'setroles', output: 'setrole'}, 'mod', 'admin', 'muted', 'list'],
	flags: ['help']
})
export class UserCommand extends SubCommandPluginCommand {
	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildOwner()
	public async setrole(message: Message, args: Args) {
		sendHelpMessage(message, this.name, this.description, this.detailedDescription)
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildOwner()
	public async mod(message: Message, args: Args) {
		const role =  await args.pick('role').catch(() => {
			message.channel.send("Please specify a valid role name, mention, or id");
			return null;
		})
		if(!isNullOrUndefined(role)) {
			const update = {'modRole': role.id};
			await this.updateRole(message, update)
				.then((result) => {
					if(result) {
						message.channel.send("Successfully set moderator role");
					}
					else {
						message.channel.send("Unable to set moderator role, bot author is an idiot");
					}
				})
		}

	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildOwner()
	public async admin(message: Message, args: Args) {
		const role =  await args.pick('role').catch(() => {
			message.channel.send("Please specify a valid role name, mention, or id");
			return null;
		})
		if(!isNullOrUndefined(role)) {
			const update = {'adminRole': role.id};
			await this.updateRole(message, update)
				.then((result) => {
					if(result) {
						message.channel.send("Successfully set admin role");
					}
					else {
						message.channel.send("Unable to set moderator role, bot author is an idiot");
					}
				})
		}
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildOwner()
	public async muted(message: Message, args: Args) {
		const role =  await args.pick('role').catch(() => {
			message.channel.send("Please specify a valid role name, mention, or id");
			return null;
		})
		if(!isNullOrUndefined(role)) {
			const update = {'mutedRole': role.id};
			await this.updateRole(message, update)
				.then((result) => {
					if(result) {
						message.channel.send("Successfully set muted role");
					}
					else {
						message.channel.send("Unable to set moderator role, bot author is an idiot");
					}
				})
		}
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	public async list(message: Message, args: Args) {
		await GuildModel.findOne({"id": message.guild!.id})
		.exec()
		.then((guildSettings) => {
			if(!isNullOrUndefined(guildSettings)) { 
				const modRole = ((isNullOrUndefined(guildSettings.modRole) ? 'not set' : `<@&${guildSettings.modRole}>`));
				const adminRole = ((isNullOrUndefined(guildSettings.adminRole) ? 'not set' : `<@&${guildSettings.adminRole}>`));
				const mutedRole = ((isNullOrUndefined(guildSettings.mutedRole) ? 'not set' : `<@&${guildSettings.mutedRole}>`));
				message.channel.send(`Current role assignments:\nmod: ${modRole}\nadmin: ${adminRole}\nmuted: ${mutedRole}`);
			}
			else {
				message.channel.send("Something went wrong, unable to fetch role assignments");
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	private async updateRole(message: Message, update: {}): Promise<boolean> {
		const result = await GuildModel.updateOne({"id": message.guild!.id}, update);
		if(result.acknowledged) {
			console.log("Updated a role");
			return true;
		}
		else {
			console.error("Something went wrong updating a role!");
			return false;
		}
	}
}
