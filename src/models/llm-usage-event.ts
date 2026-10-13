import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'llm_usage_events' })
export class LlmUsageEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'text' })
  model!: string;

  @Column({ type: 'text' })
  task!: string;

  @Column({ type: 'integer', name: 'input_tokens', default: 0 })
  inputTokens!: number;

  @Column({ type: 'integer', name: 'output_tokens', default: 0 })
  outputTokens!: number;

  @Column({ type: 'numeric', name: 'estimated_cost_usd', precision: 12, scale: 6, default: '0' })
  estimatedCostUsd!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.usageEvents, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
