import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

export interface JobAttributes {
  id: string;
  analysis_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  attempts: number;
  max_attempts: number;
  leased_by: string | null;
  lease_until: Date | null;
  error_message: string | null;
  started_at: Date | null;
  finished_at: Date | null;
  created_at: Date;
}
type JobCreation = Optional<JobAttributes, 'id' | 'status' | 'attempts' | 'max_attempts' | 'leased_by' | 'lease_until' | 'error_message' | 'started_at' | 'finished_at' | 'created_at'>;
export interface JobInstance extends Model<JobAttributes, JobCreation>, JobAttributes {}

export function defineJobModel(sequelize: Sequelize) {
  return sequelize.define<JobInstance>('AnalysisJob', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysis_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'queued' },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    max_attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    leased_by: { type: DataTypes.TEXT, allowNull: true },
    lease_until: { type: DataTypes.DATE, allowNull: true },
    error_message: { type: DataTypes.TEXT, allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: true },
    finished_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'analysis_jobs', timestamps: false });
}
