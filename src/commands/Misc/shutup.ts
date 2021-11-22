import { ApplyOptions, RequiresGuildContext } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions} from '@sapphire/plugin-subcommands';
import { isNullOrUndefinedOrEmpty } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { RequiresGuildModerator } from '../../lib/decorators/RequiresGuildModerator';
import { sendHelpMessage } from '../../lib/utils';

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
		console.log("trying to pick a memeber to stfu")

		const member =  await args.pick('member').catch(e => {
			console.log("error alert yo" + e)
			message.channel.send('You must specify someone to shutup!')
		})

		if(!isNullOrUndefinedOrEmpty(member)) {
			return message.channel.send('Picked ' + member + ' to stfu');
		}
			
		return
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildModerator()
	public async config(message: Message) {
		sendHelpMessage(message, this.name, this.description, this.detailedDescription)
		return message.channel.send('Successfully ran config on shutup');
	}
}
