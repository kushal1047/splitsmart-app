// Convert API errors to user-friendly messages
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data;

    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return (
          message || "A conflict occurred. This resource may already exist."
        );
      case 500:
        return "Server error. Please try again later.";
      default:
        return message || "An unexpected error occurred.";
    }
  } else if (error.request) {
    // Request was made but no response received
    return "Network error. Please check your internet connection.";
  } else {
    // Something else went wrong
    return error.message || "An unexpected error occurred.";
  }
};

// Log errors in development mode only
export const logError = (context, error) => {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }
};

// Get user-friendly error message and log the error
export const showErrorAlert = (error, context = "Error") => {
  const errorMessage = handleApiError(error);
  logError(context, error);
  return errorMessage;
};
