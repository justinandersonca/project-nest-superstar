import { AppDataSource } from '../config/typeorm.config';
import { seedInitialData } from './seeds/initial.seed';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    await seedInitialData(AppDataSource);
    console.log('Seed data has been inserted!');

    await AppDataSource.destroy();
    console.log('Data Source has been destroyed!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed(); 