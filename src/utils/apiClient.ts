export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

class ApiClient {
  private getBaseUrl(): string {
    if (typeof window !== "undefined") {
      // On client-side, we can just use relative URLs so they route automatically to Next.js
      return "";
    }
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
    }
    return "http://localhost:3000";
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("comfort_pg_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (err: any) {
      throw new Error(`Failed to establish connection to the server. (Details: ${err.message})`);
    }

    if (!response.ok) {
      let errorMsg = `Server returned status ${response.status}`;
      try {
        const payload = await response.json();
        if (payload && payload.message) {
          errorMsg = payload.message;
        }
      } catch (e) {
        if (response.status === 404) {
          errorMsg = "The requested API endpoint was not found (404).";
        } else if (response.status === 500) {
          errorMsg = "Internal Server Error (500). Please check server logs.";
        }
      }
      throw new Error(errorMsg);
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch (e) {
      throw new Error("Invalid response format received from server. Expected JSON.");
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data as T;
    }
    return payload as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }
}

export const apiClient = new ApiClient();
