import { CivicIssue, DepartmentMetric, VerifiedCitizen } from "./types";

// Coimbatore Specific Zone mapping and officials
export const COIMBATORE_ZONES = [
  "Central Zone",
  "East Zone",
  "West Zone",
  "North Zone",
  "South Zone"
];

export const MOCKED_CITIZENS: VerifiedCitizen[] = [
  {
    uid: "cit-101",
    name: "R. Prakash",
    idType: "Aadhaar",
    idNumberMasked: "XXXX-XXXX-8921",
    ocrExtractedAddress: "14, Sathy Road, Gandhipuram, Coimbatore - 641012",
    assignedGeozone: "Central Zone",
    isFraudDetected: false,
    faceMatchScore: 94.2,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    uid: "cit-102",
    name: "Vignesh Kumar",
    idType: "Voter ID",
    idNumberMasked: "TN/03/021/XXX872",
    ocrExtractedAddress: "82, Avinashi Road, Peelamedu, Coimbatore - 641004",
    assignedGeozone: "East Zone",
    isFraudDetected: false,
    faceMatchScore: 91.5,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    uid: "cit-103",
    name: "K. Meenakshi",
    idType: "Property Tax Receipt",
    idNumberMasked: "TAX-2026-COI-9011",
    ocrExtractedAddress: "45, DB Road, RS Puram, Coimbatore - 641002",
    assignedGeozone: "West Zone",
    isFraudDetected: false,
    faceMatchScore: 89.9,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    uid: "cit-104",
    name: "Arun Kumar",
    idType: "Utility Bill",
    idNumberMasked: "ELEC-EB-987216",
    ocrExtractedAddress: "112, Thudiyalur Main Road, Coimbatore - 641034",
    assignedGeozone: "North Zone",
    isFraudDetected: false,
    faceMatchScore: 92.1,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    uid: "cit-105",
    name: "D. Maheshwari",
    idType: "Aadhaar",
    idNumberMasked: "XXXX-XXXX-4530",
    ocrExtractedAddress: "3B, Podanur Main Road, Coimbatore - 641023",
    assignedGeozone: "South Zone",
    isFraudDetected: false,
    faceMatchScore: 95.8,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];

export const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: "CIV-COI-1001",
    reportNumber: "1001",
    reporterName: "R. Prakash",
    title: "Continuous Underground Water Pipeline Leakage",
    description: "Continuous water leakage from underground pipeline near Gandhipuram bus stand causing road flooding and water wastage.",
    location: "14, Sathy Road, Gandhipuram, Coimbatore",
    zone: "Central Zone",
    category: "Water Leakage",
    severity: "High",
    status: "Verified",
    department: "Water Board",
    predictedDeadline: "18 hours",
    predictedDays: 0.75,
    timeElapsedDays: 0.6,
    aiConfidence: 96.5,
    reasoning: "Hydraulic pressure flow near major commercial hub detected via audio sensor telemetry and visual volume estimation.",
    createdAtText: "1h ago",
    upvotes: 42,
    citizenVerified: true,
    assignedOfficer: "M. Ganeshan",
    localSupervisor: "Yogachithra",
    delayProbability: 15,
    beforeImg: "/images/water_before.jpg",
    afterImg: "/images/water_after.jpg",
    geotag: { lat: 11.0183, lng: 76.9725 },
    exifData: {
      latitude: 11.0183,
      longitude: 76.9725,
      timestamp: "2026-06-23T18:15:00Z",
      deviceId: "DEV-IPH-8821B",
      imageFreshnessScore: 98,
      locationPlausibilityScore: 100,
      manipulationCheckScore: 96,
      isAuthentic: true
    },
    verifications: [
      { name: "S. Karthikeyan", votedAt: "2026-06-23T18:30:00Z", distanceMeters: 45, antiFraudPassed: true },
      { name: "M. Revathi", votedAt: "2026-06-23T18:35:00Z", distanceMeters: 120, antiFraudPassed: true },
      { name: "P. Balaji", votedAt: "2026-06-23T18:42:00Z", distanceMeters: 230, antiFraudPassed: true }
    ],
    emailDispatched: true,
    isEscalatedToCommissioner: false,
    emails: [
      {
        id: "em-1001-a",
        issueId: "CIV-COI-1001",
        toEmail: "m.ganeshan.water@coimbatore.gov.in",
        toRole: "Department Head",
        recipientName: "M. Ganeshan",
        subject: "[URGENT] Water Leakage Escalation - CIV-COI-1001 (Gandhipuram)",
        body: "Respected Sir,\n\nA high-severity Water Leakage issue (CIV-COI-1001) has reached community consensus of 3 verified residents in Gandhipuram, Sathy Road.\n\nIssue Details:\n- ID: CIV-COI-1001\n- Reporter: R. Prakash\n- Location: 14, Sathy Road, Gandhipuram, Coimbatore (Geotag: 11.0183, 76.9725)\n- Description: Continuous water leakage from underground pipeline near Gandhipuram bus stand causing road flooding and water wastage.\n- Target SLA Deadline: 18 hours\n- Area Supervisor Assigned: Yogachithra\n\nPlease dispatch the rapid repair crew immediately to prevent further potable water loss.\n\nRegards,\nCIVICEYE Automated Intelligence",
        sentAt: "2026-06-23T18:43:00Z",
        status: "sent"
      },
      {
        id: "em-1001-b",
        issueId: "CIV-COI-1001",
        toEmail: "yogachithra.gandhipuram@coimbatore.gov.in",
        toRole: "Local Supervisor",
        recipientName: "Yogachithra",
        subject: "[TASK ASSIGNED] Sathy Road Pipeline Repair - CIV-COI-1001",
        body: "Hi Yogachithra,\n\nYou have been assigned as the local supervisor for resolving issue CIV-COI-1001.\nLocation: 14, Sathy Road, Gandhipuram.\nPlease coordinate with crew lead and upload completion image for citizen verification within the 18 hours SLA.\n\nCIVICEYE Control Center",
        sentAt: "2026-06-23T18:43:00Z",
        status: "sent"
      }
    ]
  },
  {
    id: "CIV-COI-1002",
    reportNumber: "1002",
    reporterName: "Vignesh Kumar",
    title: "Large Pothole near PSG Tech Signal",
    description: "Large pothole near PSG Tech signal causing bike accidents during peak hours.",
    location: "Avinashi Road, Peelamedu, Coimbatore",
    zone: "East Zone",
    category: "Road Damage",
    severity: "Medium",
    status: "Assigned",
    department: "Municipal Engineering",
    predictedDeadline: "3 days",
    predictedDays: 3.0,
    timeElapsedDays: 0.5,
    aiConfidence: 94.2,
    reasoning: "Deep crater on a high-speed transit arterial. High traffic flow density elevates accident risk score.",
    createdAtText: "12h ago",
    upvotes: 28,
    citizenVerified: false,
    assignedOfficer: "K. Dakshinamurthy",
    localSupervisor: "Ezhil",
    delayProbability: 25,
    beforeImg: "/images/road_before.jpg",
    afterImg: "/images/road_after.jpg",
    geotag: { lat: 11.0287, lng: 77.0024 },
    exifData: {
      latitude: 11.0287,
      longitude: 77.0024,
      timestamp: "2026-06-23T07:20:00Z",
      deviceId: "DEV-ONEPLUS-9T",
      imageFreshnessScore: 96,
      locationPlausibilityScore: 100,
      manipulationCheckScore: 98,
      isAuthentic: true
    },
    verifications: [
      { name: "Nivetha R", votedAt: "2026-06-23T08:10:00Z", distanceMeters: 60, antiFraudPassed: true },
      { name: "Hari Prasath", votedAt: "2026-06-23T08:45:00Z", distanceMeters: 140, antiFraudPassed: true },
      { name: "K. Dinesh", votedAt: "2026-06-23T09:15:00Z", distanceMeters: 80, antiFraudPassed: true }
    ],
    emailDispatched: true,
    isEscalatedToCommissioner: false,
    emails: [
      {
        id: "em-1002-a",
        issueId: "CIV-COI-1002",
        toEmail: "k.dakshinamurthy.east@coimbatore.gov.in",
        toRole: "Department Head",
        recipientName: "K. Dakshinamurthy",
        subject: "[REPAIR NOTIFICATION] Road Damage at Avinashi Road - CIV-COI-1002",
        body: "Respected Sir,\n\nA verified road damage complaint (CIV-COI-1002) near PSG Tech signal has been escalated after gaining 3 resident confirmations.\n\nSLA Deadline: 3 days.\nField Supervisor: Ezhil.\n\nRegards,\nCIVICEYE System",
        sentAt: "2026-06-23T09:16:00Z",
        status: "sent"
      }
    ]
  },
  {
    id: "CIV-COI-1003",
    reportNumber: "1003",
    reporterName: "K. Meenakshi",
    title: "Overflowing Garbage Bins on DB Road",
    description: "Garbage bins overflowing for 3 days causing foul smell and stray dog activity.",
    location: "DB Road, RS Puram, Coimbatore",
    zone: "West Zone",
    category: "Sanitation",
    severity: "High",
    status: "In Progress",
    department: "Sanitation Dept",
    predictedDeadline: "12 hours",
    predictedDays: 0.5,
    timeElapsedDays: 0.3,
    aiConfidence: 97.1,
    reasoning: "Solid waste accumulation in highly populated shopping zone triggers rapid public health vectors.",
    createdAtText: "18h ago",
    upvotes: 56,
    citizenVerified: false,
    assignedOfficer: "S. Narmadha",
    localSupervisor: "C. Veeran",
    delayProbability: 12,
    beforeImg: "/images/garbage_before.jpg",
    afterImg: "/images/garbage_after.jpg",
    geotag: { lat: 11.0084, lng: 76.9512 },
    exifData: {
      latitude: 11.0084,
      longitude: 76.9512,
      timestamp: "2026-06-23T01:10:00Z",
      deviceId: "DEV-SAMS-S22",
      imageFreshnessScore: 92,
      locationPlausibilityScore: 100,
      manipulationCheckScore: 94,
      isAuthentic: true
    },
    verifications: [
      { name: "T. Suresh", votedAt: "2026-06-23T02:00:00Z", distanceMeters: 30, antiFraudPassed: true },
      { name: "Priya Narayanan", votedAt: "2026-06-23T02:15:00Z", distanceMeters: 55, antiFraudPassed: true },
      { name: "Gokul Raj", votedAt: "2026-06-23T02:30:00Z", distanceMeters: 190, antiFraudPassed: true }
    ],
    emailDispatched: true,
    isEscalatedToCommissioner: false,
    emails: [
      {
        id: "em-1003-a",
        issueId: "CIV-COI-1003",
        toEmail: "s.narmadha.san@coimbatore.gov.in",
        toRole: "Department Head",
        recipientName: "S. Narmadha",
        subject: "[IMMEDIATE ACTION] Sanitation Overflow - CIV-COI-1003 (DB Road)",
        body: "Respected Officer,\n\nGarbage overflow at DB Road RS Puram has crossed 3 resident confirmations. Stray dog hazard reported.\n\nSLA Deadline: 12 hours.\nSupervisor: C. Veeran.\n\nRegards,\nCIVICEYE",
        sentAt: "2026-06-23T02:31:00Z",
        status: "sent"
      }
    ]
  },
  {
    id: "CIV-COI-1004",
    reportNumber: "1004",
    reporterName: "Arun Kumar",
    title: "Five Consecutive Streetlight Failures",
    description: "Five consecutive streetlights not functioning, creating safety concerns at night.",
    location: "Thudiyalur Main Road, Coimbatore",
    zone: "North Zone",
    category: "Streetlight",
    severity: "Medium",
    status: "Assigned",
    department: "Electricity Board",
    predictedDeadline: "24 hours",
    predictedDays: 1.0,
    timeElapsedDays: 0.1,
    aiConfidence: 91.8,
    reasoning: "Dark street segments correlated with night crime maps flags safety concerns on residential corridor.",
    createdAtText: "2h ago",
    upvotes: 18,
    citizenVerified: false,
    assignedOfficer: "S.N. Shanmugam",
    localSupervisor: "Savitha",
    delayProbability: 18,
    beforeImg: "/images/streetlight_before.jpg",
    afterImg: "/images/streetlight_after.jpg",
    geotag: { lat: 11.0812, lng: 76.9416 },
    exifData: {
      latitude: 11.0812,
      longitude: 76.9416,
      timestamp: "2026-06-23T17:10:00Z",
      deviceId: "DEV-VIVO-V21",
      imageFreshnessScore: 99,
      locationPlausibilityScore: 100,
      manipulationCheckScore: 97,
      isAuthentic: true
    },
    verifications: [
      { name: "K. Janani", votedAt: "2026-06-23T17:40:00Z", distanceMeters: 95, antiFraudPassed: true },
      { name: "M. Saravanan", votedAt: "2026-06-23T17:50:00Z", distanceMeters: 150, antiFraudPassed: true },
      { name: "Bhuvana S", votedAt: "2026-06-23T18:05:00Z", distanceMeters: 280, antiFraudPassed: true }
    ],
    emailDispatched: true,
    isEscalatedToCommissioner: false,
    emails: [
      {
        id: "em-1004-a",
        issueId: "CIV-COI-1004",
        toEmail: "s.n.shanmugam.north@coimbatore.gov.in",
        toRole: "Department Head",
        recipientName: "S.N. Shanmugam",
        subject: "[TICKET] Streetlight Failure Thudiyalur - CIV-COI-1004",
        body: "Dear Sir,\n\nFive streetlights are out on Thudiyalur Main Road, creating a blind spot. Consensus achieved.\n\nSLA Deadline: 24 hours.\nSupervisor: Savitha.\n\nCIVICEYE Platform",
        sentAt: "2026-06-23T18:06:00Z",
        status: "sent"
      }
    ]
  },
  {
    id: "CIV-COI-1005",
    reportNumber: "1005",
    reporterName: "D. Maheshwari",
    title: "Critical Sewage Overflow into Residential Streets",
    description: "Sewage mixed with rainwater entering residential streets causing health hazards.",
    location: "Podanur Main Road, Coimbatore",
    zone: "South Zone",
    category: "Sewage Overflow",
    severity: "Critical",
    status: "Escalated",
    department: "Sewage Operations",
    predictedDeadline: "6 hours",
    predictedDays: 0.25,
    timeElapsedDays: 0.5,
    aiConfidence: 98.9,
    reasoning: "Biohazard exposure metrics and high population density triggers automated emergency escalation vector.",
    createdAtText: "12h ago",
    upvotes: 89,
    citizenVerified: false,
    assignedOfficer: "N. Dakshinamurthy",
    localSupervisor: "M.V. Andiappan",
    escalationTarget: "Katta Ravi Teja",
    delayProbability: 92, // Exceeded 6 hrs predicted deadline (elapsed is 0.5 days = 12h), triggering escalation
    beforeImg: "/images/sewage_before.jpg",
    afterImg: "/images/sewage_after.jpg",
    geotag: { lat: 10.9758, lng: 76.9624 },
    exifData: {
      latitude: 10.9758,
      longitude: 76.9624,
      timestamp: "2026-06-23T07:12:00Z",
      deviceId: "DEV-IPH-13PRO",
      imageFreshnessScore: 97,
      locationPlausibilityScore: 100,
      manipulationCheckScore: 95,
      isAuthentic: true
    },
    verifications: [
      { name: "P. Senthil", votedAt: "2026-06-23T07:45:00Z", distanceMeters: 40, antiFraudPassed: true },
      { name: "Lakshmi Devi", votedAt: "2026-06-23T08:02:00Z", distanceMeters: 75, antiFraudPassed: true },
      { name: "R. Naveen", votedAt: "2026-06-23T08:20:00Z", distanceMeters: 110, antiFraudPassed: true }
    ],
    emailDispatched: true,
    isEscalatedToCommissioner: true,
    escalationReportSentAt: "2026-06-23T13:12:00Z",
    emails: [
      {
        id: "em-1005-a",
        issueId: "CIV-COI-1005",
        toEmail: "n.dakshinamurthy.south@coimbatore.gov.in",
        toRole: "Department Head",
        recipientName: "N. Dakshinamurthy",
        subject: "[CRITICAL SEWAGE EXPOSURE] Podanur Main Road - CIV-COI-1005",
        body: "CRITICAL ALERT:\n\nSewage entering households at Podanur Main Road. SLA is 6 hours and elapsed time has exceeded 12 hours without resolution.\n\nDepartment: Sewage Operations\nSupervisor: M.V. Andiappan.\n\nCIVICEYE Emergency Response",
        sentAt: "2026-06-23T08:21:00Z",
        status: "sent"
      },
      {
        id: "em-1005-comm",
        issueId: "CIV-COI-1005",
        toEmail: "katta.raviteja.commissioner@coimbatore.gov.in",
        toRole: "Municipal Commissioner",
        recipientName: "Katta Ravi Teja",
        subject: "[COMMISSIONER ESCALATION] Critical Delay in Sewage Resolution - CIV-COI-1005",
        body: "Respected Commissioner Katta Ravi Teja Sir,\n\nWe are escalating a critical public health failure in the South Zone (Podanur Main Road). Sewage mixed with rainwater has been entering residential streets for over 12 hours. The Sewage Operations department under N. Dakshinamurthy has failed to resolve this within the predicted 6-hour SLA.\n\nEscalation Parameters:\n- Issue ID: CIV-COI-1005\n- Performance index for Sewage Operations: 25.0% (Threshold for escalation is < 30.0%)\n- Worst-performing officer flagged: N. Dakshinamurthy\n- Delay factor: Live public health biohazard exposure\n\nPlease find the attached analytical performance briefing for direct command intervention.\n\nRegards,\nCIVICEYE Commissioner Escalation Engine",
        sentAt: "2026-06-23T13:12:00Z",
        status: "sent"
      }
    ]
  }
];

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { name: "Water Board", code: "H2O", zone: "Central Zone", slaCompliance: 80.0, totalCases: 5, solvedCases: 4, pendingCases: 1, delayedCases: 0, avgResolutionDays: 1.2 },
  { name: "Municipal Engineering", code: "ENG", zone: "East Zone", slaCompliance: 66.7, totalCases: 3, solvedCases: 2, pendingCases: 1, delayedCases: 0, avgResolutionDays: 3.5 },
  { name: "Sanitation Dept", code: "SAN", zone: "West Zone", slaCompliance: 75.0, totalCases: 4, solvedCases: 3, pendingCases: 1, delayedCases: 0, avgResolutionDays: 0.8 },
  { name: "Electricity Board", code: "EB", zone: "North Zone", slaCompliance: 50.0, totalCases: 2, solvedCases: 1, pendingCases: 1, delayedCases: 0, avgResolutionDays: 1.8 },
  { name: "Sewage Operations", code: "SEW", zone: "South Zone", slaCompliance: 25.0, totalCases: 4, solvedCases: 1, pendingCases: 2, delayedCases: 1, avgResolutionDays: 2.5 }
];

export const PIPELINE_STAGES = [
  { id: "auth", label: "1. Citizen Auth", desc: "Government ID OCR & Address geozone mapping" },
  { id: "capture", label: "2. Evidence Capture", desc: "GPS Exif integrity & Anti-deepfake checks" },
  { id: "consensus", label: "3. Local Consensus", desc: "Radius notification & 3-Resident approvals" },
  { id: "email", label: "4. Official Dispatch", desc: "Nodemailer/SendGrid multi-role email triggers" },
  { id: "monitor", label: "5. SLA Dashboard", desc: "Realtime tracking with Formula-based KPI metrics" },
  { id: "escalate", label: "6. Commissioner Gate", desc: "Automated alert trigger for Performance < 30%" }
];
