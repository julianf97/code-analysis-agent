import { Entity, Column, PrimaryGeneratedColumn, type Relation } from 'typeorm';

@Entity({ name: 'analysis_profiles' })
export class AnalysisProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'jsonb' })
  configuration!: Record<string, unknown>;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

}
