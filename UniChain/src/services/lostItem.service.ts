import { PrismaClient, Prisma } from '@prisma/client';

export interface CreateLostItemDto {
  title: string;
  description: string;
  location: string;
  dateLost: Date;
  category?: string;
  imageUrl?: string;
  ownerId: number;
}

export interface UpdateLostItemDto {
  title?: string;
  description?: string;
  location?: string;
  dateLost?: Date;
  category?: string;
  imageUrl?: string;
}

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

export class LostItemService {
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

  private validateOptionalString(value: string | undefined, field: string, maxLength: number) {
    if (value !== undefined) {
      if (!value.trim()) {
        throw new ValidationError(
          400,
          `Invalid ${field}`,
          `The ${field} cannot be empty if provided`
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
  }

  private validateDate(date: Date | string | undefined, field: string) {
    if (!date) {
      throw new ValidationError(
        400,
        `Invalid ${field}`,
        `The ${field} is required`
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ValidationError(
        400,
        `Invalid ${field} format`,
        `The ${field} must be a valid date`
      );
    }

    if (parsedDate > new Date()) {
      throw new ValidationError(
        400,
        `Invalid ${field}`,
        `The ${field} cannot be in the future`
      );
    }

    return parsedDate;
  }

  private validateImageUrl(url: string | undefined) {
    if (url !== undefined) {
      if (!url.trim()) {
        throw new ValidationError(
          400,
          'Invalid image URL',
          'The image URL cannot be empty if provided'
        );
      }
      if (!url.match(/^https?:\/\/.+/)) {
        throw new ValidationError(
          400,
          'Invalid image URL format',
          'The image URL must start with http:// or https://'
        );
      }
      if (url.length > 500) {
        throw new ValidationError(
          400,
          'Image URL too long',
          'The image URL must be less than 500 characters'
        );
      }
    }
  }

  async createLostItem(data: CreateLostItemDto) {
    try {
      // Validate required fields
      this.validateRequiredString(data.title, 'title', 100);
      this.validateRequiredString(data.description, 'description', 500);
      this.validateRequiredString(data.location, 'location', 200);
      this.validateId(data.ownerId, 'owner');
      
      // Validate optional fields
      this.validateOptionalString(data.category, 'category', 50);
      this.validateImageUrl(data.imageUrl);

      // Validate and parse date
      const dateLost = this.validateDate(data.dateLost, 'date lost');

      const lostItem = await this.prisma.lostItem.create({
        data: {
          ...data,
          title: data.title.trim(),
          description: data.description.trim(),
          location: data.location.trim(),
          category: data.category?.trim(),
          imageUrl: data.imageUrl?.trim(),
          dateLost,
          status: 'LOST'
        },
        include: {
          owner: true,
          claims: true,
        },
      });

      return lostItem;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ValidationError(
            409,
            'Duplicate entry',
            'An item with these details already exists'
          );
        }
        if (error.code === 'P2003') {
          throw new ValidationError(
            404,
            'Owner not found',
            'The specified owner ID does not exist'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while creating the lost item'
      );
    }
  }

  async getLostItems(filters: {
    category?: string;
    location?: string;
    dateFrom?: string | Date;
    dateTo?: string | Date;
    page?: number;
    limit?: number;
  }) {
    try {
      const where: Prisma.LostItemWhereInput = {
        status: 'LOST',
      };

      // Validate and apply filters
      if (filters.category) {
        this.validateOptionalString(filters.category, 'category', 50);
        where.category = filters.category.trim();
      }

      if (filters.location) {
        this.validateOptionalString(filters.location, 'location', 200);
        where.location = {
          contains: filters.location.trim(),
          mode: 'insensitive'
        };
      }

      // Validate and parse dates
      if (filters.dateFrom || filters.dateTo) {
        const dateLostFilter: Prisma.DateTimeFilter = {};
        where.dateLost = dateLostFilter;
        
        if (filters.dateFrom) {
          const dateFrom = this.validateDate(filters.dateFrom, 'date from');
          dateLostFilter.gte = dateFrom;
        }
        
        if (filters.dateTo) {
          const dateTo = this.validateDate(filters.dateTo, 'date to');
          dateLostFilter.lte = dateTo;
        }

        if (dateLostFilter.gte && dateLostFilter.lte && dateLostFilter.gte > dateLostFilter.lte) {
          throw new ValidationError(
            400,
            'Invalid date range',
            'The start date must be before the end date'
          );
        }
      }

      // Validate pagination
      const page = filters.page ? Number(filters.page) : 1;
      const limit = filters.limit ? Number(filters.limit) : 10;

      if (isNaN(page) || page < 1) {
        throw new ValidationError(
          400,
          'Invalid page number',
          'The page number must be a positive integer'
        );
      }

      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new ValidationError(
          400,
          'Invalid limit value',
          'The limit must be between 1 and 100'
        );
      }

      const items = await this.prisma.lostItem.findMany({
        where,
        include: {
          owner: true,
          claims: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          dateLost: 'desc'
        }
      });

      return items;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving lost items'
      );
    }
  }

  async getLostItemById(id: number) {
    try {
      this.validateId(id, 'item');

      const item = await this.prisma.lostItem.findUnique({
        where: { id },
        include: {
          owner: true,
          claims: true,
        },
      });

      if (!item) {
        throw new ValidationError(
          404,
          'Item not found',
          `No lost item exists with ID ${id}`
        );
      }

      return item;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving the lost item'
      );
    }
  }

  async getLostItemsByUserId(ownerId: number) {
    try {
      this.validateId(ownerId, 'owner');

      // Check if user exists through lost items
      const userItems = await this.prisma.lostItem.findFirst({
        where: { ownerId },
        select: { owner: true }
      });

      if (!userItems?.owner) {
        throw new ValidationError(
          404,
          'User not found',
          `No user exists with ID ${ownerId}`
        );
      }

      const items = await this.prisma.lostItem.findMany({
        where: { ownerId },
        include: {
          owner: true,
          claims: true,
        },
        orderBy: {
          dateLost: 'desc'
        }
      });

      return items;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving user lost items'
      );
    }
  }

  async updateLostItem(id: number, ownerId: number, data: UpdateLostItemDto) {
    try {
      this.validateId(id, 'item');
      this.validateId(ownerId, 'owner');

      // Validate optional fields if provided
      this.validateOptionalString(data.title, 'title', 100);
      this.validateOptionalString(data.description, 'description', 500);
      this.validateOptionalString(data.location, 'location', 200);
      this.validateOptionalString(data.category, 'category', 50);
      this.validateImageUrl(data.imageUrl);

      if (data.dateLost) {
        data.dateLost = this.validateDate(data.dateLost, 'date lost');
      }

      // Check if item exists and belongs to user
      const existingItem = await this.prisma.lostItem.findUnique({
        where: { id }
      });

      if (!existingItem) {
        throw new ValidationError(
          404,
          'Item not found',
          `No lost item exists with ID ${id}`
        );
      }

      if (existingItem.ownerId !== ownerId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You do not have permission to update this item'
        );
      }

      const updatedItem = await this.prisma.lostItem.update({
        where: { id },
        data: {
          title: data.title?.trim(),
          description: data.description?.trim(),
          location: data.location?.trim(),
          category: data.category?.trim(),
          imageUrl: data.imageUrl?.trim(),
          dateLost: data.dateLost
        },
        include: {
          owner: true,
          claims: true,
        },
      });

      return updatedItem;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ValidationError(
            409,
            'Duplicate entry',
            'An item with these details already exists'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while updating the lost item'
      );
    }
  }

  async deleteLostItem(id: number, ownerId: number) {
    try {
      this.validateId(id, 'item');
      this.validateId(ownerId, 'owner');

      // Check if item exists and belongs to user
      const existingItem = await this.prisma.lostItem.findUnique({
        where: { id },
        include: {
          claims: {
            where: {
              status: 'ACCEPTED'
            }
          }
        }
      });

      if (!existingItem) {
        throw new ValidationError(
          404,
          'Item not found',
          `No lost item exists with ID ${id}`
        );
      }

      if (existingItem.ownerId !== ownerId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You do not have permission to delete this item'
        );
      }

      if (existingItem.claims.length > 0) {
        throw new ValidationError(
          409,
          'Cannot delete item with claims',
          'This item has accepted claims and cannot be deleted'
        );
      }

      await this.prisma.lostItem.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ValidationError(
            409,
            'Item has dependencies',
            'This item cannot be deleted because it has related records'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while deleting the lost item'
      );
    }
  }
}