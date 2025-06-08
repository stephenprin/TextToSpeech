import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Buffer } from "buffer";

const elevenlabs = new ElevenLabsClient();

export async function POST(request: Request) {
  const { base64Audio } = await request.json();
  if (!base64Audio) {
    return new Response("Base64 audio is required", { status: 400 });
  }
  try {
    //convert   base 64 to Blob
    const buffer = Buffer.from(base64Audio, "base64");
    const audioBlob = new Blob([buffer], { type: "audio/mpeg" });

    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
      tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
      languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });

    return Response.json({ transcription });
  } catch (error) {
    console.error("Error in speech-to-text conversion:", error);
    return new Response("Error processing audio file", { status: 500 });
  }
}
