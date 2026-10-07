import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_TESTS } from '../data/mockTests';

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  try {
    const testsRef = collection(db, 'tests');
    const snapshot = await getDocs(testsRef);

    if (snapshot.empty) {
      console.log('DB is empty. Loading initial mock data...');

      for (const testData of INITIAL_TESTS) {
        const customId = testData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const testDocRef = doc(db, 'tests', customId);

        await setDoc(testDocRef, {
          ...testData,
          createdAt: new Date().toISOString(),
        });
      }
      console.log('Database seeding completed successfully!');
    }
  } catch (error) {
    console.error('Error occurred while seeding the database:', error);
  }
};