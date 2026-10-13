import type { ModelStatic, Model } from 'sequelize';

type Models = {
  Repository: ModelStatic<Model>;
  Analysis: ModelStatic<Model>;
  AnalysisJob: ModelStatic<Model>;
  AnalysisRevision: ModelStatic<Model>;
  AnalysisStep: ModelStatic<Model>;
  AnalysisFile: ModelStatic<Model>;
  AnalysisFinding: ModelStatic<Model>;
  AnalysisReport: ModelStatic<Model>;
  AnalysisMessage: ModelStatic<Model>;
  LlmUsageEvent: ModelStatic<Model>;
  BudgetReservation: ModelStatic<Model>;
};

export default function registerAssociations({
  Repository, Analysis, AnalysisJob, AnalysisRevision, AnalysisStep,
  AnalysisFile, AnalysisFinding, AnalysisReport, AnalysisMessage,
  LlmUsageEvent, BudgetReservation,
}: Models) {
  Repository.hasMany(Analysis, { foreignKey: { name: 'repositoryId', field: 'repository_id' }, onDelete: 'RESTRICT' });
  Analysis.belongsTo(Repository, { foreignKey: { name: 'repositoryId', field: 'repository_id' }, onDelete: 'RESTRICT' });
  Analysis.hasOne(AnalysisJob, { foreignKey: { name: 'analysisId', field: 'analysis_id' }, onDelete: 'CASCADE' });
  AnalysisJob.belongsTo(Analysis, { foreignKey: { name: 'analysisId', field: 'analysis_id' }, onDelete: 'CASCADE' });

  const childModels = [
    AnalysisRevision, AnalysisStep, AnalysisFile, AnalysisFinding,
    AnalysisReport, AnalysisMessage, LlmUsageEvent, BudgetReservation,
  ];
  for (const child of childModels) {
    Analysis.hasMany(child, { foreignKey: { name: 'analysisId', field: 'analysis_id' }, onDelete: 'CASCADE' });
    child.belongsTo(Analysis, { foreignKey: { name: 'analysisId', field: 'analysis_id' }, onDelete: 'CASCADE' });
  }
}
