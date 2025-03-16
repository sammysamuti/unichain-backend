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

export interface CreateFoundItemDto {
  title: string;
  description: string;
  location: string;
  dateFound: Date;
  category?: string;
  imageUrl?: string;
  finderId: number;
}

export interface UpdateFoundItemDto {
  title?: string;
  description?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
}

export class FoundItemService {
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

  // Create a new found item
  async createFoundItem(data: CreateFoundItemDto) {
    try {
      // Validate required fields
      this.validateRequiredString(data.title, 'title', 100);
      this.validateRequiredString(data.description, 'description', 500);
      this.validateRequiredString(data.location, 'location', 200);
      this.validateId(data.finderId, 'finder');
      
      // Validate optional fields
      this.validateOptionalString(data.category, 'category', 50);
      this.validateImageUrl(data.imageUrl);

      // Validate and parse date
      const dateFound = this.validateDate(data.dateFound, 'date found');

      const foundItem = await this.prisma.foundItem.create({
        data: {
          ...data,
          title: data.title.trim(),
          description: data.description.trim(),
          location: data.location.trim(),
          category: data.category?.trim(),
          imageUrl: data.imageUrl?.trim(),
          dateFound,
          status: 'FOUND'
        },
        include: {
          finder: true,
          claims: {
            include: {
              lostItem: true
            }
          }
        }
      });

      return foundItem;
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
            'Finder not found',
            'The specified finder ID does not exist'
          );
        }
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while creating the found item'
      );
    }
  }

  // Get all found items with filters
  async getFoundItems(filters?: {
    category?: string;
    location?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    try {
      const where: Prisma.FoundItemWhereInput = {
        isReturned: false,
      };

      // Validate and apply filters
      if (filters?.category) {
        this.validateOptionalString(filters.category, 'category', 50);
        where.category = filters.category.trim();
      }

      if (filters?.location) {
        this.validateOptionalString(filters.location, 'location', 200);
        where.location = {
          contains: filters.location.trim(),
          mode: 'insensitive'
        };
      }

      // Validate and parse dates
      if (filters?.dateFrom || filters?.dateTo) {
        const dateFoundFilter: Prisma.DateTimeFilter = {};
        where.dateFound = dateFoundFilter;
        
        if (filters.dateFrom) {
          const dateFrom = this.validateDate(filters.dateFrom, 'date from');
          dateFoundFilter.gte = dateFrom;
        }
        
        if (filters.dateTo) {
          const dateTo = this.validateDate(filters.dateTo, 'date to');
          dateFoundFilter.lte = dateTo;
        }

        if (dateFoundFilter.gte && dateFoundFilter.lte && dateFoundFilter.gte > dateFoundFilter.lte) {
          throw new ValidationError(
            400,
            'Invalid date range',
            'The start date must be before the end date'
          );
        }
      }

      const foundItems = await this.prisma.foundItem.findMany({
        where,
        include: {
          finder: true,
          claims: {
            include: {
              lostItem: true
            }
          }
        },
        orderBy: {
          dateFound: 'desc'
        }
      });

      return foundItems;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving found items'
      );
    }
  }

  // Get found item by ID
  async getFoundItemById(id: number) {
    try {
      this.validateId(id, 'item');

      const foundItem = await this.prisma.foundItem.findUnique({
        where: { id },
        include: {
          finder: true,
          claims: {
            include: {
              lostItem: true
            }
          }
        }
      });

      if (!foundItem) {
        throw new ValidationError(
          404,
          'Item not found',
          `No found item exists with ID ${id}`
        );
      }

      return foundItem;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving the found item'
      );
    }
  }

  // Get found items by finder ID
  async getFoundItemsByFinderId(finderId: number) {
    try {
      this.validateId(finderId, 'finder');

      // Check if finder exists through found items
      const finderItems = await this.prisma.foundItem.findFirst({
        where: { finderId },
        select: { finder: true }
      });

      if (!finderItems?.finder) {
        throw new ValidationError(
          404,
          'User not found',
          `No user exists with ID ${finderId}`
        );
      }

      const foundItems = await this.prisma.foundItem.findMany({
        where: { finderId },
        include: {
          finder: true,
          claims: {
            include: {
              lostItem: true
            }
          }
        },
        orderBy: {
          dateFound: 'desc'
        }
      });

      return foundItems;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        500,
        'Internal server error',
        'An unexpected error occurred while retrieving user found items'
      );
    }
  }

  // Update found item
  async updateFoundItem(id: number, finderId: number, data: UpdateFoundItemDto) {
    try {
      this.validateId(id, 'item');
      this.validateId(finderId, 'finder');

      // Validate optional fields if provided
      this.validateOptionalString(data.title, 'title', 100);
      this.validateOptionalString(data.description, 'description', 500);
      this.validateOptionalString(data.location, 'location', 200);
      this.validateOptionalString(data.category, 'category', 50);
      this.validateImageUrl(data.imageUrl);

      // Check if item exists and belongs to finder
      const existingItem = await this.prisma.foundItem.findUnique({
        where: { id }
      });

      if (!existingItem) {
        throw new ValidationError(
          404,
          'Item not found',
          `No found item exists with ID ${id}`
        );
      }

      if (existingItem.finderId !== finderId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You do not have permission to update this item'
        );
      }

      if (existingItem.isReturned) {
        throw new ValidationError(
          400,
          'Cannot update returned item',
          'This item has already been returned and cannot be modified'
        );
      }

      const updatedItem = await this.prisma.foundItem.update({
        where: { id },
        data: {
          title: data.title?.trim(),
          description: data.description?.trim(),
          location: data.location?.trim(),
          category: data.category?.trim(),
          imageUrl: data.imageUrl?.trim()
        },
        include: {
          finder: true,
          claims: {
            include: {
              lostItem: true
            }
          }
        }
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
        'An unexpected error occurred while updating the found item'
      );
    }
  }

  // Delete found item
  async deleteFoundItem(id: number, finderId: number) {
    try {
      this.validateId(id, 'item');
      this.validateId(finderId, 'finder');

      // Check if item exists and belongs to finder
      const existingItem = await this.prisma.foundItem.findUnique({
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
          `No found item exists with ID ${id}`
        );
      }

      if (existingItem.finderId !== finderId) {
        throw new ValidationError(
          403,
          'Unauthorized action',
          'You do not have permission to delete this item'
        );
      }

      if (existingItem.isReturned) {
        throw new ValidationError(
          400,
          'Cannot delete returned item',
          'This item has already been returned and cannot be deleted'
        );
      }

      if (existingItem.claims.length > 0) {
        throw new ValidationError(
          409,
          'Cannot delete item with claims',
          'This item has accepted claims and cannot be deleted'
        );
      }

      await this.prisma.foundItem.delete({
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
        'An unexpected error occurred while deleting the found item'
      );
    }
  }
}