import { User } from '@prisma/client';
// import { Asset, BASE_FEE, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
// import { Server } from '@stellar/stellar-sdk/lib/horizon';
// import * as StellarSdk from '@stellar/stellar-sdk';


// const getClient = () => {
//     return new Server(
//         "https://horizon-testnet.stellar.org",
//     );
// }

const fundStellarAccount = async (address: string) => {
    try {
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(
                address,
            )}`,
        );
        const responseJSON = await response.json();
        console.log("SUCCESS! You have a new account :)\n", responseJSON);
    } catch (e) {
        console.error("ERROR!", e);
    }
}

export const createStellarKeypair = async () => {
    // const keypair = Keypair.random();
    // await fundStellarAccount(keypair.publicKey());
    // return {
    //     address: keypair.publicKey(),
    //     sk: keypair.secret()
    // }
    return {
        address: 'temp',
        sk: 'temp'
    }
}

export const stellarTransfer = async (fromUser: User, toUser: User, amount: number) => {
    return;
}

// export const stellarTransfer = async (fromUser: User, toUser: User, amount: number) => {
//     const sourceKeys = Keypair.fromSecret(
//         fromUser.stellarPrivateKey
//     );
//     const client = getClient();
//     const myAccount = await client.loadAccount(sourceKeys.publicKey());
//     const tx = new TransactionBuilder(myAccount, {
//         fee: BASE_FEE,
//         networkPassphrase: Networks.TESTNET,
//     })
//         .addOperation(
//             Operation.payment({
//                 destination: toUser.stellarAddress,
//                 asset: Asset.native(),
//                 amount: amount.toString(),
//             }),
//         )
//         .setTimeout(60)
//         .build();
//     tx.sign(sourceKeys);
//     await client.submitTransaction(tx);
// }