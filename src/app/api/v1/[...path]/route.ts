import { NextRequest, NextResponse } from 'next/server';

// Runtime proxy: forward /api/v1/* to backend
// This reads BACKEND_INTERNAL_URL at runtime inside the Docker container
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  // Read backend URL at runtime from environment variable
  const BACKEND_URL =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:8080';

  const pathSegments = params.path || [];
  const backendPath = '/api/v1/' + pathSegments.join('/');

  // Preserve query string
  const searchParams = request.nextUrl.searchParams.toString();
  const backendUrl = `${BACKEND_URL}${backendPath}${searchParams ? `?${searchParams}` : ''}`;

  // Forward headers (exclude host which would confuse the backend)
  const forwardHeaders: HeadersInit = {};
  request.headers.forEach((value, key) => {
    if (!['host', 'connection'].includes(key.toLowerCase())) {
      forwardHeaders[key] = value;
    }
  });

  let body: BodyInit | null = null;
  const method = request.method;
  if (!['GET', 'HEAD'].includes(method)) {
    body = await request.arrayBuffer();
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method,
      headers: forwardHeaders,
      body: body ?? undefined,
      // @ts-expect-error - Node.js fetch supports duplex
      duplex: 'half',
    });

    // Forward the response back
    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await backendResponse.arrayBuffer();
    return new NextResponse(responseBody, {
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
