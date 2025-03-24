import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Example type for your data
export interface DataItem {
  id: string;
  title: string;
  description: string;
}

// Fetch data hook
export const useFetchData = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const response = await apiClient.get<DataItem[]>('/data');
      return response.data;
    },
  });
};

// Create data hook
export const useCreateData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newData: Omit<DataItem, 'id'>) => {
      const response = await apiClient.post<DataItem>('/data', newData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });
};

// Update data hook
export const useUpdateData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: DataItem) => {
      const response = await apiClient.put<DataItem>(`/data/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });
};

// Delete data hook
export const useDeleteData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/data/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });
}; 