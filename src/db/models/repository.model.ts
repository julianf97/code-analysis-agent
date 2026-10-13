import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

export interface RepositoryAttributes {
  id: string;
  provider: 'github';
  owner: string;
  name: string;
  created_at: Date;
}

type RepositoryCreation = Optional<RepositoryAttributes, 'id' | 'provider' | 'created_at'>;

export interface RepositoryInstance extends Model<RepositoryAttributes, RepositoryCreation>, RepositoryAttributes {}

export function defineRepositoryModel(sequelize: Sequelize) {
  return sequelize.define<RepositoryInstance>('Repository', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    provider: { type: DataTypes.STRING, allowNull: false, defaultValue: 'github' },
    owner: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'repositories', timestamps: false, indexes: [{ unique: true, fields: ['provider', 'owner', 'name'] }] });
}
