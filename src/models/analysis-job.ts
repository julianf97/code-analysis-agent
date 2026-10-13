import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'analysis_jobs' })
export class AnalysisJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id', unique: true })
  analysisId!: string;

  @Column({ type: 'text', default: 'queued' })
  status!: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

  @Column({ type: 'integer', default: 0 })
  attempts!: number;

  @Column({ type: 'integer', name: 'max_attempts', default: 3 })
  maxAttempts!: number;

  @Column({ type: 'text', name: 'leased_by', nullable: true })
  leasedBy!: string | null;

  @Column({ type: 'timestamptz', name: 'lease_until', nullable: true })
  leaseUntil!: Date | null;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage!: string | null;

  @Column({ type: 'timestamptz', name: 'started_at', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'finished_at', nullable: true })
  finishedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToOne(() => Analysis, analysis => analysis.job, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
