import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, type Relation, Index } from 'typeorm';
import { Repository } from './repository.js';
import { AnalysisJob } from './analysis-job.js';
import { AnalysisRevision } from './analysis-revision.js';
import { AnalysisStep } from './analysis-step.js';
import { AnalysisFile } from './analysis-file.js';
import { AnalysisFinding } from './analysis-finding.js';
import { AnalysisReport } from './analysis-report.js';
import { AnalysisMessage } from './analysis-message.js';
import { LlmUsageEvent } from './llm-usage-event.js';
import { BudgetReservation } from './budget-reservation.js';

@Index('analyses_repo_idx', ['repositoryId', 'createdAt'])
@Entity({ name: 'analyses' })
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'repository_id' })
  repositoryId!: string;

  @Column({ type: 'text' })
  mode!: 'directed' | 'autonomous';

  @Column({ type: 'text' })
  depth!: 'QUICK' | 'STANDARD' | 'DEEP';

  @Column({ type: 'text', nullable: true })
  question!: string | null;

  @Column({ type: 'jsonb' })
  categories!: string[];

  @Column({ type: 'text' })
  branch!: string;

  @Column({ type: 'text', name: 'compare_branch', nullable: true })
  compareBranch!: string | null;

  @Column({ type: 'jsonb' })
  config!: Record<string, unknown>;

  @Column({ type: 'text', default: 'queued' })
  status!: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'partial';

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt!: Date | null;

  @ManyToOne(() => Repository, repository => repository.analyses, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'repository_id' })
  repository!: Relation<Repository>;

  @OneToOne(() => AnalysisJob, child => child.analysis)
  job!: Relation<AnalysisJob>;

  @OneToMany(() => AnalysisRevision, child => child.analysis)
  revisions!: Relation<AnalysisRevision[]>;

  @OneToMany(() => AnalysisStep, child => child.analysis)
  steps!: Relation<AnalysisStep[]>;

  @OneToMany(() => AnalysisFile, child => child.analysis)
  files!: Relation<AnalysisFile[]>;

  @OneToMany(() => AnalysisFinding, child => child.analysis)
  findings!: Relation<AnalysisFinding[]>;

  @OneToMany(() => AnalysisReport, child => child.analysis)
  reports!: Relation<AnalysisReport[]>;

  @OneToMany(() => AnalysisMessage, child => child.analysis)
  messages!: Relation<AnalysisMessage[]>;

  @OneToMany(() => LlmUsageEvent, child => child.analysis)
  usageEvents!: Relation<LlmUsageEvent[]>;

  @OneToMany(() => BudgetReservation, child => child.analysis)
  budgetReservations!: Relation<BudgetReservation[]>;

}
