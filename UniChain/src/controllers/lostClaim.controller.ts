import { Request, Response } from 'express';
import { LostClaimService, ValidationError, CreateClaimDto, ReviewClaimDto } from '../services/lostClaim.service';

const claimService = new LostClaimService();

// Create a new claim
export const createClaim = async (req: Request, res: Response) => {
  try {
    const claim = await claimService.createClaim({
      foundItemId: Number(req.body.foundItemId),
      lostItemId: Number(req.body.lostItemId),
      message: req.body.message,
      proofDetails: req.body.proofDetails,
      studentId: Number(req.body.studentId)
    });

    return res.status(201).json({
      message: 'Claim created successfully',
      error: null,
      data: claim
    });
  } catch (error) {
    console.error('Error in createClaim:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while creating the claim'
    });
  }
};

// Get claims received on found items
export const getReceivedClaims = async (req: Request, res: Response) => {
  try {
    const claims = await claimService.getReceivedClaims(Number(req.params.finderId));
    return res.status(200).json({
      message: 'Received claims retrieved successfully',
      error: null,
      data: claims
    });
  } catch (error) {
    console.error('Error in getReceivedClaims:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while retrieving received claims'
    });
  }
};

// Get claims sent by user
export const getSentClaims = async (req: Request, res: Response) => {
  try {
    const claims = await claimService.getSentClaims(Number(req.params.userId));
    return res.status(200).json({
      message: 'Sent claims retrieved successfully',
      error: null,
      data: claims
    });
  } catch (error) {
    console.error('Error in getSentClaims:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while retrieving sent claims'
    });
  }
};

// Review a claim
export const reviewClaim = async (req: Request, res: Response) => {
  try {
    const updatedClaim = await claimService.reviewClaim(
      Number(req.params.id),
      Number(req.body.finderId),
      {
        status: req.body.status as 'ACCEPTED' | 'REJECTED',
        reviewNote: req.body.reviewNote
      }
    );

    return res.status(200).json({
      message: `Claim ${req.body.status.toLowerCase()} successfully`,
      error: null,
      data: updatedClaim
    });
  } catch (error) {
    console.error('Error in reviewClaim:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while reviewing the claim'
    });
  }
};

// Mark a claim as returned
export const markReturned = async (req: Request, res: Response) => {
  try {
    const updatedClaim = await claimService.markReturned(
      Number(req.params.id),
      Number(req.body.finderId)
    );

    return res.status(200).json({
      message: 'Item marked as returned successfully',
      error: null,
      data: updatedClaim
    });
  } catch (error) {
    console.error('Error in markReturned:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while marking the item as returned'
    });
  }
};
