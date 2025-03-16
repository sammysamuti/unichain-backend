import { PrismaClient, Prisma } from '@prisma/client';

export class ValidationError extends Error {
  constructor(
    public status: number,
    message: string,
    public details: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface CreateClaimDto {
  foundItemId: number;
  lostItemId: number;
  message: string;
  proofDetails: string;
  studentId: number;
}

export interface ReviewClaimDto {
  status: 'ACCEPTED' | 'REJECTED';
  reviewNote: string;
}

export class LostClaimService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private validateId(id: number, field: string) {
    if (isNaN(id) || id <= 0) {
      throw new ValidationError(
        400,
        `Invalid ${field} ID`,
        `The ${field} ID must be a positive number`
      );
    }
  }

  private validateRequiredString(value: string, field: string, maxLength: number) {
    if (!value?.trim()) {
      throw new ValidationError(
        400,
        `Invalid ${field}`,
        `The ${field} is required and cannot be empty`
      );
    }
    if (value.length > maxLength) {
      throw new ValidationError(
        400,
        `${field} too long`,
        `The ${field} must be less than ${maxLength} characters`
      );
    }
  }

  private validateClaimStatus(status: string) {
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new ValidationError(
        400,
        'Invalid claim status',
        'Status must be either ACCEPTED or REJECTED'
      );
    }
  }

  // Create a new claim on a found item
  async createClaim(data: CreateClaimDto) {
    try {
      // Validate IDs
      this.validateId(data.foundItemId, 'found item');
      this.validateId(data.lostItemId, 'lost item');
      this.validateId(data.studentId, 'student');

      // Validate strings
      this.validateRequiredString(data.message, 'message', 500);
      this.validateRequiredString(data.proofDetails, 'proof details', 1000);

      // Check if the found item exists and isn't already claimed
      const foundItem = await this.prisma.foundItem.findUnique({
        where: { id: data.foundItemId }
      });

      if (!foundItem) {
        throw new ValidationError(
          404,
          'Found item not found',
          'The specified found item does not exist'
        );
      }

      if (foundItem.status !== 'FOUND') {
        throw new ValidationError(
          400,
          'Item already claimed',
          'This item has already been claimed or returned'
        );
      }

      // Check if the lost item exists and isn't already found
      const lostItem = await this.prisma.lostItem.findUnique({
        where: { id: data.lostItemId }
      });

      if (!lostItem) {
        throw new ValidationError(
          404,
          'Lost item not found',
          'The specified lost item does not exist'
        );
      }

      if (lostItem.status !== 'LOST') {
        throw new ValidationError(
          400,
          'Lost item already found',
          'This lost item has already been found'
        );
      }

      // Check if a claim already exists
      const existingClaim = await this.prisma.lostClaim.findFirst({
        where: {
          foundItemId: data.foundItemId,
          lostItemId: data.lostItemId
        }
      });

      if (existingClaim) {
        throw new ValidationError(
          409,
          'Duplicate claim',
          'A claim for this item already exists'
        );
      }

      // Create the claim
      const claim = await this.prisma.lostClaim.create({
        data: {
          ...data,
          message: data.message.trim(),
          proofDetails: data.proofDetails.trim(),
          status: 'PENDING'
        },
        include: {
          foundItem: true,
          lostItem: true
        }
      });

      return claim;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ValidationError(
            404,
            'Invalid reference',
            'One or more referenced items do not exist'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while creating the claim'
      );
    }
  }

  // Get all claims received on items found by a user
  async getReceivedClaims(finderId: number) {
    try {
      this.validateId(finderId, 'finder');

      const claims = await this.prisma.lostClaim.findMany({
        where: {
          foundItem: {
            finderId: finderId
          }
        },
        include: {
          foundItem: true,
          lostItem: {
            include: {
              owner: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!claims.length) {
        throw new ValidationError(
          404,
          'No claims found',
          'No claims have been received on your found items'
        );
      }

      return claims;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving received claims'
      );
    }
  }

  // Get all claims sent by a user
  async getSentClaims(userId: number) {
    try {
      this.validateId(userId, 'user');

      const claims = await this.prisma.lostClaim.findMany({
        where: {
          studentId: userId
        },
        include: {
          foundItem: {
            include: {
              finder: true
            }
          },
          lostItem: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!claims.length) {
        throw new ValidationError(
          404,
          'No claims found',
          'You have not sent any claims'
        );
      }

      return claims;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving sent claims'
      );
    }
  }

  // Review (accept/reject) a claim
  async reviewClaim(claimId: number, finderId: number, data: ReviewClaimDto) {
    try {
      this.validateId(claimId, 'claim');
      this.validateId(finderId, 'finder');
      this.validateClaimStatus(data.status);
      this.validateRequiredString(data.reviewNote, 'review note', 500);

      const claim = await this.prisma.lostClaim.findUnique({
        where: { id: claimId },
        include: {
          foundItem: true,
          lostItem: true
        }
      });

      if (!claim) {
        throw new ValidationError(
          404,
          'Claim not found',
          'The specified claim does not exist'
        );
      }

      // Verify the finder owns the found item
      if (claim.foundItem.finderId !== finderId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You are not authorized to review this claim'
        );
      }

      if (claim.status !== 'PENDING') {
        throw new ValidationError(
          400,
          'Invalid claim status',
          'This claim has already been reviewed'
        );
      }

      // If accepting the claim
      if (data.status === 'ACCEPTED') {
        // Update both items and the claim in a transaction
        const [updatedClaim] = await this.prisma.$transaction([
          // Update claim
          this.prisma.lostClaim.update({
            where: { id: claimId },
            data: {
              status: 'ACCEPTED',
              reviewNote: data.reviewNote.trim(),
              reviewedBy: finderId,
              reviewedAt: new Date()
            },
            include: {
              foundItem: true,
              lostItem: true
            }
          }),
          // Update found item
          this.prisma.foundItem.update({
            where: { id: claim.foundItemId },
            data: {
              status: 'CLAIMED'
            }
          }),
          // Update lost item
          this.prisma.lostItem.update({
            where: { id: claim.lostItemId },
            data: {
              status: 'CLAIMED',
              finderId: finderId
            }
          }),
          // Reject all other pending claims
          this.prisma.lostClaim.updateMany({
            where: {
              foundItemId: claim.foundItemId,
              id: { not: claimId },
              status: 'PENDING'
            },
            data: {
              status: 'REJECTED',
              reviewNote: 'Another claim was accepted',
              reviewedBy: finderId,
              reviewedAt: new Date()
            }
          })
        ]);

        return updatedClaim;
      }

      // If rejecting the claim
      return this.prisma.lostClaim.update({
        where: { id: claimId },
        data: {
          status: 'REJECTED',
          reviewNote: data.reviewNote.trim(),
          reviewedBy: finderId,
          reviewedAt: new Date()
        },
        include: {
          foundItem: true,
          lostItem: true
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ValidationError(
            404,
            'Record not found',
            'One or more referenced records do not exist'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while reviewing the claim'
      );
    }
  }

  // Mark an item as physically returned
  async markReturned(claimId: number, finderId: number) {
    try {
      this.validateId(claimId, 'claim');
      this.validateId(finderId, 'finder');

      const claim = await this.prisma.lostClaim.findUnique({
        where: { id: claimId },
        include: {
          foundItem: true,
          lostItem: true
        }
      });

      if (!claim) {
        throw new ValidationError(
          404,
          'Claim not found',
          'The specified claim does not exist'
        );
      }

      if (claim.foundItem.finderId !== finderId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You are not authorized to mark this item as returned'
        );
      }

      if (claim.status !== 'ACCEPTED') {
        throw new ValidationError(
          400,
          'Invalid claim status',
          'Only accepted claims can be marked as returned'
        );
      }

      if (claim.returnedAt) {
        throw new ValidationError(
          400,
          'Already returned',
          'This item has already been marked as returned'
        );
      }

      // Update claim and both items in a transaction
      const [updatedClaim] = await this.prisma.$transaction([
        // Update claim
        this.prisma.lostClaim.update({
          where: { id: claimId },
          data: {
            returnedAt: new Date()
          },
          include: {
            foundItem: true,
            lostItem: true
          }
        }),
        // Update found item
        this.prisma.foundItem.update({
          where: { id: claim.foundItemId },
          data: {
            status: 'RETURNED',
            isReturned: true
          }
        }),
        // Update lost item
        this.prisma.lostItem.update({
          where: { id: claim.lostItemId },
          data: {
            status: 'RETURNED'
          }
        })
      ]);

      return updatedClaim;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ValidationError(
            404,
            'Record not found',
            'One or more referenced records do not exist'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while marking the item as returned'
      );
    }
  }
}
