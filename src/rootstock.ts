import { User } from '@prisma/client';
import { createWalletClient, http, setupKzg } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { rootstockTestnet } from 'viem/chains'
import { mainnetTrustedSetupPath } from 'viem/node'
import * as cKzg from 'c-kzg';

const getClient = () => {
    const publicClient = createWalletClient({
        chain: rootstockTestnet,
        transport: http()
    })
    return publicClient;
}

export const createRootstockKeypair = async () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return {
        address: account.address,
        sk: privateKey
    }
}

export const rootstockTransfer = async (fromUser: User, toUser: User, amount: number) => {
    const client = getClient();
    const account = privateKeyToAccount(fromUser.rootstockPrivateKey as `0x${string}`);
    const hash = await client.sendTransaction({
        account,
        to: toUser.rootstockAddress,
        value: BigInt(amount * 10 ** 18),
        kzg: setupKzg(cKzg, mainnetTrustedSetupPath),
        chain: undefined,
    });
}