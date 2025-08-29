import { CreateTask, TaskListSchema, UpdateTask } from 'busy-bee-schema';
import { PartialTask, Task } from './types';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { taskRouter } from '@server/src/trpc/trpc';

const API_URL = 'http://localhost:4001';
const client = createTRPCProxyClient<typeof taskRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
    }),
  ],
});

export const fetchTasks = async (showCompleted: boolean) => {
  return client.getTasks.query({ completed: showCompleted });
};

export const getTask = async (id: string): Promise<Task> => {
  const url = new URL(`/tasks/${id}`, API_URL);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return response.json();
};

export const createTask = async (task: CreateTask): Promise<void> => {
  return client.createTask.mutate(task);
};

export const updateTask = async (id: string, task: UpdateTask): Promise<void> => {
  return client.updateTask.mutate({ id: Number(id), task });
};

export const deleteTask = async (id: string): Promise<void> => {
  return client.deleteTask.mutate(Number(id));
};
