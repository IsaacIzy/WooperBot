import { ApplyOptions, RequiresGuildContext } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { RequiresGuildModerator } from '../lib/decorators/requiresGuildModerator';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Make your friends shutup when they say dumb shit',
	aliases: ['shutup', 'shut'],
	subCommands: ['config',{input: 'shut', output: 'shutup'}, {input: 'shutup', default: true}],
	options: ['cooldown', 'duration']
})
export class Shutup extends SubCommandPluginCommand {

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	public async shutup(message: Message, args: Args) {
		const member =  await args.pick('member')
		return message.channel.send('Picked ' + member.displayName + ' to stfu');
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildModerator()
	public async config(message: Message, args: Args) {
		return message.channel.send('Successfully ran config on shutup');
	}
}
