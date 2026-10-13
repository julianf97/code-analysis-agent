import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisFile = sequelize.define(
  'AnalysisFile',
  {
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id', primaryKey: true },
    path: { type: DataTypes.TEXT, allowNull: false, primaryKey: true },
    commitSha: { type: DataTypes.STRING(40), allowNull: false, field: 'commit_sha', primaryKey: true },
    categories: { type: DataTypes.JSONB, allowNull: false },
    inspectedAt: { type: DataTypes.DATE, allowNull: false, field: 'inspected_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_files',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisFile;
