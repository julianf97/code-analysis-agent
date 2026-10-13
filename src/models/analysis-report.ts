import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation, Index } from 'typeorm';
import { Analysis } from './analysis.js';

@Index('analysis_reports_analysis_id_version_key', ['analysisId', 'version'], { unique: true })
@Entity({ name: 'analysis_reports' })
export class AnalysisReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'integer' })
  version!: number;

  @Column({ type: 'jsonb', name: 'json_document' })
  jsonDocument!: Record<string, unknown>;

  @Column({ type: 'text' })
  markdown!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.reports, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
