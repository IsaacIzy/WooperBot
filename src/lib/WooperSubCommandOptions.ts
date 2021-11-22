import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';

/**
 * Adds additional options for commands in wooper bot
 */
export interface WooperSubCommandOptions extends SubCommandPluginCommandOptions {
    /**
     * Array of usage examples for the command. Used when generating help messages
     */
    usage?: string[];
}