import { DataTypes, type Sequelize } from 'sequelize';

const id = () => ({ type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 });
const analysisId = () => ({ type: DataTypes.UUID, allowNull: false });
const createdAt = () => ({ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW });

export function defineAuxiliaryModels(sequelize: Sequelize) {
  const AnalysisProfile = sequelize.define('AnalysisProfile', {
    id: id(), name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    configuration: { type: DataTypes.JSONB, allowNull: false },
    created_at: createdAt(), updated_at: createdAt(),
  }, { tableName: 'analysis_profiles', timestamps: false });

  const AnalysisRevision = sequelize.define('AnalysisRevision', {
    analysis_id: { ...analysisId(), primaryKey: true },
    kind: { type: DataTypes.STRING, primaryKey: true },
    branch: { type: DataTypes.TEXT, allowNull: false },
    commit_sha: { type: DataTypes.STRING(40), allowNull: false },
  }, { tableName: 'analysis_revisions', timestamps: false });

  const AnalysisStep = sequelize.define('AnalysisStep', {
    id: id(), analysis_id: analysisId(), name: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.TEXT, allowNull: false },
    details: { type: DataTypes.JSONB },
    started_at: createdAt(), finished_at: { type: DataTypes.DATE },
  }, { tableName: 'analysis_steps', timestamps: false });

  const AnalysisFile = sequelize.define('AnalysisFile', {
    analysis_id: { ...analysisId(), primaryKey: true },
    path: { type: DataTypes.TEXT, primaryKey: true },
    commit_sha: { type: DataTypes.STRING(40), primaryKey: true },
    categories: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    inspected_at: createdAt(),
  }, { tableName: 'analysis_files', timestamps: false });

  const AnalysisFinding = sequelize.define('AnalysisFinding', {
    id: id(), analysis_id: analysisId(),
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
    confidence: { type: DataTypes.DECIMAL(4, 3), allowNull: false },
    created_at: createdAt(),
  }, { tableName: 'analysis_findings', timestamps: false });

  const AnalysisReport = sequelize.define('AnalysisReport', {
    id: id(), analysis_id: analysisId(),
    version: { type: DataTypes.INTEGER, allowNull: false },
    json_document: { type: DataTypes.JSONB, allowNull: false },
    markdown: { type: DataTypes.TEXT, allowNull: false },
    created_at: createdAt(),
  }, { tableName: 'analysis_reports', timestamps: false });

  const AnalysisMessage = sequelize.define('AnalysisMessage', {
    id: id(), analysis_id: analysisId(),
    role: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    created_at: createdAt(),
  }, { tableName: 'analysis_messages', timestamps: false });

  const LlmUsageEvent = sequelize.define('LlmUsageEvent', {
    id: id(), analysis_id: analysisId(),
    model: { type: DataTypes.TEXT, allowNull: false },
    task: { type: DataTypes.TEXT, allowNull: false },
    input_tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    output_tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    estimated_cost_usd: { type: DataTypes.DECIMAL(12, 6), allowNull: false, defaultValue: 0 },
    created_at: createdAt(),
  }, { tableName: 'llm_usage_events', timestamps: false });

  const BudgetReservation = sequelize.define('BudgetReservation', {
    id: id(), analysis_id: analysisId(),
    amount_usd: { type: DataTypes.DECIMAL(12, 6), allowNull: false },
    released_at: { type: DataTypes.DATE },
    created_at: createdAt(),
  }, { tableName: 'budget_reservations', timestamps: false });

  return { AnalysisProfile, AnalysisRevision, AnalysisStep, AnalysisFile, AnalysisFinding, AnalysisReport, AnalysisMessage, LlmUsageEvent, BudgetReservation };
}
