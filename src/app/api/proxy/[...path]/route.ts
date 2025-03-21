import { type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>,
) {
  const { path } = await params;

  const backendUrl = process.env.TASKCARE_API_URL;
  const cleanPath = path?.join("/") || "";
  const targetUrl = new URL(`${backendUrl}/${cleanPath}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();

  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-length") {
      headers.append(key, value);
    }
  });

  const fetchOptions = {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    duplex: "half",
  };

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const headers = new Headers(response.headers);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy-Error:", error);

    return new Response(
      JSON.stringify({
        error: "BffProxyError",
        status: 500,
        timestamp: new Date().toISOString(),
        path: targetUrl.pathname,
        details: [],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
