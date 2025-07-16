
import Joi from 'joi';

const itemSchema = Joi.object({
  name: Joi.string().required().min(1).max(1000).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 1 character',
    'string.max': 'Name cannot exceed 1000 characters',
    'any.required': 'Name is required'
  }),
  volume: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Volume must be a number',
    'number.min': 'Volume must be greater than or equal to 0',
    'any.required': 'Volume is required'
  }),
  satuan: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Satuan is required',
    'string.min': 'Satuan must be at least 1 character',
    'string.max': 'Satuan cannot exceed 50 characters',
    'any.required': 'Satuan is required'
  }),
  harga_satuan: Joi.number().integer().min(0).required().messages({
    'number.base': 'Harga satuan must be a number',
    'number.integer': 'Harga satuan must be an integer',
    'number.min': 'Harga satuan must be greater than or equal to 0',
    'any.required': 'Harga satuan is required'
  })
});

const updateItemSchema = Joi.object({
  name: Joi.string().min(1).max(1000).messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character',
    'string.max': 'Name cannot exceed 1000 characters'
  }),
  volume: Joi.number().precision(2).min(0).messages({
    'number.base': 'Volume must be a number',
    'number.min': 'Volume must be greater than or equal to 0'
  }),
  satuan: Joi.string().min(1).max(50).messages({
    'string.empty': 'Satuan cannot be empty',
    'string.min': 'Satuan must be at least 1 character',
    'string.max': 'Satuan cannot exceed 50 characters'
  }),
  harga_satuan: Joi.number().integer().min(0).messages({
    'number.base': 'Harga satuan must be a number',
    'number.integer': 'Harga satuan must be an integer',
    'number.min': 'Harga satuan must be greater than or equal to 0'
  })
}).min(1);

export const validateItem = (data) => {
  return itemSchema.validate(data);
};

export const validateUpdateItem = (data) => {
  return updateItemSchema.validate(data);
};
