/* eslint-disable */
import { CreateUserPrams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.emmjim.fooddelivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    projectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME,
    databaseId: "68d45631000908086c5f",
    userCollectionId: '68d45699002c8fcfab61',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const tables = new TablesDB(client);
const avatars = new Avatars(client);

export const createUser = async({email, password, name} : CreateUserPrams) => {
    try {
        const newAccount = await account.create({userId: ID.unique(), email, password, name});

        if(!newAccount) throw Error;

        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId: ID.unique(),
            data: {
                accountId: newAccount.$id,
                email, name, avatar: avatarUrl
            }
    });

    } catch (error) {
        throw new Error(error as string);
    }
}

export const signIn = async({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession({email, password});

    } catch (error) {
        throw new Error(error as string);
    }
}

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await tables.listRows(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)])
        
        if(!currentUser) throw Error

        return currentUser.rows[0];
    } catch (error) {
        console.log(error);
        throw new Error(error as string);
    }
}