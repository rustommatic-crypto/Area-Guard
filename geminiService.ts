
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BackgroundCheck, Vehicle, LandmarkResult, RecoveryPlan, PoliceStation } from "./types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * MUSTI PERSONALITY SPECS:
 * - Voice: Calm, deep, smooth, authoritative, and smooth (Sexy military tone).
 * - Intelligence: Global fusion of FBI, CIA, MOSSAD, KGB, and Nigerian Command.
 */
export const generateMustiSpeech = async (text: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ 
      parts: [{ 
        text: `You are Mustapha (Musti), a world-class security elite with elite military training. 
        Your voice is calm, deep, smooth, authoritative, and sophisticated. 
        You possess the combined expertise of the FBI, CIA, MOSSAD, KGB, and the Nigerian Police Force.
        Say this precisely as Musti, ending with tactical closure like 'Over.' or 'Sentinel out.': ${text}` 
      }] 
    }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
};

export const searchPoliceStationsOnMap = async (query: string, lat?: number, lng?: number): Promise<PoliceStation[]> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `List real police stations in ${query}. Provide their full address, name, phone number, and coordinates (lat, lng).`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: { 
        retrievalConfig: { 
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined 
        } 
      },
    }
  });

  const parserResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the police stations from this text into a JSON array: ${response.text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            phone: { type: Type.STRING },
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER }
          },
          required: ["name", "address", "lat", "lng"]
        }
      }
    }
  });

  try {
    return JSON.parse(parserResponse.text || "[]");
  } catch (e) {
    return [];
  }
};

export const runDeepPersonnelScan = async (name: string, nin: string): Promise<BackgroundCheck> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep risk analysis for personnel: ${name} (NIN: ${nin}). Use your global security training.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ninStatus: { type: Type.STRING },
          loanDefaulter: { type: Type.BOOLEAN },
          registryHits: { type: Type.NUMBER },
          socialMediaScore: { type: Type.NUMBER },
          simAgeDays: { type: Type.NUMBER },
          riskAssessment: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeLandmark = async (imageB64: string): Promise<LandmarkResult> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: "Identify landmarks using visual intelligence. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identified: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          locationCertainty: { type: Type.NUMBER },
          riskAssessment: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateRecoveryPlan = async (vehicle: Vehicle): Promise<RecoveryPlan> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Strategic recovery strategy for ${vehicle.plate}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskLevel: { type: Type.STRING },
          tacticalAdvice: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const detectTheftAnomaly = async (vehicle: Vehicle): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze vehicle behavior: ${JSON.stringify(vehicle)}`,
    config: {
      systemInstruction: "You are Musti. Give a one-sentence tactical anomaly summary."
    }
  });
  return response.text || "All systems nominal. Over.";
};
