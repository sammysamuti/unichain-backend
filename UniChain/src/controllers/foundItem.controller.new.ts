import { Request, Response } from 'express';
import { FoundItemService, ValidationError } from '../services/foundItem.service';

export class FoundItemController {
  private foundItemService: FoundItemService;

  constructor() {
    this.foundItemService = new FoundItemService();
  }

  // Create a new found item
  async createFoundItem(req: Request, res: Response) {
    try {
      const foundItem = await this.foundItemService.createFoundItem({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        dateFound: req.body.dateFound,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        finderId: Number(req.body.finderId)
      });

      return res.status(201).json({
        message: 'Found item created successfully',
        error: null,
        data: foundItem
      });
    } catch (error) {
      console.error('Error in createFoundItem:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while creating the found item'
      });
    }
  }

  // Get all found items with filters
  async getFoundItems(req: Request, res: Response) {
    try {
      const { category, location, dateFrom, dateTo } = req.query;

      const filters = {
        category: category as string,
        location: location as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
      };

      const foundItems = await this.foundItemService.getFoundItems(filters);

      return res.status(200).json({
        message: foundItems.length ? 'Found items retrieved successfully' : 'No found items found',
        error: null,
        data: foundItems
      });
    } catch (error) {
      console.error('Error in getFoundItems:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while retrieving found items'
      });
    }
  }

  // Get found item by ID
  async getFoundItemById(req: Request, res: Response) {
    try {
      const foundItem = await this.foundItemService.getFoundItemById(Number(req.params.id));
      return res.status(200).json({
        message: 'Found item retrieved successfully',
        error: null,
        data: foundItem
      });
    } catch (error) {
      console.error('Error in getFoundItemById:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while retrieving the found item'
      });
    }
  }

  // Get found items by finder ID
  async getFoundItemsByFinderId(req: Request, res: Response) {
    try {
      const foundItems = await this.foundItemService.getFoundItemsByFinderId(Number(req.params.finderId));
      return res.status(200).json({
        message: foundItems.length ? 'User found items retrieved successfully' : 'No found items found for this user',
        error: null,
        data: foundItems
      });
    } catch (error) {
      console.error('Error in getFoundItemsByFinderId:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while retrieving user found items'
      });
    }
  }

  // Update found item
  async updateFoundItem(req: Request, res: Response) {
    try {
      const updatedItem = await this.foundItemService.updateFoundItem(
        Number(req.params.id),
        Number(req.body.finderId),
        {
          title: req.body.title,
          description: req.body.description,
          location: req.body.location,
          category: req.body.category,
          imageUrl: req.body.imageUrl
        }
      );

      return res.status(200).json({
        message: 'Found item updated successfully',
        error: null,
        data: updatedItem
      });
    } catch (error) {
      console.error('Error in updateFoundItem:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while updating the found item'
      });
    }
  }

  // Delete found item
  async deleteFoundItem(req: Request, res: Response) {
    try {
      await this.foundItemService.deleteFoundItem(Number(req.params.id), Number(req.body.finderId));
      return res.status(200).json({
        message: 'Found item deleted successfully',
        error: null
      });
    } catch (error) {
      console.error('Error in deleteFoundItem:', error);
      if (error instanceof ValidationError) {
        return res.status(error.status).json({
          message: error.message,
          error: error.details
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred while deleting the found item'
      });
    }
  }
} 