
import { GoogleGenAI, Type } from "@google/genai";
import { AssetStatus, Vehicle, SignalSource, PoliceStation, RecoveryPlan, LandmarkResult, InterstateBus, TamperStatus } from './types';
export { MOCK_VEHICLES, MOCK_BUSES } from './constants';
export { analyzeLandmark, detectTheftAnomaly, generateRecoveryPlan } from './geminiService';

// MOCK_POLICE_STATIONS acting as a local state for the demo.
export let MOCK_POLICE_STATIONS: PoliceStation[] = [
  { id: 'ps-1', name: 'Ikeja Division', address: 'Obafemi Awolowo Way, Ikeja', phone: '+234 1 234 5678', lat: 6.5967, lng: 3.3515, commandLevel: 'Division', contactPerson: 'Sgt. Okeke' },
  { id: 'ps-2', name: 'Lagos State Command HQ', address: 'Muiz Banire St, Ikeja', phone: '+234 1 888 9999', lat: 6.5920, lng: 3.3420, commandLevel: 'State', contactPerson: 'ACP Bakare' },
  { id: 'ps-3', name: 'Surulere Area C Command', address: 'Barracks, Surulere', phone: '+234 802 111 2233', lat: 6.5050, lng: 3.3650, commandLevel: 'Area', contactPerson: 'Insp. Musa' }
];

export const addPoliceStation = (station: PoliceStation) => {
  MOCK_POLICE_STATIONS = [station, ...MOCK_POLICE_STATIONS];
};

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearestStation = (lat: number, lng: number): PoliceStation => {
  return MOCK_POLICE_STATIONS.reduce((prev, curr) => {
    const prevDist = calculateDistance(lat, lng, prev.lat, prev.lng);
    const currDist = calculateDistance(lat, lng, curr.lat, curr.lng);
    return currDist < prevDist ? prev : curr;
  }, MOCK_POLICE_STATIONS[0]);
};

export const findNearestPoliceStations = async (lat: number, lng: number): Promise<(PoliceStation & { distance: string })[]> => {
  // We prioritize the local registered database first
  const sorted = [...MOCK_POLICE_STATIONS].sort((a, b) => {
    return calculateDistance(lat, lng, a.lat, a.lng) - calculateDistance(lat, lng, b.lat, b.lng);
  });
  
  return sorted.map(s => ({
    ...s,
    distance: `${calculateDistance(lat, lng, s.lat, s.lng).toFixed(1)}km`
  }));
};

export const performCarrierTriangulation = async (phone: string): Promise<{lat: number, lng: number, radius: number, confidence: number}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `SIMULATE: Carrier HLR Lookup for ${phone}. Return a JSON coordinate object representing a cell-tower triangulation sector in Lagos.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lat: { type: Type.NUMBER },
          lng: { type: Type.NUMBER },
          radius: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER }
        },
        required: ["lat", "lng", "radius", "confidence"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getDemoLandmarkResult = (): LandmarkResult => ({
  identified: ["Lagos National Stadium", "Western Avenue"],
  description: "Target spotted near the National Stadium in Surulere. High confidence in visual match.",
  locationCertainty: 92,
  riskAssessment: "Area is highly congested; recovery should be prioritized during off-peak hours."
});

export const getDemoRecoveryPlan = (plate: string): RecoveryPlan => ({
  steps: [
    `Initialize secondary SIM ping for ${plate} to confirm stationary status.`,
    "Coordinate with nearest Police Division Command.",
    "Deploy recovery team to primary GPS coordinates.",
    "Execute remote immobilization via Shadow Agent if vehicle attempts movement."
  ],
  riskLevel: 'Medium',
  tacticalAdvice: "Avoid direct confrontation in high-traffic zones. Utilize local law enforcement for perimeter control."
});
