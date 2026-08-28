import { ref, readonly } from "vue";

const MAX_NOTIFICATIONS = 5;
const notifications = ref([]);
let notificationId = 0;

export function useNotification() {
  const showNotification = (config) => {
    //  Rate limiting - prevent spam
    if (notifications.value.length >= MAX_NOTIFICATIONS) {
      console.warn("Maximum notifications reached, removing oldest");
      notifications.value.shift();
    }

    //  Reset ID counter to prevent overflow
    if (notificationId > 10000) {
      notificationId = 0;
    }

    const id = ++notificationId;
    const notification = {
      id,
      show: true,
      type: config.type || "info",
      title: config.title || "Notification",
      message: config.message || "",
      details: Array.isArray(config.details) ? config.details : [],
      duration: config.duration || 0,
      showCountdown: config.showCountdown !== false,
    };

    notifications.value.push(notification);

    // Auto-remove after duration
    const duration =
      notification.duration || getDefaultDuration(notification.type);
    setTimeout(() => {
      removeNotification(id);
    }, duration + 500);

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
  };

  const getDefaultDuration = (type) => {
    return (
      {
        success: 4000,
        info: 5000,
        warning: 6000,
        error: 8000,
      }[type] || 5000
    );
  };

  /**
   * ✅ Production-ready error parser with validation
   */
  const parseBackendError = (error) => {
    const errorData = {
      type: "error",
      title: "Operation Failed",
      message: "An unexpected error occurred",
      details: [],
    };

    // ✅ Handle network errors
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        errorData.title = "Request Timeout";
        errorData.message = "The request took too long. Please try again.";
      } else if (error.code === "ERR_NETWORK") {
        errorData.title = "Network Error";
        errorData.message =
          "Unable to connect to the server. Please check your internet connection.";
      } else {
        errorData.title = "Connection Error";
        errorData.message = "Unable to reach the server. Please try again.";
      }
      return errorData;
    }

    const { status, data } = error.response;

    // ✅ Standardized response handling
    switch (status) {
      case 400:
        errorData.title = "Invalid Request";
        errorData.message =
          extractMessage(data) || "The request contains invalid data";
        if (data.errors) {
          errorData.details = parseValidationDetails(data.errors);
        }
        break;

      case 401:
        errorData.type = "warning";
        errorData.title = "Unauthorized";
        errorData.message =
          extractMessage(data) ||
          "Your session has expired. Please log in again.";
        // ✅ Optionally trigger logout
        // router.push('/login')
        break;

      case 403:
        errorData.type = "warning";
        errorData.title = "Access Denied";
        errorData.message =
          extractMessage(data) ||
          "You do not have permission to perform this action";
        break;

      case 404:
        errorData.title = "Not Found";
        errorData.message =
          extractMessage(data) || "The requested resource was not found";
        break;

      case 409:
        errorData.type = "warning";
        errorData.title = "Conflict Detected";
        errorData.message =
          extractMessage(data) || "This action conflicts with existing data";
        if (data.errors) {
          errorData.details = parseValidationDetails(data.errors);
        }
        break;

      case 422:
        errorData.title = "Validation Error";

        if (data.errors && Object.keys(data.errors).length > 0) {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMessage = Array.isArray(data.errors[firstErrorKey])
            ? data.errors[firstErrorKey][0]
            : data.errors[firstErrorKey];

          errorData.message = firstErrorMessage;

          // Add remaining errors to details
          const allErrors = Object.entries(data.errors)
            .flatMap(([errors]) => {
              const errorArray = Array.isArray(errors) ? errors : [errors];
              return errorArray.map((err) =>
                typeof err === "string" ? err : String(err),
              );
            })
            .filter((err, index) => index > 0); // Skip first error

          errorData.details = allErrors;
        } else {
          errorData.message =
            extractMessage(data) || "Please check the form and try again";
        }
        break;

      case 429:
        errorData.type = "warning";
        errorData.title = "Too Many Requests";
        errorData.message =
          "You are making requests too quickly. Please wait and try again.";

        if (error.response.headers["retry-after"]) {
          const retryAfter = error.response.headers["retry-after"];
          errorData.details.push(
            `Please wait ${retryAfter} seconds before trying again`,
          );
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorData.title = "Server Error";
        errorData.message =
          extractMessage(data) ||
          "Something went wrong on the server. Please try again later.";

        // ✅ Never expose internal errors in production
        if (import.meta.env.DEV && data.error) {
          errorData.details.push(`Debug: ${data.error}`);
        }
        break;

      default:
        errorData.title = `Error ${status}`;
        errorData.message =
          extractMessage(data) ||
          "An error occurred while processing your request";
    }

    return errorData;
  };

  /**
   * Extract message from response data
   */
  const extractMessage = (data) => {
    if (typeof data === "string") {
      return sanitizeMessage(data);
    }

    if (typeof data === "object" && data !== null) {
      const message =
        data.message ||
        data.error ||
        data.msg ||
        data.description ||
        data.detail;
      return message ? sanitizeMessage(String(message)) : null;
    }

    return null;
  };

  /**
   * ✅ Sanitize messages to prevent XSS
   */
  const sanitizeMessage = (message) => {
    if (typeof message !== "string") return "";

    // Basic XSS prevention - strip HTML tags
    return message.replace(/<[^>]*>/g, "").trim();
  };

  /**
   * Parse validation errors safely
   */
  const parseValidationDetails = (details) => {
    const messages = [];

    if (!details) return messages;

    if (typeof details === "string") {
      messages.push(sanitizeMessage(details));
      return messages;
    }

    if (Array.isArray(details)) {
      details.forEach((detail) => {
        if (typeof detail === "string") {
          messages.push(sanitizeMessage(detail));
        }
      });
      return messages;
    }

    if (typeof details === "object") {
      Object.entries(details).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          errors.forEach((error) => {
            if (typeof error === "string") {
              const sanitized = sanitizeMessage(error);
              messages.push(
                sanitized.toLowerCase().includes(field.toLowerCase())
                  ? sanitized
                  : `${formatFieldName(field)}: ${sanitized}`,
              );
            }
          });
        } else if (typeof errors === "string") {
          const sanitized = sanitizeMessage(errors);
          messages.push(
            sanitized.toLowerCase().includes(field.toLowerCase())
              ? sanitized
              : `${formatFieldName(field)}: ${sanitized}`,
          );
        }
      });
    }

    return messages;
  };

  /**
   * Format field names for display
   */
  const formatFieldName = (field) => {
    return String(field)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Convenience methods
  const success = (title, message, options = {}) => {
    return showNotification({
      type: "success",
      title: sanitizeMessage(title),
      message: sanitizeMessage(message),
      ...options,
    });
  };

  const error = (title, message, options = {}) => {
    return showNotification({
      type: "error",
      title: sanitizeMessage(title),
      message: sanitizeMessage(message),
      ...options,
    });
  };

  const warning = (title, message, options = {}) => {
    return showNotification({
      type: "warning",
      title: sanitizeMessage(title),
      message: sanitizeMessage(message),
      ...options,
    });
  };

  const info = (title, message, options = {}) => {
    return showNotification({
      type: "info",
      title: sanitizeMessage(title),
      message: sanitizeMessage(message),
      ...options,
    });
  };

  /**
   * Handle backend errors with smart parsing
   */
  const handleBackendError = (err, customOptions = {}) => {
    const errorData = parseBackendError(err);
    return showNotification({
      ...errorData,
      ...customOptions,
      title: customOptions.title || errorData.title,
      message: customOptions.message || errorData.message,
    });
  };

  return {
    notifications: readonly(notifications), // ✅ Prevent external mutations
    showNotification,
    removeNotification,
    clearAll,
    parseBackendError,
    success,
    error,
    warning,
    info,
    handleBackendError,
  };
}
