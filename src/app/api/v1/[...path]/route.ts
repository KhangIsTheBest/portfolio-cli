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

  // Determine backend path (support static /uploads/ and /api/v1/* routes)
  const isUploadPath = pathSegments[0] === 'uploads' || pathSegments[0] === 'files';
  const primaryBackendPath = isUploadPath ? '/' + pathSegments.join('/') : '/api/v1/' + pathSegments.join('/');
  const fallbackBackendPath = isUploadPath ? '/api/v1/' + pathSegments.join('/') : '/' + pathSegments.join('/');

  const searchParams = request.nextUrl.searchParams.toString();
  const primaryBackendUrl = `${BACKEND_URL}${primaryBackendPath}${searchParams ? `?${searchParams}` : ''}`;
  const fallbackBackendUrl = `${BACKEND_URL}${fallbackBackendPath}${searchParams ? `?${searchParams}` : ''}`;

  const method = request.method;
  const contentType = request.headers.get('content-type') || '';

  // Build forwarded headers (exclude hop-by-hop headers)
  const forwardHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!['host', 'connection', 'keep-alive', 'transfer-encoding'].includes(lower)) {
      forwardHeaders[key] = value;
    }
  });

  // Read body as raw bytes to preserve multipart boundaries
  let body: ArrayBuffer | string | null = null;
  if (!['GET', 'HEAD'].includes(method)) {
    if (contentType.includes('multipart/form-data')) {
      body = await request.arrayBuffer();
    } else {
      body = await request.text();
    }
  }

  try {
    let backendResponse = await fetch(primaryBackendUrl, {
      method,
      headers: forwardHeaders,
      // @ts-ignore - Node.js supports ArrayBuffer as body
      body: body,
    });

    // If 404 on upload path, try fallback path
    if (backendResponse.status === 404 && isUploadPath) {
      backendResponse = await fetch(fallbackBackendUrl, {
        method,
        headers: forwardHeaders,
        // @ts-ignore
        body: body,
      });
    }

    const responseText = await backendResponse.text();

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(lower)) {
        responseHeaders.set(key, value);
      }
    });
    if (!responseHeaders.has('content-type')) {
      responseHeaders.set('content-type', 'application/json');
    }

    return new NextResponse(responseText, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Proxy Error] ${method} ${primaryBackendUrl}:`, error.message);
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
