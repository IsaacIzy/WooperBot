import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";

export abstract class WooperCommand extends SubCommandPluginCommand {
    
}

export namespace WooperCommand {
    export type Options = SubCommandPluginCommand.Options & {
        usage?: string[]

    }
}