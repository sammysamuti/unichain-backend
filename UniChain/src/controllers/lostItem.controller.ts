import { Request, Response } from 'express';
import { LostItemService, ValidationError } from '../services/lostItem.service';

const lostItemService = new LostItemService();

// Create a new lost item
export const createLostItem = async (req: Request, res: Response) => {
  try {
    const lostItem = await lostItemService.createLostItem(req.body);
    return res.status(201).json({
      message: 'Lost item created successfully',
      error: null,
      data: lostItem
    });
  } catch (error) {
    console.error('Error in createLostItem:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while creating the lost item'
    });
  }
};

// Get all lost items with filters
export const getLostItems = async (req: Request, res: Response) => {
  try {
    const lostItems = await lostItemService.getLostItems(req.query);
    return res.status(200).json({
      message: lostItems.length ? 'Lost items retrieved successfully' : 'No lost items found',
      error: null,
      data: lostItems
    });
  } catch (error) {
    console.error('Error in getLostItems:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while retrieving lost items'
    });
  }
};

// Get lost item by ID
export const getLostItemById = async (req: Request, res: Response) => {
  try {
    const lostItem = await lostItemService.getLostItemById(Number(req.params.id));
    return res.status(200).json({
      message: 'Lost item retrieved successfully',
      error: null,
      data: lostItem
    });
  } catch (error) {
    console.error('Error in getLostItemById:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while retrieving the lost item'
    });
  }
};

// Get lost items by owner ID
export const getLostItemsByUserId = async (req: Request, res: Response) => {
  try {
    const lostItems = await lostItemService.getLostItemsByUserId(Number(req.params.userId));
    return res.status(200).json({
      message: lostItems.length ? 'User lost items retrieved successfully' : 'No lost items found for this user',
      error: null,
      data: lostItems
    });
  } catch (error) {
    console.error('Error in getLostItemsByUserId:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while retrieving user lost items'
    });
  }
};

// Update lost item
export const updateLostItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await lostItemService.updateLostItem(
      Number(req.params.id),
      Number(req.body.ownerId),
      req.body
    );
    return res.status(200).json({
      message: 'Lost item updated successfully',
      error: null,
      data: updatedItem
    });
  } catch (error) {
    console.error('Error in updateLostItem:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while updating the lost item'
    });
  }
};

// Delete lost item
export const deleteLostItem = async (req: Request, res: Response) => {
  try {
    await lostItemService.deleteLostItem(Number(req.params.id), Number(req.body.ownerId));
    return res.status(200).json({
      message: 'Lost item deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteLostItem:', error);
    if (error instanceof ValidationError) {
      return res.status(error.status).json({
        message: error.message,
        error: error.details
      });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while deleting the lost item'
    });
  }
};