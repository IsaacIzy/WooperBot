import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
const mongoose = require('mongoose');

const client = new SapphireClient({
	defaultPrefix: 'wp ',
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
		client.logger.info('Connecting to database...');
		await mongoose.connect(process.env.DATABASE_URL)
			.then(() => client.logger.info("Database connected"));

	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		mongoose.connection.close();		
		process.exit(1);
	}
};

main();
