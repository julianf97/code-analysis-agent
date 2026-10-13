import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'analysis_files' })
export class AnalysisFile {
  @PrimaryColumn({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @PrimaryColumn({ type: 'text' })
  path!: string;

  @PrimaryColumn({ type: 'varchar', name: 'commit_sha', length: 40 })
  commitSha!: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  categories!: string[];

  @Column({ type: 'timestamptz', name: 'inspected_at', default: () => 'CURRENT_TIMESTAMP' })
  inspectedAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.files, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
