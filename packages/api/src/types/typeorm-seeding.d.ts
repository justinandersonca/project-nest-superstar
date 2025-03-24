declare module '@jorgebodega/typeorm-seeding' {
  import { DataSource } from 'typeorm';

  export interface Seeder {
    run(dataSource: DataSource): Promise<void>;
  }

  export interface SeederConstructor {
    new (): Seeder;
  }

  export interface SeederOptions {
    seeds?: string[];
    factories?: string[];
  }

  export function runSeeder(dataSource: DataSource, seeder: SeederConstructor): Promise<void>;
  export function runSeeders(dataSource: DataSource, options?: SeederOptions): Promise<void>;
} 