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

  // Serialize query params
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

  const data =
    [204, 205, 304].includes(response.status) || !response.body
      ? {}
      : await response.json();

  return {
    data: data as never,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

export default fetchClient;