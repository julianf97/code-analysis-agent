import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisStep = sequelize.define(
  'AnalysisStep',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    name: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSONB, allowNull: true },
    startedAt: { type: DataTypes.DATE, allowNull: false, field: 'started_at', defaultValue: DataTypes.NOW },
    finishedAt: { type: DataTypes.DATE, allowNull: true, field: 'finished_at' },
  },
  {
    tableName: 'analysis_steps',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisStep;
