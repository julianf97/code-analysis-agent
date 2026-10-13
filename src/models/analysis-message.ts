import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'analysis_messages' })
export class AnalysisMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'text' })
  role!: 'user' | 'assistant';

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.messages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
