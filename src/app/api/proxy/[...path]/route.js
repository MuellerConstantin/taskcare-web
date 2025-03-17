export async function GET(req, { params }) {
  return proxyRequest(req, params);
}

export async function POST(req, { params }) {
  return proxyRequest(req, params);
}

export async function PUT(req, { params }) {
  return proxyRequest(req, params);
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, params);
}

export async function PATCH(req, { params }) {
  return proxyRequest(req, params);
}

export async function HEAD(req, { params }) {
  return proxyRequest(req, params);
}

async function proxyRequest(req, params) {
  const { path } = await params;

  const backendUrl = process.env.TASKCARE_API_URL;
  const cleanPath = path?.join("/") || "";
  const targetUrl = new URL(`${backendUrl}/${cleanPath}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const fetchOptions = {
    method: req.method,
    headers: new Headers(req.headers),
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    fetchOptions.body = await req.text();
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const headers = new Headers(response.headers);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy-Error:", error);

    return new Response(JSON.stringify({
      error: "BffProxyError",
      status: 500,
      timestamp: new Date().toISOString(),
      path: targetUrl.pathname,
      details: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
