import mongoose from 'mongoose';

interface Guild {
    // Discord ID of the guild this document is for
    id: string;

    // Roles. Modified with setrole command
    modRole?: string;
    adminRole?: string;
    mutedRole?: string;

    // Command settings
    shutupCooldown: number;
    shutupDuration: number;
}

const GuildSchema = new mongoose.Schema<Guild>(
    {
    id: { type: String, required: true },
    modRole: { type: String },
    adminRole: { type: String },
    mutedRole: { type: String },
    shutupDuration: { type: Number, default: 60 },
    shutupCooldown: { type: Number, default: 3600 }
    },
    {
        timestamps: true
    }
);

export const GuildModel = mongoose.model<Guild>('Guild', GuildSchema);