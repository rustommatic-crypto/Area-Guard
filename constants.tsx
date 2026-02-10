
import { AssetStatus, Vehicle, SignalSource, TamperStatus, InterstateBus, AuditReport } from './types';

export const NAV_ITEMS = [
  { id: 'mustapha', label: 'Sentinel Hub', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'family', label: 'Shield Network', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'tracking', label: 'Asset Command', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { id: 'registry', label: 'Musti Pin', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c2.206 0 4.233-.711 5.882-1.912l.054.09M12 11V7m0 4l-4-4m4 4l4-4M8 21l.5-1.5M16 21l-.5-1.5M12 21v-2' },
  { id: 'billing', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plate: 'KCA 450X',
    phone: '+234 801 234 5678',
    driverName: 'Abiola Johnson',
    status: AssetStatus.INFILTRATED,
    tamperStatus: TamperStatus.SECURE,
    lat: 6.5244,
    lng: 3.3792,
    accuracy: 5,
    source: SignalSource.SHADOW_APP,
    orgId: 'org1',
    imei: '86445903-4412-998',
    model: 'Toyota Prius 2018',
    lastPing: '2 mins ago',
    paymentScore: 92,
    batteryLevel: 84,
    guarantors: [],
    agent: { version: 'v4.5-stealth', isStealth: true, permissions: ['Location', 'Mic'], batteryDrain: '0.1%', lastSync: 'Now' }
  }
];

export const MOCK_BUSES: InterstateBus[] = [
  {
    id: 'bus-1',
    plate: 'LAG 998 XM',
    route: 'Lagos to Abuja',
    driver: 'Musa Ibrahim',
    eta: '4h 20m',
    progress: 45,
    passengers: []
  }
];

// Fix: Added missing MOCK_REPORTS for ForensicAudit.tsx
export const MOCK_REPORTS: AuditReport[] = [
  {
    id: 'DOS-8821-X',
    timestamp: '2024-05-20 14:30:05',
    assetPlate: 'KCA 450X',
    action: 'SIGNAL_INFILTRATION',
    finding: 'Unauthorized route deviation detected near Otedola Bridge. Acoustic analysis indicates high stress levels.',
    hash: '8f32e9a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
    operator: 'Mustapha Sentinel V4.5'
  },
  {
    id: 'DOS-8822-Y',
    timestamp: '2024-05-20 15:45:12',
    assetPlate: 'LAG 998 XM',
    action: 'GEOFENCE_EXIT',
    finding: 'Vehicle exited the designated 5km radius of Ikeja Division. Primary driver NIN verification matches current biometric scan.',
    hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    operator: 'Mustapha Sentinel V4.5'
  }
];
