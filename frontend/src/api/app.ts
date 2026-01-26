import client from "./client";

export async function getHello(): Promise<string> {
  const response = await client.get<string>("/hello");
  return response.data;
}
