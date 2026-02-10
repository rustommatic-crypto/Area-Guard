
export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INFILTRATED = 'INFILTRATED',
  SIM_ONLY = 'SIM_ONLY',
  LOST_SIGNAL = 'LOST_SIGNAL',
  SOS = 'SOS',
  DEFAULT = 'DEFAULT',
  RECOVERED = 'RECOVERED',
  STOLEN = 'STOLEN',
  SENTINEL_MODE = 'SENTINEL_MODE'
}

export type EscortMode = 'INTRA_CITY' | 'INTERSTATE' | 'IDLE';

export type UserTier = 'PERSONAL' | 'FAMILY' | 'BUSINESS' | 'NONE';

export type UserRole = 'PUBLIC' | 'OPERATOR' | 'ADMIN' | 'FAMILY_HEAD' | 'PROTECTED_MEMBER';

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  commandLevel?: 'Division' | 'Area' | 'State' | 'Zonal';
  contactPerson?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  phone: string;
  driverName: string;
  nin?: string;
  status: AssetStatus;
  tamperStatus: TamperStatus;
  lat: number;
  lng: number;
  accuracy: number;
  source: SignalSource;
  orgId: string;
  imei: string;
  model: string;
  lastPing: string;
  paymentScore: number;
  batteryLevel: number;
  guarantors: any[];
  agent?: {
    version: string;
    isStealth: boolean;
    permissions: string[];
    batteryDrain: string;
    lastSync: string;
  };
}

export enum SignalSource {
  SHADOW_APP = 'SHADOW_APP',
  CARRIER_SIM = 'CARRIER_SIM',
  GHOST_NODE = 'GHOST_NODE'
}

export enum TamperStatus {
  SECURE = 'SECURE',
  TAMPER_DETECTED = 'TAMPER_DETECTED',
  SIM_REMOVED = 'SIM_REMOVED',
  POWER_CUT = 'POWER_CUT'
}

export interface LandmarkResult {
  identified: string[];
  description: string;
  locationCertainty: number;
  riskAssessment: string;
}

export interface RecoveryPlan {
  steps: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  tacticalAdvice: string;
}

export interface Passenger {
  id: string;
  name: string;
  seatNumber: string;
  status: 'SAFE' | 'SOS';
  deviceImei: string;
}

export interface InterstateBus {
  id: string;
  plate: string;
  route: string;
  driver: string;
  eta: string;
  progress: number;
  passengers: Passenger[];
}

// Fix: Added missing BackgroundCheck interface for geminiService.ts
export interface BackgroundCheck {
  ninStatus: string;
  loanDefaulter: boolean;
  registryHits: number;
  socialMediaScore: number;
  simAgeDays: number;
  riskAssessment: string;
}

// Fix: Added missing AuditReport interface for ForensicAudit.tsx
export interface AuditReport {
  id: string;
  timestamp: string;
  assetPlate: string;
  action: string;
  finding: string;
  hash: string;
  operator: string;
}
