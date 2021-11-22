import { Schema, model } from 'mongoose';

interface User {
    id: string;
}

export const userModel = model('User', new Schema<User>({
    id: { type: String, required: true }
}));