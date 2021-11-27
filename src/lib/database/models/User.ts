import mongoose, { Document } from 'mongoose';

export interface User {
    // Discord ID
    discordId: string;

    // The date and time shutup command was last used by this user
    shutupLastUsed?: Date; 
}

export interface UserDocument extends User, Document {
}

const UserSchema = new mongoose.Schema<UserDocument>(
    {
        discordId: { type: String, required: true },
        shutupLastUsed: { type: Date}
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);