interface Options {
  body?: any;
  method?: string;
  contentType?: "application/json" | "multipart/form-data";
  withAuth?: boolean;
}

export default function fetcher(
  url: RequestInfo | URL,
  options?: Options
): Promise<Response> {
  const headers = new Headers();

  if (!(options?.body instanceof FormData)) {
    headers.set("content-type", options?.contentType || "application/json");
  }

  if (options?.withAuth !== false) {
    headers.set("authorization", `Bearer ${localStorage.login}`);
  }

  let body: BodyInit;

  if (options?.body && headers.get("content-type") === "application/json") {
    body = JSON.stringify(options.body);
  } else {
    body = options?.body || undefined;
  }

  return fetch(url, {
    body,
    method: options?.method || "GET",
    headers: headers,
  });
}
