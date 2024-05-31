import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Transaction } from '@mysten/sui/transactions';
import { User } from '@prisma/client';

const getClient = () => {
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });
    return client;
}

export const createSuiKeypair = async () => {
    const keypair = new Ed25519Keypair();
    await fundSuiAccount(keypair.toSuiAddress());
    return {
        address: keypair.toSuiAddress(),
        sk: keypair.getSecretKey()
    }
}

const fundSuiAccount = async (address: string) => {
    try {
        const response = await fetch('https://faucet.testnet.sui.io/gas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FixedAmountRequest: {
                    recipient: address
                }
            })
        });
        const data = await response.json();
        console.log('Faucet response:', data);
    } catch (error) {
        console.error('Error requesting SUI from faucet:', error);
    }
}

export const suiTransfer = async (fromUser: User, toUser: User, amount: number) => {
    const { secretKey } = decodeSuiPrivateKey(fromUser.suiPrivateKey);
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [amount * (10 ** 9)]);
    tx.transferObjects([coin], toUser.suiAddress);
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const client = getClient();
    await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
}

export const getSuiBalance = async (user: User) => {
    const client = getClient();
    const balance = await client.getBalance({
        owner: user.suiAddress
    });
    return (BigInt(balance.totalBalance) / BigInt(10 ** 9)).toString();
}