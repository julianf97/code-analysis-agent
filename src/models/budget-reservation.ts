import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Analysis } from './analysis.js';

@Entity({ name: 'budget_reservations' })
export class BudgetReservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'analysis_id' })
  analysisId!: string;

  @Column({ type: 'numeric', name: 'amount_usd', precision: 12, scale: 6 })
  amountUsd!: string;

  @Column({ type: 'timestamptz', name: 'released_at', nullable: true })
  releasedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Analysis, analysis => analysis.budgetReservations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysis_id' })
  analysis!: Relation<Analysis>;

}
