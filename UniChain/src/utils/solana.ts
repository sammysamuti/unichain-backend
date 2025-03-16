import { Keypair, Connection, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

// Connect to Solana testnet
const connection = new Connection('https://api.testnet.solana.com', 'confirmed');

// Define wallet interface
interface Wallet {
  publicKey: string;
  seedPhrase: string;
}

// Function to create a new wallet
function generateWallet(): Wallet {
  const seedPhrase: string = bip39.generateMnemonic(256);
  const walletAddress: string = generateAddress(seedPhrase);
  return { publicKey: walletAddress, seedPhrase };
}

// Function to generate address from seed phrase
function generateAddress(seedPhrase: string): string {
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error('Invalid seed phrase');
  }
  
  const seed: Buffer = bip39.mnemonicToSeedSync(seedPhrase);
  const derivedSeed: Buffer = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
  const keypair: Keypair = Keypair.fromSeed(derivedSeed);
  
  return keypair.publicKey.toBase58();
}

// Fix the checkBalance function
async function checkBalance(address: string): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balance: number = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
  } catch (error: any) {
    throw new Error(`Error checking balance: ${error.message}`);
  }
}

// Function to send SOL
async function sendSolana(seedPhrase: string, amount: number, receiverAddress: string): Promise<string> {
  try {
    // Generate sender keypair from seed phrase
    const seed: Buffer = bip39.mnemonicToSeedSync(seedPhrase);
    const derivedSeed: Buffer = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
    const senderKeypair: Keypair = Keypair.fromSeed(derivedSeed);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: new PublicKey(receiverAddress),
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    // Sign and send transaction
    const signature: string = await sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair]
    );

    return signature;
  } catch (error: any) {
    throw new Error(`Error sending SOL: ${error.message}`);
  }
}

// Example usage (commented out)
// const wallet: Wallet = generateWallet();
// console.log('Created wallet:', wallet);

// const address: string = generateAddress('pull cage tell business black vanish muffin wood mix record country margin badge safe mushroom faith toss short wire leave orange adapt lend plunge');
// console.log('Generated Address:', address);

// Update the test call to use proper async/await
// (async () => {
//     try {
//       const balance: number = await checkBalance('2LPxw8wfHhqGGTrh85F8FG6k7nDeDQxd1EbEyKVLMsmJ');
//       console.log('Balance:', balance, 'SOL');
//     } catch (error: any) {
//       console.error('Error:', error.message);
//     }
//   })();

export {
  generateWallet,
  generateAddress,
  checkBalance,
  sendSolana
};