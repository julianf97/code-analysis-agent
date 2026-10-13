import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisProfile = sequelize.define(
  'AnalysisProfile',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(100), allowNull: false },
    configuration: { type: DataTypes.JSONB, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_profiles',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisProfile;
