import { Entity, Column, PrimaryGeneratedColumn, OneToMany, type Relation, Index } from 'typeorm';
import { Analysis } from './analysis.js';

@Index('repositories_provider_owner_name_key', ['provider', 'owner', 'name'], { unique: true })
@Entity({ name: 'repositories' })
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', default: 'github' })
  provider!: 'github';

  @Column({ type: 'text' })
  owner!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Analysis, analysis => analysis.repository)
  analyses!: Relation<Analysis[]>;

}
