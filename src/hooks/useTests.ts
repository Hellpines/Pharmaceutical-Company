import { useQuery } from '@tanstack/react-query';
import { type TestRecord } from '../types/test';
import { db } from '../services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const testQueryKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
};

export const TESTS_COLLECTION = 'tests';

const getAllTests = async (): Promise<TestRecord[]> => {
  const testsRef = collection(db, TESTS_COLLECTION);
  const q = query(testsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as TestRecord[];
}

export const useTests = () => {
  return useQuery({
    queryKey: testQueryKeys.all,
    queryFn: () => getAllTests(),
  });
};



