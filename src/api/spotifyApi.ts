import axios from "axios";

export async function spotifyGet<T>(url: string, token: string): Promise<T> {
  const response = await axios.get<T>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function spotifyPost<T>(
  url: string,
  token: string,
  data: any
): Promise<T> {
  const response = await axios.post<T>(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
