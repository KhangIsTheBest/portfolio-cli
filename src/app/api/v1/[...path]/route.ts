import { NextRequest, NextResponse } from 'next/server';

// Runtime proxy: forward /api/v1/* to backend
// Reads BACKEND_INTERNAL_URL at runtime — NOT build time
const getBackendUrl = () =>
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8080';

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
): Promise<NextResponse> {
  const BACKEND_URL = getBackendUrl();
  const pathSegments = params.path || [];
  const backendPath = '/api/v1/' + pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const backendUrl = `${BACKEND_URL}${backendPath}${searchParams ? `?${searchParams}` : ''}`;

  // Build forwarded headers
  const forwardHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!['host', 'connection', 'keep-alive', 'transfer-encoding'].includes(lower)) {
      forwardHeaders[key] = value;
    }
  });

  const method = request.method;
  let body: string | undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    body = await request.text();
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method,
      headers: forwardHeaders,
      body: body ?? null,
    });

    // Read response body as text (avoids streaming issues)
    const responseText = await backendResponse.text();

    // Forward safe headers
    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(lower)) {
        responseHeaders.set(key, value);
      }
    });
    // Ensure content-type is set
    if (!responseHeaders.has('content-type')) {
      responseHeaders.set('content-type', 'application/json');
    }

    return new NextResponse(responseText, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Proxy Error] ${method} ${backendUrl}:`, error.message);
    return NextResponse.json(
      { success: false, message: `Backend unreachable: ${error.message}` },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
