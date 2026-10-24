import * as SecureStore from "expo-secure-store";

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const TOKEN_KEY = "habit_tracker_auth_token";

export type ApiErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

type ApiRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  authenticated?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    authenticated = true,
    headers: customHeaders = {},
    ...requestOptions
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (requestOptions.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    const token = await getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }


  let response: Response;
  const url = `${API_BASE_URL}${path}`;
  const method = requestOptions.method || "GET";

  console.log(`[API] Request: ${method} ${url}`);

  try {
    response = await fetch(url, {
      ...requestOptions,
      headers,
    });

    console.log(
      `[API] Response: ${method} ${path} -> ${response.status}`
    );
  } catch (error) {
    console.error(`[API] Network error: ${method} ${url}`, error);

    throw new ApiError(
      `Cannot connect to the server at ${API_BASE_URL}. Check the API URL and network connection.`,
      0
    );
  }


  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(
    () => ({} as ApiErrorResponse)
  );


  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    console.error(`[API] Request failed: ${method} ${path}`, {
      status: response.status,
      message: errorData.message || "Unknown server error",
    });

    throw new ApiError(
      errorData.message || `Request failed (${response.status}).`,
      response.status
    );
  }

  console.log(`[API] Success: ${method} ${path}`);

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    console.error(`[API] Request failed: ${method} ${path}`, {
      status: response.status,
      message: errorData.message || "Unknown server error",
    });

    throw new ApiError(
      errorData.message || `Request failed (${response.status}).`,
      response.status
    );
  }

  console.log(`[API] Success: ${method} ${path}`);


  return data as T;
}