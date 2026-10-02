import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testsService } from '../services/testsService';
import { type TestStatus } from '../types/test';

export const testQueryKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
};

export const useTests = () => {
  return useQuery({
    queryKey: testQueryKeys.all,
    queryFn: () => testsService.getAllTests(),
  });
};

export const useTest = (id: string) => {
  return useQuery({
    queryKey: testQueryKeys.detail(id),
    queryFn: () => testsService.getTestById(id),
    enabled: Boolean(id),
  });
};

export const useStartTestProcess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testId: string) => testsService.startTestProcess(testId),
    onSuccess: (_, testId) => {
      queryClient.invalidateQueries({ queryKey: testQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: testQueryKeys.detail(testId) });
    },
  });
};

export const useUpdateTestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TestStatus }) =>
      testsService.updateTestStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: testQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: testQueryKeys.detail(id) });
    },
  });
};