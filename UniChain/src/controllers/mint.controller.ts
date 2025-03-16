import { Request, Response } from 'express';
import { mintDegreeNFT } from '../services/mint.service';

export async function mintDegreeController(req: Request, res: Response) {
  const universityId = Number(req.params.universityId);

  try {
    const nftAddress = await mintDegreeNFT(universityId);
    res.status(200).json({ success: true, nftAddress });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
    
  }
}
