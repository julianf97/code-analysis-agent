import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisMessage = sequelize.define(
  'AnalysisMessage',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    role: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_messages',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisMessage;
