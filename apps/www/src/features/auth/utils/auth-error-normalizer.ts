export interface NormalizedError {
  title: string;
  description: string;
  type: "error" | "warning" | "info";
}

/**
 * Normalizes any authentication error (Better Auth response, standard Error, network error)
 * into a user-friendly title and description for toast messages.
 */
export function normalizeAuthError(error: unknown): NormalizedError {
  const defaultError: NormalizedError = {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    type: "error",
  };

  if (!error) return defaultError;

  // Extract message and potential status/code
  let message = "";
  let status: number | undefined;

  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object") {
    const errObj = error as Record<string, unknown>;

    // Better Auth errors typically have .message or .status
    if (typeof errObj.message === "string") {
      message = errObj.message;
    }
    if (typeof errObj.status === "number") {
      status = errObj.status;
    } else if (typeof errObj.status === "string") {
      status = Number.parseInt(errObj.status, 10) || undefined;
    }

    // If it has code property
    if (typeof errObj.code === "string" && !message) {
      message = errObj.code;
    }
  }

  const lowerMsg = message.toLowerCase();

  // 1. Connection / Network errors
  if (
    lowerMsg.includes("network") ||
    lowerMsg.includes("fetch failed") ||
    lowerMsg.includes("failed to fetch") ||
    lowerMsg.includes("load failed") ||
    lowerMsg.includes("cors")
  ) {
    return {
      title: "Connection problem",
      description: "Please check your internet connection and try again.",
      type: "error",
    };
  }

  // 2. Rate limiting
  if (
    lowerMsg.includes("too many requests") ||
    lowerMsg.includes("rate limit") ||
    lowerMsg.includes("too_many_requests") ||
    status === 429
  ) {
    return {
      title: "Too many attempts",
      description:
        "You've tried too many times. Please wait a moment before trying again.",
      type: "warning",
    };
  }

  // 3. Invalid credentials
  if (
    lowerMsg.includes("invalid email or password") ||
    lowerMsg.includes("invalid_email_or_password") ||
    lowerMsg.includes("invalid_credentials") ||
    lowerMsg.includes("incorrect password")
  ) {
    return {
      title: "Couldn't sign you in",
      description: "The email or password you entered is incorrect.",
      type: "error",
    };
  }

  // 4. Email already in use
  if (
    lowerMsg.includes("email already in use") ||
    lowerMsg.includes("email_already_in_use") ||
    lowerMsg.includes("user already exists")
  ) {
    return {
      title: "Email already registered",
      description:
        "An account with this email already exists. Try signing in instead.",
      type: "warning",
    };
  }

  // 5. Account disabled
  if (
    lowerMsg.includes("disabled") ||
    lowerMsg.includes("account_disabled") ||
    lowerMsg.includes("user_disabled")
  ) {
    return {
      title: "Account disabled",
      description:
        "This account is currently disabled. Please contact support.",
      type: "error",
    };
  }

  // 6. Verification required
  if (
    lowerMsg.includes("verify") ||
    lowerMsg.includes("email_not_verified") ||
    lowerMsg.includes("verification")
  ) {
    return {
      title: "Verification required",
      description: "Please verify your email address before signing in.",
      type: "warning",
    };
  }

  // 7. Social auth cancelled or blocked
  if (
    lowerMsg.includes("popup_closed_by_user") ||
    lowerMsg.includes("cancelled") ||
    lowerMsg.includes("canceled") ||
    lowerMsg.includes("user_cancelled")
  ) {
    return {
      title: "Sign-in cancelled",
      description: "The login process was cancelled. Please try again.",
      type: "info",
    };
  }

  if (
    lowerMsg.includes("popup_blocked") ||
    lowerMsg.includes("popup blocked")
  ) {
    return {
      title: "Popup blocked",
      description:
        "Your browser blocked the login popup. Please allow popups for this site.",
      type: "warning",
    };
  }

  // 8. General fallbacks based on status codes
  if (status === 401) {
    return {
      title: "Unauthorized",
      description:
        "Invalid credentials or session expired. Please sign in again.",
      type: "error",
    };
  }

  if (status === 403) {
    return {
      title: "Access denied",
      description: "You do not have permission to access this resource.",
      type: "error",
    };
  }

  if (status && status >= 500) {
    return {
      title: "Server unavailable",
      description:
        "We're having trouble reaching our servers. Please try again later.",
      type: "error",
    };
  }

  // Use the original message if it's readable and not a technical stack trace
  if (
    message &&
    message.length < 100 &&
    !message.includes("Error:") &&
    !message.includes("at ")
  ) {
    return {
      title: "Authentication Error",
      description: message,
      type: "error",
    };
  }

  return defaultError;
}
