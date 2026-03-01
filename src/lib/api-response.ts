const JSON_HEADERS = { 'Content-Type': 'application/json' };

export function jsonOk<T>(data: T, status = 200): Response {
  return new Response(
    JSON.stringify({ ok: true, data }),
    { status, headers: JSON_HEADERS },
  );
}

export function jsonError(error: string, status = 400): Response {
  return new Response(
    JSON.stringify({ ok: false, error }),
    { status, headers: JSON_HEADERS },
  );
}

export function jsonRaw(body: Record<string, unknown>, status = 200): Response {
  return new Response(
    JSON.stringify(body),
    { status, headers: JSON_HEADERS },
  );
}
