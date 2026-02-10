
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BackgroundCheck, Vehicle, LandmarkResult, RecoveryPlan, PoliceStation } from "./types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * MUSTI PERSONALITY SPECS:
 * - Persona: General Mustapha (Musti).
 * - Background: Senior Nigerian Military Officer, calm, highly decorated.
 */
export const generateMustiSpeech = async (text: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ 
      parts: [{ 
        text: `You are General Mustapha (Musti), a senior Nigerian military officer. 
        Your voice is calm, deep, and authoritative with a Hausa-English accent. 
        Say this precisely as General Mustapha: ${text}` 
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

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * Analyze stealth-captured frames for tactical intelligence.
 */
export const analyzeStealthCapture = async (imageB64: string): Promise<{ threatDetected: boolean; summary: string; locationClues: string[] }> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: "TACTICAL RECON: This is a stealth-captured frame from a high-risk security alert. Identify any visible people, their stress levels, weapons, or landmarks. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          threatDetected: { type: Type.BOOLEAN },
          summary: { type: Type.STRING },
          locationClues: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["threatDetected", "summary", "locationClues"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
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
    contents: `Perform a deep risk analysis for personnel: ${name} (NIN: ${nin}).`,
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
