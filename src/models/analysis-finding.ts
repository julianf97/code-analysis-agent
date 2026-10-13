import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation, Index } from 'typeorm';
import { Analysis } from './analysis.js';

@Index('analysis_findings_analysis_id_fingerprint_key', ['analysisId', 'fingerprint'], { unique: true })
@Entity({ name: 'analysis_findings' })
export class AnalysisFinding {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'varchar', length: 64 })
  fingerprint!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  priority!: 'Critical' | 'High' | 'Medium' | 'Low';

  @Column({ type: 'jsonb' })
  evidence!: Record<string, unknown>;

  @Column({ type: 'text' })
  impact!: string;

  @Column({ type: 'text' })
  recommendation!: string;

  @Column({ type: 'text' })
  action!: 'Keep' | 'Refactor' | 'Migrate' | 'Remove';

  @Column({ type: 'text' })
  justification!: string;

  @Column({ type: 'numeric', precision: 4, scale: 3 })
  confidence!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.findings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
