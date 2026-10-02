import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { type TestRecord, type TestStatus } from '../types/test';

const COLLECTION_NAME = 'tests';

export const testsService = {
  async getAllTests(): Promise<TestRecord[]> {
    const testsRef = collection(db, COLLECTION_NAME);
    const q = query(testsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as TestRecord[];
  },

  async getTestById(id: string): Promise<TestRecord | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as TestRecord;
  },

  async startTestProcess(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(docRef, {
      status: 'in-progress' as TestStatus,
      startedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateTestStatus(id: string, status: TestStatus): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }
};