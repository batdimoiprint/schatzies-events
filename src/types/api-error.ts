/** Shape of an Axios-style error response used for surfacing API messages. */
export interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}
