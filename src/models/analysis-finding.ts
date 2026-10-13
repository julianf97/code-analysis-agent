import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisFinding = sequelize.define(
  'AnalysisFinding',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    fingerprint: { type: DataTypes.STRING(64), allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    priority: { type: DataTypes.STRING, allowNull: false },
    evidence: { type: DataTypes.JSONB, allowNull: false },
    impact: { type: DataTypes.TEXT, allowNull: false },
    recommendation: { type: DataTypes.TEXT, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    justification: { type: DataTypes.TEXT, allowNull: false },
    confidence: { type: DataTypes.DECIMAL(4,3), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'analysis_findings',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisFinding;
