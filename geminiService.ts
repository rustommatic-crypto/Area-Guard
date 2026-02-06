
import { GoogleGenAI, Type } from "@google/genai";
import { BackgroundCheck, Vehicle, LandmarkResult, RecoveryPlan, PoliceStation } from "./types";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Search for real police stations using Google Maps Grounding
export const searchPoliceStationsOnMap = async (query: string, lat?: number, lng?: number): Promise<PoliceStation[]> => {
  const ai = getGeminiClient();
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

  // Since response.text is Markdown, we use a follow-up JSON extraction if needed, 
  // but for this demo we'll use a secondary call to parse the text into structured data.
  const parserResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the police stations from this text into a JSON array of PoliceStation objects:
    ${response.text}
    
    Format: [{"id": "uuid", "name": "...", "address": "...", "phone": "...", "lat": 0, "lng": 0}]`,
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
          required: ["id", "name", "address", "phone", "lat", "lng"]
        }
      }
    }
  });

  return JSON.parse(parserResponse.text || "[]");
};

export const runDeepPersonnelScan = async (name: string, nin: string): Promise<BackgroundCheck> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `SITUATIONAL_ANALYSIS: Perform a deep background scan on ${name} (NIN: ${nin}). 
    Cross-reference with:
    1. Absconder registries (Bad Driver Lists)
    2. Social media sentiment (Risk of flight)
    3. Potential loan defaults.
    
    Return JSON only with ninStatus, loanDefaulter, registryHits, socialMediaScore (0-100), simAgeDays (simulated based on carrier history), and a 2-sentence riskAssessment.`,
    config: {
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
        },
        required: ["ninStatus", "loanDefaulter", "registryHits", "socialMediaScore", "simAgeDays", "riskAssessment"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const extractLocationFromPhoto = async (imageB64: string): Promise<{lat: number, lng: number, address: string}> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: "Extract EXIF data or analyze landmarks in this live onboarding photo. Return JSON with lat, lng, and estimated street address." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lat: { type: Type.NUMBER },
          lng: { type: Type.NUMBER },
          address: { type: Type.STRING }
        },
        required: ["lat", "lng", "address"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeLandmark = async (imageB64: string): Promise<LandmarkResult> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: "Analyze the landmarks in this image for geographic verification. Return JSON with identified (array of strings), description, locationCertainty (0-100), and riskAssessment." }
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
        },
        required: ["identified", "description", "locationCertainty", "riskAssessment"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateRecoveryPlan = async (vehicle: Vehicle): Promise<RecoveryPlan> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `OPERATIONAL_RECOVERY_PROTOCOL: Generate a tactical recovery plan for vehicle ${vehicle.plate} (${vehicle.model}). 
    Driver: ${vehicle.driverName}. Status: ${vehicle.status}. Tamper Status: ${vehicle.tamperStatus}.
    Location: ${vehicle.lat}, ${vehicle.lng}.
    Return JSON with steps (array of strings), riskLevel (Low, Medium, High), and tacticalAdvice (1 sentence).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskLevel: { type: Type.STRING },
          tacticalAdvice: { type: Type.STRING }
        },
        required: ["steps", "riskLevel", "tacticalAdvice"]
      }
    }
  });
  const data = JSON.parse(response.text || "{}");
  if (!['Low', 'Medium', 'High'].includes(data.riskLevel)) {
    data.riskLevel = 'Medium';
  }
  return data;
};

export const detectTheftAnomaly = async (vehicle: Vehicle): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze telemetry for potential theft anomaly: Plate: ${vehicle.plate}, Tamper: ${vehicle.tamperStatus}, Last Ping: ${vehicle.lastPing}. Return a brief summary of the anomaly detection results.`,
  });
  return response.text || "No anomaly detected.";
};
