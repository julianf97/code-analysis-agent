import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

export type AnalysisMode = 'directed' | 'autonomous';
export type AnalysisDepth = 'QUICK' | 'STANDARD' | 'DEEP';
export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'partial';

export interface AnalysisAttributes {
  id: string;
  repository_id: string;
  mode: AnalysisMode;
  depth: AnalysisDepth;
  question: string | null;
  categories: string[];
  branch: string;
  compare_branch: string | null;
  config: Record<string, unknown>;
  status: AnalysisStatus;
  summary: string | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

type AnalysisCreation = Optional<AnalysisAttributes, 'id' | 'question' | 'compare_branch' | 'status' | 'summary' | 'error_message' | 'created_at' | 'updated_at' | 'completed_at'>;
export interface AnalysisInstance extends Model<AnalysisAttributes, AnalysisCreation>, AnalysisAttributes {}

export function defineAnalysisModel(sequelize: Sequelize) {
  return sequelize.define<AnalysisInstance>('Analysis', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    repository_id: { type: DataTypes.UUID, allowNull: false },
    mode: { type: DataTypes.STRING, allowNull: false },
    depth: { type: DataTypes.STRING, allowNull: false },
    question: { type: DataTypes.TEXT, allowNull: true },
    categories: { type: DataTypes.JSONB, allowNull: false },
    branch: { type: DataTypes.TEXT, allowNull: false },
    compare_branch: { type: DataTypes.TEXT, allowNull: true },
    config: { type: DataTypes.JSONB, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'queued' },
    summary: { type: DataTypes.TEXT, allowNull: true },
    error_message: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    completed_at: { type: DataTypes.DATE, allowNull: true },
  }, { tableName: 'analyses', timestamps: false });
}
