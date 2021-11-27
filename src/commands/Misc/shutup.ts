import { ApplyOptions, RequiresGuildContext } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions} from '@sapphire/plugin-subcommands';
import { GuildMember, Message} from 'discord.js';
import { memberNicknameMention } from '@discordjs/builders';
import { GuildModel } from '../../lib/database/models/Guild';
import { UserModel } from '../../lib/database/models/User';
import { RequiresGuildModerator } from '../../lib/decorators/RequiresGuildModerator';
import { sendHelpMessage } from '../../lib/utils';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Make your friends shutup when they say dumb shit',
	detailedDescription: 
	`
	\`\`\`wp shutup <user>\`\`\`
	Set the duration of the temp mute in seconds: 
	\`\`\`wp shutup config duration <number>\`\`\`
	Set the cooldown on shutup in seconds: 
	\`\`\`wp shutup config cooldown <number>\`\`\`
	`,
	aliases: ['shutup', 'shut'],
	subCommands: ['config',{input: 'shut', output: 'shutup'}, {input: 'shutup', default: true}],
	flags: ['help']
})
export class Shutup extends SubCommandPluginCommand {

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	public async shutup(message: Message, args: Args) {
		// If help flag is set, send help message and exit command
		if (args.getFlags('help')) return sendHelpMessage(message, this.name, this.description, this.detailedDescription);

		// args.pick throws if it can't resolve a member object from the user input, so catch and set member to null 
		const mutee =  await args.pick('member').catch(() => {return null});

		const guildDoc = await GuildModel.findOne({'discordId': message.guild!.id});
		// Look for the command callers user document in database. If it doesn't exist, create a the user 
		const userDoc = await UserModel.findOneAndUpdate(
			{'discordId': message.author.id}, 
			{'discordId': message.author.id}, 
			{upsert: true, new: true});
		// userDoc and guildDoc should never be null, check to make typescript happy
		if(userDoc == null || guildDoc == null) return message.channel.send('Something went horribly wrong!');

		// Check that muted role has been set to a role that still exists
		if(guildDoc.mutedRole == null || !message.guild?.roles.cache.has(guildDoc.mutedRole)) {
			return message.channel.send('A valid mute role must be set with \`[p]setrole muted\` before shutup can be used')
		}
		if(mutee) {
			// If the user has never used shutup, it can't be on cooldown
			if(userDoc.shutupLastUsed == null) return this.tempMute(mutee, message.member!, guildDoc.shutupDuration, guildDoc.mutedRole);
			// Calculate time elapsed since last shutup use by user and compare to the guilds shutup cooldown
			const shutupTimeDelta = (userDoc.shutupLastUsed.getTime() - (new Date()).getTime())/1000;
			if(Math.abs(shutupTimeDelta) < guildDoc.shutupCooldown) return message.channel.send('Shutup is on cooldown!');
			this.tempMute(mutee, message.member!, guildDoc.shutupDuration, guildDoc.mutedRole);
			message.channel.send(`Muted ${memberNicknameMention(mutee.id)} for ${guildDoc.shutupDuration} seconds`);
		}
		else {
			// if mutee is null, an invalid user was specified
			message.channel.send("Invalid user, how about you shutup instead idot");
		}
	}

	@RequiresGuildContext((message: Message) => send(message, 'This command can only be used in servers'))
	@RequiresGuildModerator()
	public async config(message: Message, args: Args) {
		if(args.getFlags('help')) return sendHelpMessage(message, this.name, this.description, this.detailedDescription);
		const option = await args.pick('string').catch(() => {return null});
		const value = await args.pick('number').catch(() => {return null});
		const guildDoc = await GuildModel.findOne({'discordId': message.guild!.id});
		if(option === 'duration' && value != null) {
			guildDoc!.shutupDuration = value;
		}
		else if(option === 'cooldown' && value != null) {
			guildDoc!.shutupCooldown = value;
		}
		else {
			return sendHelpMessage(message, this.name, this.description, this.detailedDescription);
		}
		await guildDoc!.save()
			.then(() => {
				message.channel.send(`Successfully set shutup \`${option}\` to ${value} seconds`);
			})
			.catch(() => {
				message.channel.send('Something went wrong, please try again later');
			});
	}
	/**
	 * Adds muted role to user for a duration. The guild admins are responisble for setting up the muted role permissions properly
	 * @param member 
	 * @param duration 
	 */
	private async tempMute(mutee: GuildMember, muter: GuildMember, duration: number, mutedRole: string) {
		const userDoc = await UserModel.findOne({'discordId': muter.id});
		// update command last used property for the user who called the command
		userDoc!.shutupLastUsed = new Date();
		userDoc!.save();
		// Add muted role, then remove after duration seconds have passed
		mutee.roles.add(mutedRole)
		setTimeout(() => {
			mutee.roles.remove(mutedRole);
		}, duration*1000);
	}
}