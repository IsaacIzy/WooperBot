import { isNullOrUndefined } from "@sapphire/utilities";
import type { Guild } from "discord.js";
import { GuildModel } from "../models/Guild";

/**
 * Returns discord ID of mod role set for @param guild
 * If the mod role is not set, returns null
 */
export async function getModRole(guild: Guild): Promise<string | null> {
    const result = await GuildModel.findById(guild.id)
        .exec()
        .then((guildSettings) => {
            if(!isNullOrUndefined(guildSettings)) { 
                return (isNullOrUndefined(guildSettings.modRole) ? null : guildSettings.modRole);
            }
            else {
                console.error("Something went wrong, getModRole was called on a guild that does not exist")
                return null;
            }
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
    return result;
}

/**
 * Returns discord ID of admin role set for @param guild
 * If the admin role is not set, returns null
 */

export async function getAdminRole(guild: Guild): Promise<string | null> {
    const result = await GuildModel.findById(guild.id)
        .exec()
        .then((guildSettings) => {
            if(!isNullOrUndefined(guildSettings)) { 
                return (isNullOrUndefined(guildSettings.adminRole) ? null : guildSettings.adminRole);
            }
            else {
                console.error("Something went wrong, getAdminRole was called on a guild that does not exist")
                return null;
            }
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
    return result;
}

// export async function guildGetValueFromKey(guild: Guild, key: string): Promise<any> {
//     if(key == null) return null;
//     return GuildModel.find(guild.id, key)
//         .exec()
//         .then(() => {

//         });
// }