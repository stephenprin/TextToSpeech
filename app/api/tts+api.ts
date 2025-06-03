import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient();
export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return new Response("Text is required", { status: 400 });
  }

  //Use ai model tools convert to audio
  try {
    const audio = await elevenlabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        text: text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );

    const chunks = [];

    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Error converting text to speech", { status: 500 });
  }
}
