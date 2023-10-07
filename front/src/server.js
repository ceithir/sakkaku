const apiRoot = `/api`;

// Based on https://dmitripavlutin.com/timeout-fetch-request/
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 30 * 1000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

const requestOnServer = async ({
  uri,
  method,
  body,
  success,
  error,
  extraHeaders = {},
}) => {
  const defaultHeaders = {
    Accept: "application/json",
  };
  if (body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetchWithTimeout(`${apiRoot}${uri}`, {
      method,
      headers: { ...defaultHeaders, ...extraHeaders },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      // 419 is Laravel custom error code in case of a CSRF mismatch
      if (response.status === 401 || response.status === 419) {
        throw new Error("Authentication issue");
      }

      throw new Error(`Bad status: ${response.status}`);
    }

    if (response.status === 204) {
      return success();
    }

    const data = await response.json();
    success(data);
  } catch (e) {
    error ? error(e) : console.error(e);
  }
};

export const postOnServer = async ({ uri, body, success, error }) => {
  return requestOnServer({ uri, method: "POST", body, success, error });
};

export const getOnServer = async ({ uri, success, error }) => {
  return requestOnServer({ uri, method: "GET", success, error });
};

// Source: https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
const getXsrfToken = () =>
  decodeURIComponent(
    document.cookie.match("(^|;) ?XSRF-TOKEN=([^;]*)(;|$)")[2]
  );

export const authentifiedRequestOnServer = async ({
  uri,
  method,
  body,
  success,
  error,
}) => {
  return requestOnServer({
    uri,
    method,
    body,
    success,
    error,
    extraHeaders: {
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": getXsrfToken(),
    },
  });
};

export const authentifiedPostOnServer = async ({
  uri,
  body,
  success,
  error,
}) => {
  return authentifiedRequestOnServer({
    uri,
    method: "POST",
    body,
    success,
    error,
  });
};
