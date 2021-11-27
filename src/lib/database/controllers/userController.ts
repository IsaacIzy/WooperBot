import { User, UserModel } from "../models/User";

/**
 * Attempt to ceate a new user document. Returns true if successful, false otherwise
 * @param user 
 * @returns boolean
 */
export async function createUser(user: User) {
    await UserModel.create(user);
}

export async function userExists(userId: string): Promise<boolean> {
    if(await UserModel.countDocuments({"discordId": userId}).exec() === 0) return false;
    return true;
}