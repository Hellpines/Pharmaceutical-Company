import { useQuery } from "@tanstack/react-query";
import { testQueryKeys, TESTS_COLLECTION } from "./useTests";
import type { TestRecord } from "../types/test";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const getTestById = async (id: string): Promise<TestRecord | null> => {
    const docRef = doc(db, TESTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as TestRecord;
}

export const useTest = (id: string) => {
    return useQuery({
        queryKey: testQueryKeys.detail(id),
        queryFn: () => getTestById(id),
        enabled: Boolean(id),
    });
};