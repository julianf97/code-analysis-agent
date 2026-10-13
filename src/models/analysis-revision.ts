import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const AnalysisRevision = sequelize.define(
  'AnalysisRevision',
  {
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id', primaryKey: true },
    kind: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    branch: { type: DataTypes.TEXT, allowNull: false },
    commitSha: { type: DataTypes.STRING(40), allowNull: false, field: 'commit_sha' },
  },
  {
    tableName: 'analysis_revisions',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default AnalysisRevision;
