import client from "./client";

export interface PostForm {
  title: string;
  content: string;
  boardId: string;
  contentFormat: "markdown" | "plaintext";
  authorId?: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  boardId: string;
  contentFormat: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getPostById(id: string): Promise<PostResponse> {
  const response = await client.get<PostResponse>(`/posts/${id}`);
  return response.data;
}

export async function createPost(data: PostForm): Promise<PostResponse> {
  const response = await client.post<PostResponse>("/posts", data);
  return response.data;
}

export async function updatePost(
  id: string,
  data: PostForm,
): Promise<PostResponse> {
  const response = await client.patch<PostResponse>(`/posts/${id}`, data);
  return response.data;
}

export async function getPosts(): Promise<PostResponse[]> {
  const response = await client.get<PostResponse[]>("/posts");
  return response.data;
}
