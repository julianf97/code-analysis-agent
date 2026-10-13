import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'analysis_revisions' })
export class AnalysisRevision {
  @PrimaryColumn({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @PrimaryColumn({ type: 'text' })
  kind!: 'base' | 'comparison';

  @Column({ type: 'text' })
  branch!: string;

  @Column({ type: 'varchar', name: 'commit_sha', length: 40 })
  commitSha!: string;

  @ManyToOne(() => Analysis, analysis => analysis.revisions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
