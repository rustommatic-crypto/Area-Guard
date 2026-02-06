
export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INFILTRATED = 'INFILTRATED',
  SIM_ONLY = 'SIM_ONLY',
  LOST_SIGNAL = 'LOST_SIGNAL',
  SOS = 'SOS',
  DEFAULT = 'DEFAULT',
  RECOVERED = 'RECOVERED',
  STOLEN = 'STOLEN'
}

export type UserRole = 'PUBLIC' | 'OPERATOR' | 'ADMIN';

export interface FeatureAccess {
  gpsTracking: boolean;
  simTriangulation: boolean;
  socialGraph: boolean;
  forensicReports: boolean;
  policeDispatch: boolean;
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

export interface ContactNode {
  name: string;
  phone: string;
  callFrequency: number;
  lastContact: string;
  isTrackable: boolean;
}

export interface BackgroundCheck {
  ninStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
  loanDefaulter: boolean;
  registryHits: number;
  socialMediaScore: number;
  simAgeDays: number;
  riskAssessment: string;
}

export interface M2MTelemetry {
  iccid: string;
  carrier: string;
  signalDbm: number;
  dataUsage: string;
  ipAddress: string;
  isESIM: boolean;
}

export interface ShadowAgentStatus {
  version: string;
  isStealth: boolean;
  permissions: string[];
  batteryDrain: string;
  lastSync: string;
  scrapedContacts?: ContactNode[];
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
  agent?: ShadowAgentStatus;
  background?: BackgroundCheck;
  m2m?: M2MTelemetry;
  orgId: string;
  imei: string;
  model: string;
  lastPing: string;
  paymentScore: number;
  batteryLevel: number;
  unlockedFeatures?: FeatureAccess;
  guarantors: { 
    name: string; 
    phone: string; 
    relationship: string; 
    status: 'FORM_PENDING' | 'INFILTRATED';
    locationCaptured?: { lat: number; lng: number; address: string };
  }[];
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance?: string;
  lat: number;
  lng: number;
  commandLevel?: 'Division' | 'Area' | 'State' | 'Zonal';
  contactPerson?: string;
}

export interface RecoveryPlan {
  steps: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  tacticalAdvice: string;
}

export type TrackerType = 'decoy' | 'ghost' | 'wearable';

export interface LandmarkResult {
  identified: string[];
  description: string;
  locationCertainty: number;
  riskAssessment: string;
}

export interface AuditReport {
  id: string;
  timestamp: string;
  assetPlate: string;
  operator: string;
  action: string;
  finding: string;
  hash: string;
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
