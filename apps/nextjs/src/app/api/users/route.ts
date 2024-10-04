
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(req, res) {
  const data = await req.json()
  const apiEndpointUrl = new URL(`${API_URL}/api/users`);

  console.log('data', data)
  const response = await fetch(apiEndpointUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  });

  const created = await response.json();

  return Response.json(created)
}