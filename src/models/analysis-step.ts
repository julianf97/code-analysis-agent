import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation, Index } from 'typeorm';
import { Analysis } from './analysis.js';

@Index('analysis_steps_analysis_id_name_key', ['analysisId', 'name'], { unique: true })
@Entity({ name: 'analysis_steps' })
export class AnalysisStep {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  details!: Record<string, unknown> | null;

  @Column({ type: 'timestamptz', name: 'started_at', default: () => 'CURRENT_TIMESTAMP' })
  startedAt!: Date;

  @Column({ type: 'timestamptz', name: 'finished_at', nullable: true })
  finishedAt!: Date | null;

  @ManyToOne(() => Analysis, analysis => analysis.steps, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
