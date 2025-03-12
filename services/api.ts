const API_URL = "http://localhost:8000/api";

export const api = {
  workspaces: {
    list: () => fetch(`${API_URL}/dev-workspaces`),
    create: (data: any) =>
      fetch(`${API_URL}/dev-workspaces`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: (id: number) => fetch(`${API_URL}/dev-workspaces/${id}`),
    update: (id: number, data: any) =>
      fetch(`${API_URL}/dev-workspaces/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetch(`${API_URL}/dev-workspaces/${id}`, {
        method: "DELETE",
      }),
  },
  snippets: {
    list: () => fetch(`${API_URL}/code-snippets`),
    create: (data: any) =>
      fetch(`${API_URL}/code-snippets`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  documentation: {
    list: () => fetch(`${API_URL}/dev-documentation`),
    create: (data: any) =>
      fetch(`${API_URL}/dev-documentation`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  mindmaps: {
    list: () => fetch(`${API_URL}/dev-mindmaps`),
    create: (data: any) =>
      fetch(`${API_URL}/dev-mindmaps`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  issues: {
    list: () => fetch(`${API_URL}/dev-issues`),
    create: (data: any) =>
      fetch(`${API_URL}/dev-issues`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  reviews: {
    list: () => fetch(`${API_URL}/code-reviews`),
    create: (data: any) =>
      fetch(`${API_URL}/code-reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});
