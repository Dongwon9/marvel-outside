import client from "./client";

export interface PostForm {
  title: string;
  content: string;
  boardId: string;
  authorId?: string;
}
export interface PostsQueryForm {
  boardId?: string;
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: { field: string; direction: "asc" | "desc" };
}
export interface PostResponse {
  authorAvatar: string | undefined;
  id: string;
  title: string;
  content: string;
  boardId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
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

export async function getPosts(
  query?: PostsQueryForm,
): Promise<PostResponse[]> {
  const response = await client.get<PostResponse[]>("/posts", {
    params: query,
  });
  return response.data;
}
