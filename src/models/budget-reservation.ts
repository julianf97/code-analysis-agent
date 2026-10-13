import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const BudgetReservation = sequelize.define(
  'BudgetReservation',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    analysisId: { type: DataTypes.UUID, allowNull: false, field: 'analysis_id' },
    amountUsd: { type: DataTypes.DECIMAL(12,6), allowNull: false, field: 'amount_usd' },
    releasedAt: { type: DataTypes.DATE, allowNull: true, field: 'released_at' },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'budget_reservations',
    schema: process.env.DB_USE_TEST_SCHEMA === 'true' ? process.env.DB_TEST_SCHEMA : process.env.DB_SCHEMA || 'public',
    timestamps: false,
  },
);

export default BudgetReservation;
