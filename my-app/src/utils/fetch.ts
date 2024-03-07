import { Params } from "../type";

export const buildQuery = (data: Params) => {
  return Object.entries(data)
    .map(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return "";
      }
      return `${key}=${value}`;
    })
    .filter(Boolean)
    .join("&");
};

export const buildUrl = (url: string, params: Params) => {
  const query = buildQuery(params);
  if (query) {
    return `${url}?${query}`;
  }
  return url;
};

export const commonFetch = async <T = unknown>(
  url: string,
  params: Params
): Promise<T> => {
  const requestUrl = buildUrl(url, params);
  const result = await fetch(requestUrl);
  return await result.json();
};
