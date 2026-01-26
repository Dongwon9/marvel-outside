import client from "./client";

export interface Board {
  id: string;
  name: string;
  description?: string;
}

export async function getBoards(): Promise<Board[]> {
  const response = await client.get<Board[]>("/boards");
  return response.data;
}

export async function getBoardById(id: string): Promise<Board> {
  const response = await client.get<Board>(`/boards/${id}`);
  return response.data;
}
