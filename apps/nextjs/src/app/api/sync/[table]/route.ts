export const revalidate = 0;
export const maxDuration = 300; // Increase to 5 minutes for long-polling

export async function GET(
  request: Request,
  { params }: { params: { table: string } }
) {
  try {
    const url = new URL(request.url);
    const { table } = params;

    const originUrl = new URL(`${process.env.ELECTRIC_SQL_BASE_URL}/v1/shape/${table}`);

    url.searchParams.forEach((value, key) => {
      if ([`shape_id`, `offset`, 'live'].includes(key)) {
        originUrl.searchParams.set(key, value)
      }
    });

    console.log('Fetching from:', originUrl.toString());

    let resp = await fetch(originUrl.toString(), {
      cache: 'no-store',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!resp.ok) {
      console.error('Error response:', resp.status, resp.statusText);
      return new Response(`Error: ${resp.status} ${resp.statusText}`, { status: resp.status });
    }
    
    // Check if the response is 204 No Content
    if (resp.status === 204) {
      return new Response(null, { status: 204 });
    }

    if (resp.headers.get(`content-encoding`)) {
      const headers = new Headers(resp.headers)
      headers.delete(`content-encoding`)
      headers.delete(`content-length`);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      resp = new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers,
      })
    }

    return resp
  
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
