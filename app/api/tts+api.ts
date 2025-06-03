export async function POST(request: Request) {
  const { text } = await request.json();
  
  if (!text) {
    return new Response('Text is required', { status: 400 });
  }

  //Use ai model tools convert to audio
  return Response.json({ hello: "world" });
}
