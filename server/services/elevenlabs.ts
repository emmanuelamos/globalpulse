import axios from "axios";

export async function generateSpeech(text: string, voiceId: string) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
  
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, // Dynamic voiceId
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        data: {
          text: text,
          model_id: 'eleven_turbo_v2_5', // Use Turbo for faster "radio" response times
          voice_settings: { stability: 0.4, similarity_boost: 0.8 },
        },
        responseType: 'arraybuffer',
      });
  
      const base64Audio = Buffer.from(response.data).toString('base64');
      return { audioData: `data:audio/mpeg;base64,${base64Audio}` };
    } catch (error: any) {
        // Add this line to see the real culprit in your terminal:
        if (error.response) {
           const decoder = new TextDecoder();
           const errorMsg = decoder.decode(error.response.data);
           console.error("ElevenLabs API Error:", errorMsg);
        } else {
           console.error("Connection Error:", error.message);
        }
        throw new Error("Speech generation failed.");
      }
  }