import { User } from "@prisma/client";
import { createSuiKeypair } from "./sui";
import { createStellarKeypair } from "./stellar";
import { createRootstockKeypair } from "./rootstock";

export const createUser = async (name: string): Promise<User> => {
    const suiKeypair = await createSuiKeypair();
    const stellarKeypair = await createStellarKeypair();
    const rootstockKeypair = await createRootstockKeypair();
    return {
        suiAddress: suiKeypair.address,
        suiPrivateKey: suiKeypair.sk,
        stellarAddress: stellarKeypair.address,
        stellarPrivateKey: stellarKeypair.sk,
        rootstockAddress: rootstockKeypair.address,
        rootstockPrivateKey: rootstockKeypair.sk,
        tgUsername: name
    };
}