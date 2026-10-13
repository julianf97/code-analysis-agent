import { getSequelize } from '../sequelize.js';
import { defineRepositoryModel } from './repository.model.js';
import { defineAnalysisModel } from './analysis.model.js';
import { defineJobModel } from './job.model.js';
import { defineAuxiliaryModels } from './auxiliary.models.js';

export function initializeModels() {
  const sequelize = getSequelize();
  const Repository = sequelize.models.Repository
    ? (sequelize.models.Repository as ReturnType<typeof defineRepositoryModel>)
    : defineRepositoryModel(sequelize);
  const Analysis = sequelize.models.Analysis
    ? (sequelize.models.Analysis as ReturnType<typeof defineAnalysisModel>)
    : defineAnalysisModel(sequelize);
  const AnalysisJob = sequelize.models.AnalysisJob
    ? (sequelize.models.AnalysisJob as ReturnType<typeof defineJobModel>)
    : defineJobModel(sequelize);
  const auxiliary = sequelize.models.AnalysisProfile
    ? {
        AnalysisProfile: sequelize.models.AnalysisProfile,
        AnalysisRevision: sequelize.models.AnalysisRevision,
        AnalysisStep: sequelize.models.AnalysisStep,
        AnalysisFile: sequelize.models.AnalysisFile,
        AnalysisFinding: sequelize.models.AnalysisFinding,
        AnalysisReport: sequelize.models.AnalysisReport,
        AnalysisMessage: sequelize.models.AnalysisMessage,
        LlmUsageEvent: sequelize.models.LlmUsageEvent,
        BudgetReservation: sequelize.models.BudgetReservation,
      }
    : defineAuxiliaryModels(sequelize);

  Repository.hasMany(Analysis, { foreignKey: 'repository_id', as: 'analyses' });
  Analysis.belongsTo(Repository, { foreignKey: 'repository_id', as: 'repository' });
  Analysis.hasOne(AnalysisJob, { foreignKey: 'analysis_id', as: 'job' });
  AnalysisJob.belongsTo(Analysis, { foreignKey: 'analysis_id', as: 'analysis' });
  for (const model of Object.values(auxiliary)) {
    if (model === auxiliary.AnalysisProfile) continue;
    Analysis.hasMany(model, { foreignKey: 'analysis_id' });
    model.belongsTo(Analysis, { foreignKey: 'analysis_id' });
  }
  return { Repository, Analysis, AnalysisJob, ...auxiliary };
}

export type AppModels = ReturnType<typeof initializeModels>;
let models: AppModels | undefined;
export function getModels(): AppModels {
  models ??= initializeModels();
  return models;
}
