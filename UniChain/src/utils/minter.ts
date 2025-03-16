import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js';
import dotenv from 'dotenv';
import { StudentDegree } from '@prisma/client';

dotenv.config();

const secretKey = new Uint8Array(JSON.parse(process.env.WALLET_SECRET as string));
const wallet = Keypair.fromSecretKey(secretKey);

const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet));

async function uploadMetadataToArweave(metadata: any): Promise<string> {
  const file = toMetaplexFile(JSON.stringify(metadata), 'metadata.json');
  return await metaplex.storage().upload(file);
}

export async function mintOnSolana(degreeData: StudentDegree): Promise<string> {
  console.log(`Minting NFT for ${degreeData.fullName}...`);

  const metadata = {
    name: `${degreeData.degreeName} - ${degreeData.fullName}`,
    symbol: 'DEGREE',
    description: `Official degree certificate for ${degreeData.fullName} from ${degreeData.universityName}.`,
    image: 'https://arweave.net/YOUR_IMAGE_HASH', // Update with actual image URL
    attributes: Object.keys(degreeData).map((key) => ({
      trait_type: key.replace(/([A-Z])/g, ' $1').trim(),
      value: degreeData[key as keyof StudentDegree]?.toString() || 'N/A',
    })),
    external_url: `https://youruniversity.edu/verify?cert=${degreeData.certificateNumber}`,
  };

  const metadataUri = await uploadMetadataToArweave(metadata);

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: metadata.name,
    symbol: metadata.symbol,
    sellerFeeBasisPoints: 500, // 5% royalty
    creators: [
      {
        address: wallet.publicKey,
        share: 100,
      },
    ],
  });

  return nft.address.toString();
}
