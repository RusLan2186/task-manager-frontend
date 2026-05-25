import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

type ErrorMessages = {
  badRequest?: string;
  unauthorized?: string;
  conflict?: string;
  unprocessable?: string;
  tooManyRequests?: string;
  forbidden?: string;
  server?: string;
  network?: string;
};

export type ApiErrorResult = {
  message: string;
  shouldLog: boolean;
  status?: number;
};

export function mapApiError(
  error: unknown,
  messages: ErrorMessages = {},
): ApiErrorResult {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    const backendMessage = responseData?.message;

    if (status === 400) {
      return {
        message:
          backendMessage ||
          messages.badRequest ||
          "Please check the entered data.",
        shouldLog: false,
        status,
      };
    }

    if (status === 401) {
      return {
        message: messages.unauthorized || "Invalid email or password.",
        shouldLog: false,
        status,
      };
    }

    if (status === 409) {
      return {
        message:
          backendMessage ||
          messages.conflict ||
          "This resource already exists.",
        shouldLog: false,
        status,
      };
    }

    if (status === 422) {
      return {
        message:
          backendMessage ||
          messages.unprocessable ||
          "Please check the entered data.",
        shouldLog: false,
        status,
      };
    }

    if (status === 429) {
      return {
        message:
          messages.tooManyRequests || "Too many attempts. Try again later.",
        shouldLog: false,
        status,
      };
    }

    if (status && status >= 500) {
      return {
        message: messages.server || "Server error. Please try again later.",
        shouldLog: true,
        status,
      };
    }

    if (status === 403) {
      return {
        message: messages.forbidden || "Access denied.",
        shouldLog: false,
        status,
      };
    }

    return {
      message:
        messages.network || "Network error. Please check your connection.",
      shouldLog: true,
      status,
    };
  }

  return {
    message: messages.network || "Network error. Please check your connection.",
    shouldLog: true,
  };
}

export default api;
