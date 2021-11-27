import { Listener } from "@sapphire/framework";
import { isNullOrUndefined } from "@sapphire/utilities";
import type { Guild } from "discord.js";
import { GuildModel } from "../lib/database/models/Guild";
const mongoose = require('mongoose');
export class UserEvent extends Listener<'guildCreate'> {
    public async run(guild: Guild) {
        console.log("Wooper has joined a new guild!")
        GuildModel.findOne({'discordId': guild.id}).exec()
            .then(result => {
                if(isNullOrUndefined(result)) {
                    this.createGuildSettings(guild);
                }
                else {
                console.log(`Found an existing Guild document for ${guild.name}`);
                console.log(result);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    private async createGuildSettings(guild: Guild) {
        console.log(`attempting to create new Guild document for guildID: ${guild.id}`);
        await GuildModel.create(
            {
                discordId: guild.id
            })
            .then(result => {
                console.log(`Successfully created new Guild document for guildID ${guild.id}`);
                console.log(result);
            })
            .catch(error => {
                console.log(`Something went wrong adding new Guild document for guildID ${guild.id}`);
                console.error(error);
            })
    }
}