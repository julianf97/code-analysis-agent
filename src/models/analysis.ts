import { DataTypes, type Model, type Optional } from 'sequelize';
import { sequelize } from '../db/index.js';

export type AnalysisMode = 'directed' | 'autonomous';
export type AnalysisDepth = 'QUICK' | 'STANDARD' | 'DEEP';
export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'partial';

export interface AnalysisAttributes {
  id: string;
  repositoryId: string;
  mode: AnalysisMode;
  depth: AnalysisDepth;
  question: string | null;
  categories: string[];
  branch: string;
  compareBranch: string | null;
  config: Record<string, unknown>;
  status: AnalysisStatus;
  summary: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}
type AnalysisCreation = Optional<AnalysisAttributes, 'id' | 'question' | 'compareBranch' | 'status' | 'summary' | 'errorMessage' | 'createdAt' | 'updatedAt' | 'completedAt'>;
export interface AnalysisInstance extends Model<AnalysisAttributes, AnalysisCreation>, AnalysisAttributes {}

const Analysis = sequelize.define<AnalysisInstance>(
  'Analysis',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    repositoryId: {
      type: DataTypes.UUID,
      field: 'repository_id',
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['directed', 'autonomous']] },
    },
    depth: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['QUICK', 'STANDARD', 'DEEP']] },
    },
    question: { type: DataTypes.TEXT, allowNull: true },
    categories: { type: DataTypes.JSONB, allowNull: false },
    branch: { type: DataTypes.TEXT, allowNull: false },
    compareBranch: { type: DataTypes.TEXT, field: 'compare_branch', allowNull: true },
    config: { type: DataTypes.JSONB, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'queued',
      validate: { isIn: [['queued', 'running', 'completed', 'failed', 'cancelled', 'partial']] },
    },
    summary: { type: DataTypes.TEXT, allowNull: true },
    errorMessage: { type: DataTypes.TEXT, field: 'error_message', allowNull: true },
    createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at', allowNull: false, defaultValue: DataTypes.NOW },
    completedAt: { type: DataTypes.DATE, field: 'completed_at', allowNull: true },
  },
  {
    tableName: 'analyses',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default Analysis;
