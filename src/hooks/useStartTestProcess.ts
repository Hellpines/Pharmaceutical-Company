import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testQueryKeys, TESTS_COLLECTION } from "./useTests";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { TestStatus } from "../types/test";

const startTestProcess = async (id: string): Promise<void> => {
    const docRef = doc(db, TESTS_COLLECTION, id);

    await updateDoc(docRef, {
        status: 'in-progress' as TestStatus,
        startedAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
    });
}

export const useStartTestProcess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (testId: string) => startTestProcess(testId),
        onSuccess: (_, testId) => {
            queryClient.invalidateQueries({ queryKey: testQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: testQueryKeys.detail(testId) });
        },
    });
};