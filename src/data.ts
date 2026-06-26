import { CivicIssue, DepartmentMetric, VerifiedCitizen, SeverityLevel, IssueStatus } from "./types";

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

const AREAS_INFO = [
  { name: "Gandhipuram", zone: "Central Zone", lat: 11.0183, lng: 76.9725 },
  { name: "RS Puram", zone: "Central Zone", lat: 11.0084, lng: 76.9512 },
  { name: "Town Hall", zone: "Central Zone", lat: 10.9967, lng: 76.9614 },
  { name: "Race Course", zone: "Central Zone", lat: 10.9996, lng: 76.9774 },
  { name: "Sivananda Colony", zone: "Central Zone", lat: 11.0253, lng: 76.9644 },
  { name: "Peelamedu", zone: "East Zone", lat: 11.0287, lng: 77.0024 },
  { name: "Singanallur", zone: "East Zone", lat: 11.0026, lng: 77.0238 },
  { name: "Ganapathy", zone: "East Zone", lat: 11.0312, lng: 76.9815 },
  { name: "Vilankurichi", zone: "East Zone", lat: 11.0458, lng: 77.0215 },
  { name: "Kalapatti", zone: "East Zone", lat: 11.0621, lng: 77.0392 },
  { name: "Saibaba Colony", zone: "West Zone", lat: 11.0235, lng: 76.9452 },
  { name: "Vadavalli", zone: "West Zone", lat: 11.0212, lng: 76.9015 },
  { name: "Kovaipudur", zone: "West Zone", lat: 10.9525, lng: 76.9112 },
  { name: "Mettupalayam Road", zone: "West Zone", lat: 11.0415, lng: 76.9412 },
  { name: "Saravanampatti", zone: "North Zone", lat: 11.0783, lng: 76.9925 },
  { name: "Thudiyalur", zone: "North Zone", lat: 11.0812, lng: 76.9416 },
  { name: "Ukkadam", zone: "South Zone", lat: 10.9856, lng: 76.9621 },
  { name: "Podanur", zone: "South Zone", lat: 10.9758, lng: 76.9624 },
  { name: "Kuniamuthur", zone: "South Zone", lat: 10.9635, lng: 76.9385 },
  { name: "Sundarapuram", zone: "South Zone", lat: 10.9512, lng: 76.9685 }
];

const CATEGORIES_INFO = [
  { category: "Road Damage" as const, department: "Road", title: "Severe Potholes and Road Crack", desc: "Large crater and deep potholes on the main transit lane, causing severe risk of bike skid accidents and heavy traffic delay during peak hours.", before: "/images/road/road_damage_default.jpg", after: "/images/completed/road_fixed_default.jpg" },
  { category: "Water Leakage" as const, department: "Water", title: "Potable Underground Pipeline Leakage", desc: "Main potable water supply pipe leakage detected. Thousands of liters of pure drinking water are being wasted and flooding the surrounding pavements.", before: "/images/water/water_leak_default.jpg", after: "/images/completed/water_fixed_default.jpg" },
  { category: "Garbage Overflow" as const, department: "Sewage", title: "Overflowing Public Waste Dustbin", desc: "Public waste bins are completely overflowing. Garbage has spread on the road for the last three days causing terrible stench, stray dog hazard, and flies.", before: "/images/garbage/garbage_default.jpg", after: "/images/completed/garbage_fixed_default.jpg" },
  { category: "Streetlight Failure" as const, department: "Electricity", title: "Complete Streetlight Segment Outage", desc: "Multiple consecutive municipal streetlights are not working, casting the entire residential road in total darkness and raising severe safety concerns at night.", before: "/images/streetlight/streetlight_default.jpg", after: "/images/completed/streetlight_fixed_default.jpg" },
  { category: "Sewage Overflow" as const, department: "Sewage", title: "Open Sewage Drain Block and Overflow", desc: "Domestic sewage line is clogged, causing raw contaminated wastewater to overflow into the street and residential pathways. Extremely hazardous public health threat.", before: "/images/sewage/sewage_default.jpg", after: "/images/completed/sewage_fixed_default.jpg" }
];

export const COIMBATORE_OFFICERS = [
  "Eng. Rajendran",
  "Eng. Balasubramani",
  "Officer Manikandan",
  "Eng. Dinesh",
  "Officer Saravanan",
  "Eng. Gopinath",
  "Officer Kumaravel",
  "Officer Magesh",
  "Officer Jagan"
];

const CITIZENS_POOL = [
  { name: "R. Prakash", id: "cit-101" },
  { name: "Vignesh Kumar", id: "cit-102" },
  { name: "K. Meenakshi", id: "cit-103" },
  { name: "Arun Kumar", id: "cit-104" },
  { name: "D. Maheshwari", id: "cit-105" },
  { name: "S. Karthikeyan", id: "cit-106" },
  { name: "M. Revathi", id: "cit-107" },
  { name: "Anitha Raj", id: "cit-108" }
];

export const getIssueImages = (category: string, area: string, isCompleted: boolean) => {
  const normArea = area.toLowerCase().replace(/\s+/g, '');
  
  if (category === "Road Damage") {
    if (normArea.includes("gandhipuram")) {
      return {
        before: "/images/road/road_damage_gandhipuram.jpg",
        after: isCompleted ? "/images/completed/road_fixed_gandhipuram.jpg" : undefined
      };
    }
    if (normArea.includes("rspuram")) {
      return {
        before: "/images/road/road_damage_rspuram.jpg",
        after: isCompleted ? "/images/completed/road_fixed_rspuram.jpg" : undefined
      };
    }
    if (normArea.includes("peelamedu")) {
      return {
        before: "/images/road/road_damage_peelamedu.jpg",
        after: isCompleted ? "/images/completed/road_fixed_peelamedu.jpg" : undefined
      };
    }
    if (normArea.includes("saibaba")) {
      return {
        before: "/images/road/road_damage_saibaba.jpg",
        after: isCompleted ? "/images/completed/road_fixed_saibaba.jpg" : undefined
      };
    }
    return {
      before: "/images/road/road_damage_default.jpg",
      after: isCompleted ? "/images/completed/road_fixed_default.jpg" : undefined
    };
  }

  if (category === "Water Leakage") {
    if (normArea.includes("rspuram")) {
      return {
        before: "/images/water/water_leak_rspuram.jpg",
        after: isCompleted ? "/images/completed/water_fixed_rspuram.jpg" : undefined
      };
    }
    if (normArea.includes("vadavalli")) {
      return {
        before: "/images/water/water_leak_vadavalli.jpg",
        after: isCompleted ? "/images/completed/water_fixed_vadavalli.jpg" : undefined
      };
    }
    if (normArea.includes("gandhipuram")) {
      return {
        before: "/images/water/water_leak_gandhipuram.jpg",
        after: isCompleted ? "/images/completed/water_fixed_gandhipuram.jpg" : undefined
      };
    }
    return {
      before: "/images/water/water_leak_default.jpg",
      after: isCompleted ? "/images/completed/water_fixed_default.jpg" : undefined
    };
  }

  if (category === "Garbage Overflow") {
    if (normArea.includes("ukkadam")) {
      return {
        before: "/images/garbage/garbage_ukkadam.jpg",
        after: isCompleted ? "/images/completed/garbage_fixed_ukkadam.jpg" : undefined
      };
    }
    if (normArea.includes("podanur")) {
      return {
        before: "/images/garbage/garbage_podanur.jpg",
        after: isCompleted ? "/images/completed/garbage_fixed_podanur.jpg" : undefined
      };
    }
    return {
      before: "/images/garbage/garbage_default.jpg",
      after: isCompleted ? "/images/completed/garbage_fixed_default.jpg" : undefined
    };
  }

  if (category === "Streetlight Failure") {
    if (normArea.includes("peelamedu")) {
      return {
        before: "/images/streetlight/streetlight_peelamedu.jpg",
        after: isCompleted ? "/images/completed/streetlight_fixed_peelamedu.jpg" : undefined
      };
    }
    if (normArea.includes("kuniamuthur")) {
      return {
        before: "/images/streetlight/streetlight_kuniamuthur.jpg",
        after: isCompleted ? "/images/completed/streetlight_fixed_kuniamuthur.jpg" : undefined
      };
    }
    return {
      before: "/images/streetlight/streetlight_default.jpg",
      after: isCompleted ? "/images/completed/streetlight_fixed_default.jpg" : undefined
    };
  }

  if (category === "Sewage Overflow") {
    if (normArea.includes("singanallur")) {
      return {
        before: "/images/sewage/sewage_singanallur.jpg",
        after: isCompleted ? "/images/completed/sewage_fixed_singanallur.jpg" : undefined
      };
    }
    if (normArea.includes("townhall")) {
      return {
        before: "/images/sewage/sewage_townhall.jpg",
        after: isCompleted ? "/images/completed/sewage_fixed_townhall.jpg" : undefined
      };
    }
    return {
      before: "/images/sewage/sewage_default.jpg",
      after: isCompleted ? "/images/completed/sewage_fixed_default.jpg" : undefined
    };
  }

  return {
    before: "/images/road/road_damage_default.jpg",
    after: isCompleted ? "/images/completed/road_fixed_default.jpg" : undefined
  };
};

export const generateSeededIssues = (): CivicIssue[] => {
  const list: CivicIssue[] = [];
  const statuses: IssueStatus[] = ["Pending", "Verified", "Assigned", "In Progress", "Completed", "Escalated"];
  const urgencies: SeverityLevel[] = ["Low", "Medium", "High", "Critical"];

  for (let i = 0; i < 35; i++) {
    const areaInfo = AREAS_INFO[i % AREAS_INFO.length];
    const catInfo = CATEGORIES_INFO[i % CATEGORIES_INFO.length];
    
    // Distribute statuses realistically
    let status: IssueStatus = "Pending";
    if (i < 8) status = "Completed";
    else if (i < 15) status = "In Progress";
    else if (i < 22) status = "Assigned";
    else if (i < 28) status = "Verified";
    else if (i < 32) status = "Pending";
    else status = "Escalated";

    const severity = urgencies[i % urgencies.length];
    const reporter = CITIZENS_POOL[i % CITIZENS_POOL.length];
    const officer = COIMBATORE_OFFICERS[i % COIMBATORE_OFFICERS.length];
    const reportNum = (1001 + i).toString();
    const id = `CIV-COI-${reportNum}`;
    const isCompleted = status === "Completed";
    const upvotes = 5 + (i * 4) % 85;
    
    const imgData = getIssueImages(catInfo.category, areaInfo.name, isCompleted);

    const issue: CivicIssue = {
      id,
      reportNumber: reportNum,
      reporterName: reporter.name,
      userId: reporter.id,
      title: `${catInfo.title} in ${areaInfo.name}`,
      description: `${catInfo.desc} This issue has been severe for several days, causing severe hazard and public distress in the ${areaInfo.name} residential pocket. Immediate engineering support requested.`,
      location: `${areaInfo.name}, Coimbatore, Tamil Nadu`,
      zone: areaInfo.zone,
      category: catInfo.category,
      severity,
      status,
      department: catInfo.department,
      predictedDeadline: severity === "Critical" ? "6 hours" : severity === "High" ? "18 hours" : severity === "Medium" ? "3 days" : "5 days",
      predictedDays: severity === "Critical" ? 0.25 : severity === "High" ? 0.75 : severity === "Medium" ? 3 : 5,
      timeElapsedDays: isCompleted ? 0.4 : 0.1,
      aiConfidence: 87 + (i * 3) % 13,
      reasoning: `Telemetry edge-node analysis detects water pressure discrepancy and visual blockage flow rate anomalies matching ${severity} metrics.`,
      createdAtText: `${1 + (i % 7)}d ago`,
      upvotes,
      citizenVerified: status !== "Pending",
      assignedOfficer: status === "Pending" ? "" : officer,
      localSupervisor: "Savitha CCMC",
      delayProbability: i % 5 === 0 ? 38 : 10,
      beforeImg: imgData.before,
      afterImg: imgData.after,
      geotag: { lat: areaInfo.lat, lng: areaInfo.lng },
      exifData: {
        latitude: areaInfo.lat,
        longitude: areaInfo.lng,
        timestamp: new Date(Date.now() - (i + 1) * 12 * 3600 * 1000).toISOString(),
        deviceId: `DEV-COI-${1000 + i}`,
        imageFreshnessScore: 95,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 97,
        isAuthentic: true
      },
      verifications: [
        { name: "K. Murugan", votedAt: new Date(Date.now() - (i + 1) * 10 * 3600 * 1000).toISOString(), distanceMeters: 15 + i, antiFraudPassed: true },
        { name: "R. Selvi", votedAt: new Date(Date.now() - (i + 1) * 9 * 3600 * 1000).toISOString(), distanceMeters: 45 + i, antiFraudPassed: true }
      ],
      emailDispatched: status !== "Pending",
      emails: [],
      isEscalatedToCommissioner: status === "Escalated",

      // Conformed fields for Point 1 & 2
      area: areaInfo.name,
      citizenName: reporter.name,
      citizenId: reporter.id,
      officerName: status === "Pending" ? "" : officer,
      urgency: severity,
      beforeImage: imgData.before,
      afterImage: imgData.after,
      remarks: isCompleted ? `Municipal restoration work completed successfully. Excavated area cleared and asphalt laid by CCMC team.` : undefined,
      comments: [
        { id: `cmt-1-${id}`, userId: "cit-101", userName: "R. Prakash", userRole: "citizen", text: "This blocks school vans in the morning. Extremely dangerous.", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
        { id: `cmt-2-${id}`, userId: "cit-103", userName: "K. Meenakshi", userRole: "citizen", text: "Reported to ward office but no action yet, hoping CivicEye automates it.", createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString() }
      ],
      ratings: isCompleted ? [5, 4, 5] : [],
      reviews: isCompleted ? [
        { userId: "cit-102", userName: "Vignesh Kumar", rating: 5, text: "Excellent and quick repair. Thank you to the municipal team!", createdAt: new Date().toISOString() }
      ] : [],
      createdAt: new Date(Date.now() - (i + 2) * 24 * 3600 * 1000).toISOString(),
      completedAt: isCompleted ? new Date(Date.now() - i * 12 * 3600 * 1000).toISOString() : undefined
    };

    list.push(issue);
  }

  // Append custom sample cases filed by R. Prakash (cit-101 / cit-1)
  const prakashIssues: CivicIssue[] = [
    {
      id: "CIV-COI-9001",
      reportNumber: "9001",
      reporterName: "R. Prakash",
      userId: "cit-101",
      title: "Major Drinking Water Leakage on Sathy Road",
      description: "Severe drinking water main pipe leakage. Thousands of liters of pure water are wasted on the road since morning. Public requested immediate repair.",
      location: "14, Sathy Road, Gandhipuram, Coimbatore - 641012",
      zone: "Central Zone",
      category: "Water Leakage",
      severity: "High",
      status: "In Progress",
      department: "Water",
      predictedDeadline: "18 hours",
      predictedDays: 0.75,
      timeElapsedDays: 0.2,
      aiConfidence: 94,
      reasoning: "Flow discrepancy reports matched with telemetry water main pressure drops.",
      createdAtText: "1d ago",
      upvotes: 14,
      citizenVerified: true,
      assignedOfficer: "S. Ganeshan",
      localSupervisor: "Savitha CCMC",
      delayProbability: 12,
      beforeImg: "/images/water/water_leak_gandhipuram.jpg",
      geotag: { lat: 11.0183, lng: 76.9725 },
      exifData: {
        latitude: 11.0183,
        longitude: 76.9725,
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        deviceId: "DEV-COI-9001",
        imageFreshnessScore: 99,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 98,
        isAuthentic: true
      },
      verifications: [
        { name: "K. Murugan", votedAt: new Date().toISOString(), distanceMeters: 12, antiFraudPassed: true }
      ],
      emailDispatched: true,
      emails: [],
      isEscalatedToCommissioner: false,
      area: "Gandhipuram",
      citizenName: "R. Prakash",
      citizenId: "cit-101",
      officerName: "S. Ganeshan",
      urgency: "High",
      beforeImage: "/images/water/water_leak_gandhipuram.jpg",
      comments: [
        { id: "cmt-9001-1", userId: "cit-102", userName: "Vignesh Kumar", userRole: "citizen", text: "Water is flowing into nearby shops. Please fix quickly!", createdAt: new Date().toISOString() }
      ],
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9002",
      reportNumber: "9002",
      reporterName: "R. Prakash",
      userId: "cit-101",
      title: "Unfilled Potholes near Gandhipuram Bus Stand",
      description: "Extremely deep potholes near the bus stand exit curve. Two-wheelers are slipping constantly in the dark hours. Extremely hazardous for public commuters.",
      location: "Gandhipuram Bus Stand Road, Coimbatore - 641012",
      zone: "Central Zone",
      category: "Road Damage",
      severity: "Critical",
      status: "Pending",
      department: "Road",
      predictedDeadline: "6 hours",
      predictedDays: 0.25,
      timeElapsedDays: 0.05,
      aiConfidence: 96,
      reasoning: "Visual assessment algorithm highlights depth of pothole exceeds 12cm, representing an immediate traffic collision hazard.",
      createdAtText: "3h ago",
      upvotes: 28,
      citizenVerified: false,
      assignedOfficer: "",
      localSupervisor: "Savitha CCMC",
      delayProbability: 5,
      beforeImg: "/images/road/road_damage_gandhipuram.jpg",
      geotag: { lat: 11.0201, lng: 76.9698 },
      exifData: {
        latitude: 11.0201,
        longitude: 76.9698,
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        deviceId: "DEV-COI-9002",
        imageFreshnessScore: 100,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 99,
        isAuthentic: true
      },
      verifications: [],
      emailDispatched: false,
      emails: [],
      isEscalatedToCommissioner: false,
      area: "Gandhipuram",
      citizenName: "R. Prakash",
      citizenId: "cit-101",
      officerName: "",
      urgency: "Critical",
      beforeImage: "/images/road/road_damage_gandhipuram.jpg",
      comments: [],
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9003",
      reportNumber: "9003",
      reporterName: "R. Prakash",
      userId: "cit-101",
      title: "Garbage Overflow at Gandhipuram 4th Street Bin",
      description: "Large municipal garbage container is completely filled and trash is spilling onto the footpath. Stray dogs are scattering the garbage. Foul smell is spreading in the entire street.",
      location: "4th Street Corner, Gandhipuram, Coimbatore - 641012",
      zone: "Central Zone",
      category: "Garbage Overflow",
      severity: "Medium",
      status: "Completed",
      department: "Sewage",
      predictedDeadline: "3 days",
      predictedDays: 3.0,
      timeElapsedDays: 1.2,
      aiConfidence: 91,
      reasoning: "Capacity overflows reported by neighborhood network clusters.",
      createdAtText: "3d ago",
      upvotes: 9,
      citizenVerified: true,
      assignedOfficer: "S. Ganeshan",
      localSupervisor: "Savitha CCMC",
      delayProbability: 15,
      beforeImg: "/images/garbage/garbage_default.jpg",
      afterImg: "/images/completed/garbage_fixed_default.jpg",
      geotag: { lat: 11.0175, lng: 76.9740 },
      exifData: {
        latitude: 11.0175,
        longitude: 76.9740,
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        deviceId: "DEV-COI-9003",
        imageFreshnessScore: 98,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 97,
        isAuthentic: true
      },
      verifications: [
        { name: "K. Murugan", votedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), distanceMeters: 25, antiFraudPassed: true }
      ],
      emailDispatched: true,
      emails: [],
      isEscalatedToCommissioner: false,
      area: "Gandhipuram",
      citizenName: "R. Prakash",
      citizenId: "cit-101",
      officerName: "S. Ganeshan",
      urgency: "Medium",
      beforeImage: "/images/garbage/garbage_default.jpg",
      afterImage: "/images/completed/garbage_fixed_default.jpg",
      remarks: "The waste bin was completely cleared, sanitized, and surrounding footpath washed by CCMC sanitation crew.",
      comments: [
        { id: "cmt-9003-1", userId: "cit-103", userName: "K. Meenakshi", userRole: "citizen", text: "Thank you for the quick cleanup!", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];

  list.push(...prakashIssues);

  return list;
};

export const INITIAL_ISSUES: CivicIssue[] = generateSeededIssues();

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { name: "Water", code: "WAT", zone: "Central Zone", slaCompliance: 82.5, totalCases: 12, solvedCases: 10, pendingCases: 2, delayedCases: 0, avgResolutionDays: 1.1 },
  { name: "Road", code: "ROD", zone: "East Zone", slaCompliance: 68.0, totalCases: 15, solvedCases: 11, pendingCases: 4, delayedCases: 1, avgResolutionDays: 2.8 },
  { name: "Sewage", code: "SEW", zone: "South Zone", slaCompliance: 45.0, totalCases: 18, solvedCases: 9, pendingCases: 7, delayedCases: 2, avgResolutionDays: 3.2 },
  { name: "Electricity", code: "ELE", zone: "North Zone", slaCompliance: 88.0, totalCases: 10, solvedCases: 9, pendingCases: 1, delayedCases: 0, avgResolutionDays: 0.7 }
];

export const PIPELINE_STAGES = [
  { id: "auth", label: "1. Citizen Auth", desc: "Government ID OCR & Address geozone mapping" },
  { id: "capture", label: "2. Evidence Capture", desc: "GPS Exif integrity & Anti-deepfake checks" },
  { id: "consensus", label: "3. Local Consensus", desc: "Radius notification & 3-Resident approvals" },
  { id: "email", label: "4. Official Dispatch", desc: "Nodemailer/SendGrid multi-role email triggers" },
  { id: "monitor", label: "5. SLA Dashboard", desc: "Realtime tracking with Formula-based KPI metrics" },
  { id: "escalate", label: "6. Commissioner Gate", desc: "Automated alert trigger for Performance < 30%" }
];
