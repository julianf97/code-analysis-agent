import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisReport = sequelize.define(
  'AnalysisReport',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    version: { type: DataTypes.INTEGER, allowNull: false },
    jsonDocument: { type: DataTypes.JSONB, allowNull: false, field: 'json_document' },
    markdown: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_reports',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisReport;
