import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TestStatus } from "../types/test";
import { testQueryKeys, TESTS_COLLECTION } from "./useTests";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const updateTestStatus = async (id: string, status: TestStatus): Promise<void> => {
    const docRef = doc(db, TESTS_COLLECTION, id);
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

export const useUpdateTestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TestStatus }) =>
      updateTestStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: testQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: testQueryKeys.detail(id) });
    },
  });
};