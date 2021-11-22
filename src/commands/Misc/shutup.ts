import { ApplyOptions, RequiresGuildContext } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions} from '@sapphire/plugin-subcommands';
import { isNullish, isNullOrUndefinedOrEmpty } from '@sapphire/utilities';
import type { GuildMember, Message } from 'discord.js';
import { RequiresGuildModerator } from '../../lib/decorators/RequiresGuildModerator';
import { sendHelpMessage } from '../../lib/utils';
const mongoose = require('mongoose');

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Make your friends shutup when they say dumb shit',
	detailedDescription: 'stfu u noobs',
	aliases: ['shutup', 'shut'],
	subCommands: ['config',{input: 'shut', output: 'shutup'}, {input: 'shutup', default: true}],
	flags: ['help'],
	options: ['cooldown', 'duration']
})
export class Shutup extends SubCommandPluginCommand {

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	public async shutup(message: Message, args: Args) {
		if (args.getFlags('help')) {
			sendHelpMessage(message, this.name, this.description, this.detailedDescription)
			return
		}

		const member =  await args.pick('member').catch(() => {});

		if(!isNullOrUndefinedOrEmpty(member)) {
			return message.channel.send('Picked ' + member + ' to stfu');
		}
		else {
			return message.channel.send("Invalid user, how about you shutup instead idot")
		}
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildModerator()
	public async config(message: Message, args: Args) {
		const duration = args.getOption('duration');
		const cooldown = args.getOption('cooldown');

		message.channel.send("it worked yo");
		if(!isNullish(cooldown)) {
				
		}

	}

	async tempMute(member: GuildMember, duration: number) {
		
	}
}
