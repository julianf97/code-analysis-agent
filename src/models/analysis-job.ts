import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisJob = sequelize.define(
  'AnalysisJob',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, field: 'analysis_id', allowNull: false, unique: true },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'queued',
      validate: { isIn: [['queued', 'running', 'completed', 'failed', 'cancelled']] },
    },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    maxAttempts: { type: DataTypes.INTEGER, field: 'max_attempts', allowNull: false, defaultValue: 3 },
    leasedBy: { type: DataTypes.TEXT, field: 'leased_by', allowNull: true },
    leaseUntil: { type: DataTypes.DATE, field: 'lease_until', allowNull: true },
    errorMessage: { type: DataTypes.TEXT, field: 'error_message', allowNull: true },
    startedAt: { type: DataTypes.DATE, field: 'started_at', allowNull: true },
    finishedAt: { type: DataTypes.DATE, field: 'finished_at', allowNull: true },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_jobs',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisJob;
