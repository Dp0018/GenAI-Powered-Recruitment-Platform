import { ApiResponse, ErrorResponse } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  fieldErrors?: { field: string; message: string }[];

  constructor(error: ErrorResponse) {
    super(error.message || "An unexpected error occurred");
    this.name = "ApiError";
    this.statusCode = error.statusCode;
    this.errorCode = error.errorCode;
    this.fieldErrors = error.errors?.map((e) => ({
      field: e.field,
      message: e.message,
    }));
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers, ...customConfig } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("job_portal_access_token") : null;
  const authToken = token || storedToken;

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        success: false,
        statusCode: response.status,
        errorCode: "SERVER_ERROR",
        message: response.statusText || "Server communication failed",
        path: endpoint,
        timestamp: new Date().toISOString(),
      };
    }
    throw new ApiError(errorData);
  }

  return response.json();
}
