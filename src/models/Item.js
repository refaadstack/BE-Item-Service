import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    }
  },
  satuan: {
    type: DataTypes.ENUM,
    values: ['pcs', 'kg', 'm', 'm2', 'm3', 'unit', 'set', 'box', 'roll'],
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Satuan cannot be empty'
      }
    }
  },
  harga_satuan: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Harga satuan must be an integer'
      },
      min: {
        args: [0],
        msg: 'Harga satuan must be greater than or equal to 0'
      }
    }
  }
}, {
  tableName: 'items',
  timestamps: true,
  underscored: true
});

export default Item;
