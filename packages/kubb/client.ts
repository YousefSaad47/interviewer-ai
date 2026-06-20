import type {
  Client,
  RequestConfig,
  ResponseConfig,
  ResponseErrorConfig,
} from "@kubb/plugin-client/clients/fetch";

export type {
  Client,
  RequestConfig,
  ResponseConfig,
  ResponseErrorConfig,
};

const fetchClient: Client = async (config) => {
  const base = [config.baseURL, config.url].filter(Boolean).join("");

  let url = base;
  if (config.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    ...(config.method ? { method: config.method.toUpperCase() } : {}),
    body: config.data instanceof FormData ? config.data : JSON.stringify(config.data),
    signal: config.signal,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(Array.isArray(config.headers)
        ? Object.fromEntries(config.headers)
        : config.headers),
    },
  } as RequestInit);

  const isNoContent = [204, 205].includes(response.status);

  const responseData = isNoContent ? {} : await response.json();

  const isWrapped =
    responseData !== null &&
    typeof responseData === "object" &&
    "message" in responseData &&
    "data" in responseData;

  const finalData = isWrapped ? responseData.data : responseData;

  if (!response.ok) {
    const error: ResponseErrorConfig = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    } as ResponseErrorConfig;
    throw error;
  }

  return {
    data: finalData as never,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

export default fetchClient;
