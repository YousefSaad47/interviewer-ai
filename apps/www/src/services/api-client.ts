export class ApiClientError<TData = unknown> extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: TData,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type ApiClientOptions = RequestInit & {
  json?: unknown;
};

const isWrappedResponse = (
  data: unknown,
): data is { message: string; data: unknown } => {
  return (
    data !== null &&
    typeof data === "object" &&
    "message" in data &&
    "data" in data
  );
};

const parseResponse = async (response: Response) => {
  if ([204, 205].includes(response.status)) return undefined;

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return response.text();
  }

  return response.json();
};

export async function apiClient<TResponse>(
  path: string,
  { json, headers, body, ...init }: ApiClientOptions = {},
): Promise<TResponse> {
  const requestHeaders = new Headers(headers);
  if (json !== undefined && !(json instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const requestInit: RequestInit = {
    credentials: "include",
    ...init,
    headers: requestHeaders,
  };

  if (json !== undefined) {
    requestInit.body = json instanceof FormData ? json : JSON.stringify(json);
  } else if (body !== undefined) {
    requestInit.body = body;
  }

  const response = await fetch(path, requestInit);

  const responseData = await parseResponse(response);
  const data = isWrappedResponse(responseData)
    ? responseData.data
    : responseData;

  if (!response.ok) {
    const message =
      responseData !== null &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
        ? responseData.message
        : `Request failed (${response.status})`;

    throw new ApiClientError(message, response.status, responseData);
  }

  return data as TResponse;
}
