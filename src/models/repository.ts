import { DataTypes, type Model, type Optional } from 'sequelize';
import { sequelize } from '../db/index.js';

export interface RepositoryAttributes {
  id: string;
  provider: 'github';
  owner: string;
  name: string;
  createdAt: Date;
}
type RepositoryCreation = Optional<RepositoryAttributes, 'id' | 'provider' | 'createdAt'>;
export interface RepositoryInstance extends Model<RepositoryAttributes, RepositoryCreation>, RepositoryAttributes {}

const Repository = sequelize.define<RepositoryInstance>(
  'Repository',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'github',
      validate: { isIn: [['github']] },
    },
    owner: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'repositories',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
    indexes: [{ unique: true, fields: ['provider', 'owner', 'name'] }],
  },
);

export default Repository;
