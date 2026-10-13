import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const LlmUsageEvent = sequelize.define(
  'LlmUsageEvent',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    model: { type: DataTypes.TEXT, allowNull: false },
    task: { type: DataTypes.TEXT, allowNull: false },
    inputTokens: { type: DataTypes.INTEGER, allowNull: false, field: 'input_tokens' },
    outputTokens: { type: DataTypes.INTEGER, allowNull: false, field: 'output_tokens' },
    estimatedCostUsd: { type: DataTypes.DECIMAL(12,6), allowNull: false, field: 'estimated_cost_usd' },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'llm_usage_events',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default LlmUsageEvent;
