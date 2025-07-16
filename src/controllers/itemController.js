import { Sequelize } from 'sequelize';
import { sequelize, Item } from '../models/index.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { validateItem, validateUpdateItem } from '../utils/validation.js';

export const getAllItems = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const validSortFields = ['id', 'name', 'volume', 'satuan', 'harga_satuan', 'created_at', 'updated_at'];
    const validSortOrders = ['ASC', 'DESC'];

    const orderBy = validSortFields.includes(sortBy) ? sortBy : 'id';
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const whereClause = search ? {
      [Sequelize.Op.or]: [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { satuan: { [Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Item.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [[orderBy, order]]
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    sendSuccessResponse(res, 200, 'Items retrieved successfully', {
      items: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid item ID');
    }

    const item = await Item.findByPk(parseInt(id));

    if (!item) {
      return sendErrorResponse(res, 404, 'Item not found');
    }

    sendSuccessResponse(res, 200, 'Item retrieved successfully', item);
  } catch (error) {
    console.error('Error fetching item:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const createItem = async (req, res) => {
  try {
    const { error, value } = validateItem(req.body);

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    const item = await Item.create(value);
    sendSuccessResponse(res, 201, 'Item created successfully', item);
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid item ID');
    }

    const { error, value } = validateUpdateItem(req.body);

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    const item = await Item.findByPk(parseInt(id));

    if (!item) {
      return sendErrorResponse(res, 404, 'Item not found');
    }

    await item.update(value);
    sendSuccessResponse(res, 200, 'Item updated successfully', item);
  } catch (error) {
    console.error('Error updating item:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid item ID');
    }

    const item = await Item.findByPk(parseInt(id));

    if (!item) {
      return sendErrorResponse(res, 404, 'Item not found');
    }

    await item.destroy();
    sendSuccessResponse(res, 200, 'Item deleted successfully');
  } catch (error) {
    console.error('Error deleting item:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const bulkDeleteItems = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return sendErrorResponse(res, 400, 'Please provide an array of item IDs');
    }

    const numericIds = ids.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));

    if (numericIds.length === 0) {
      return sendErrorResponse(res, 400, 'No valid item IDs provided');
    }

    const deletedCount = await Item.destroy({
      where: {
        id: numericIds
      }
    });

    sendSuccessResponse(res, 200, `${deletedCount} item(s) deleted successfully`, {
      deletedCount,
      requestedIds: numericIds
    });
  } catch (error) {
    console.error('Error bulk deleting items:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const getItemsStats = async (req, res) => {
  try {
    const totalItems = await Item.count();
    const totalValue = await Item.sum('harga_satuan');
    
    const avgPrice = await Item.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('harga_satuan')), 'avgPrice']
      ],
      raw: true
    });

    const mostExpensiveItem = await Item.findOne({
      order: [['harga_satuan', 'DESC']]
    });

    const cheapestItem = await Item.findOne({
      order: [['harga_satuan', 'ASC']]
    });

    sendSuccessResponse(res, 200, 'Statistics retrieved successfully', {
      totalItems,
      totalValue: totalValue || 0,
      averagePrice: Math.round(avgPrice[0]?.avgPrice || 0),
      mostExpensiveItem,
      cheapestItem
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const getItemsByIds = async (req, res) => {
  try {
    const { ids } = req.query;

    console.log('Received bulk item request with ids:', ids);

    if (!ids) {
      return sendErrorResponse(res, 400, 'IDs parameter is required');
    }

    // Parse IDs - could be comma-separated string or array
    let itemIds = [];
    if (typeof ids === 'string') {
      itemIds = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    } else if (Array.isArray(ids)) {
      itemIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
    }

    if (itemIds.length === 0) {
      return sendErrorResponse(res, 400, 'No valid item IDs provided');
    }

    const items = await Item.findAll({
      where: {
        id: itemIds
      }
    });

    sendSuccessResponse(res, 200, 'Items retrieved successfully', {
      items: items
    });
  } catch (error) {
    console.error('Error fetching items by IDs:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};
