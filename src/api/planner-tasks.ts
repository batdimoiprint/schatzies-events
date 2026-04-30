import axios from 'axios';
import axiosInstance from './axios-instance';

export interface BoardTask {
  id: string;
  title: string;
  description: string;
  status?: string;
  order?: number;
  [key: string]: unknown;
}

export interface TasksResponse {
  tasks: Record<string, BoardTask[]>;
}

export interface BoardTaskPayload {
  title: string;
  description: string;
  checklist?: Array<{
    id: string;
    label: string;
    done: boolean;
    doneAt?: string;
  }>;
}

export interface MoveBoardTaskPayload {
  newStatus: string;
  newOrder: number;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return responseMessage || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

async function requestData<T>(action: string, request: () => Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error, `Failed to ${action} board tasks.`);
    console.error(`Planner tasks API error (${action}):`, error);
    throw new Error(message);
  }
}

export async function getBoardTasks(eventId: string): Promise<TasksResponse> {
  return requestData('fetch', async () => axiosInstance.get(`/events/${eventId}/tasks`));
}

export async function createBoardTask(eventId: string, data: BoardTaskPayload): Promise<BoardTask> {
  return requestData('create', async () => axiosInstance.post(`/events/${eventId}/tasks`, data));
}

export async function updateBoardTask(
  eventId: string,
  taskId: string,
  data: BoardTaskPayload
): Promise<BoardTask> {
  return requestData('update', async () =>
    axiosInstance.put(`/events/${eventId}/tasks/${taskId}`, data)
  );
}

export async function deleteBoardTask(eventId: string, taskId: string): Promise<void> {
  await requestData('delete', async () =>
    axiosInstance.delete(`/events/${eventId}/tasks/${taskId}`)
  );
}

export async function moveBoardTask(
  eventId: string,
  taskId: string,
  data: MoveBoardTaskPayload
): Promise<BoardTask> {
  return requestData('move', async () =>
    axiosInstance.put(`/events/${eventId}/tasks/${taskId}/move`, data)
  );
}
