import * as SecureStore from "expo-secure-store";

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const TOKEN_KEY = "habit_tracker_auth_token";

type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null
): void {
  unauthorizedHandler = handler;
}

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

  const url = `${API_BASE_URL}${path}`;
  const method = requestOptions.method || "GET";

  console.log(`[API] Request: ${method} ${url}`);

  let response: Response;

  try {
    response = await fetch(url, {
      ...requestOptions,
      headers,
    });
  } catch (error) {
    console.error(`[API] Network error: ${method} ${path}`, error);

    throw new ApiError(
      "Unable to connect to the server. Please check your connection and try again.",
      0
    );
  }

  console.log(
    `[API] Response: ${method} ${path} -> ${response.status}`
  );

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError("The request could not be completed.", response.status);
    }

    return undefined as T;
  }

  let data: unknown = {};

  try {
    const responseText = await response.text();

    if (responseText.trim()) {
      data = JSON.parse(responseText);
    }
  } catch {
    // The response may be empty or may not contain valid JSON.
    data = {};
  }

  if (!response.ok) {
    // Only authenticated requests can invalidate the current session.
    if (response.status === 401 && authenticated && unauthorizedHandler) {
      try {
        await unauthorizedHandler();
      } catch (error) {
        console.error("Automatic logout failed:", error);
      }
    }

    const errorData =
      data && typeof data === "object"
        ? (data as ApiErrorResponse)
        : {};

    const message =
      response.status >= 500
        ? "Something went wrong on the server. Please try again later."
        : errorData.message ||
          (response.status === 401
            ? "Your session may have expired. Please sign in again."
            : response.status === 403
              ? "You don't have permission to perform this action."
              : response.status === 404
                ? "The requested item could not be found."
                : `Request failed (${response.status}).`);

    console.error(`[API] Request failed: ${method} ${path}`, {
      status: response.status,
      message: errorData.message || message,
    });

    throw new ApiError(message, response.status);
  }

  if (data === null || typeof data !== "object") {
    throw new ApiError(
      "The server returned an invalid response. Please try again.",
      response.status
    );
  }

  console.log(`[API] Success: ${method} ${path}`);

  return data as T;
}