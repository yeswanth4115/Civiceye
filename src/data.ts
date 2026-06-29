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
    name: "Yeswanth kumar D.",
    idType: "Aadhaar",
    idNumberMasked: "XXXX-XXXX-8921",
    ocrExtractedAddress: "14, Sathy Road, Gandhipuram, Coimbatore - 641012",
    assignedGeozone: "Central Zone",
    isFraudDetected: false,
    faceMatchScore: 94.2,
    isVerified: true,
    avatarUrl: "/images/yeswanth_profile.jpg"
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
  { category: "Road Damage" as const, department: "Road", title: "Severe Potholes and Road Crack", desc: "Large crater and deep potholes on the main transit lane, causing severe risk of bike skid accidents and heavy traffic delay during peak hours.", before: "/images/road/road_damage_default.jpeg", after: "/images/completed/road_fixed_default.jpeg" },
  { category: "Water Leakage" as const, department: "Water", title: "Potable Underground Pipeline Leakage", desc: "Main potable water supply pipe leakage detected. Thousands of liters of pure drinking water are being wasted and flooding the surrounding pavements.", before: "/images/water_before.jpg", after: "/images/water_after.jpg" },
  { category: "Garbage Overflow" as const, department: "Sewage", title: "Overflowing Public Waste Dustbin", desc: "Public waste bins are completely overflowing. Garbage has spread on the road for the last three days causing terrible stench, stray dog hazard, and flies.", before: "/images/water/sewage_default.jpg", after: "/images/completed/garbage_fixed_default.jpg" },
  { category: "Streetlight Failure" as const, department: "Electricity", title: "Complete Streetlight Segment Outage", desc: "Multiple consecutive municipal streetlights are not working, casting the entire residential road in total darkness and raising severe safety concerns at night.", before: "/images/streetlight_before.jpg", after: "/images/streetlight_after.jpg" },
  { category: "Sewage Overflow" as const, department: "Sewage", title: "Open Sewage Drain Block and Overflow", desc: "Domestic sewage line is clogged, causing raw contaminated wastewater to overflow into the street and residential pathways. Extremely hazardous public health threat.", before: "/images/sewage_before.jpg", after: "/images/sewage_after.jpg" }
];

export const COIMBATORE_OFFICERS = [
  "S. Ganeshan",
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
  { name: "Yeswanth kumar D.", id: "cit-101" },
  { name: "Vignesh Kumar", id: "cit-102" },
  { name: "K. Meenakshi", id: "cit-103" },
  { name: "Arun Kumar", id: "cit-104" },
  { name: "D. Krishnaveni", id: "cit-105" },
  { name: "S. Karthikeyan", id: "cit-106" },
  { name: "M. Revathi", id: "cit-107" },
  { name: "Anitha Raj", id: "cit-108" }
];

export const getCategoryDefaultImage = (category: string): string => {
  const normalized = (category || '').trim().toLowerCase();
  if (normalized.includes("road")) {
    return "/images/road/road_damage_default.jpeg";
  }
  if (normalized.includes("water")) {
    return "/images/water_before.jpg";
  }
  if (normalized.includes("sewage")) {
    return "/images/sewage_before.jpg";
  }
  if (normalized.includes("streetlight") || normalized.includes("light")) {
    return "/images/streetlight_before.jpg";
  }
  if (normalized.includes("garbage") || normalized.includes("dumping") || normalized.includes("waste")) {
    return "/images/water/sewage_default.jpg";
  }
  return "/images/road_before.jpg";
};

export const getCategoryDefaultAfterImage = (category: string): string => {
  const normalized = (category || '').trim().toLowerCase();
  if (normalized.includes("road")) {
    return "/images/completed/road_fixed_default.jpeg";
  }
  if (normalized.includes("water")) {
    return "/images/water_after.jpg";
  }
  if (normalized.includes("sewage")) {
    return "/images/sewage_after.jpg";
  }
  if (normalized.includes("streetlight") || normalized.includes("light")) {
    return "/images/streetlight_after.jpg";
  }
  if (normalized.includes("garbage") || normalized.includes("dumping") || normalized.includes("waste")) {
    return "/images/completed/garbage_fixed_default.jpg";
  }
  return "/images/completed/road_fixed_default.jpeg";
};

export const getIssueImages = (category: string, area: string, isCompleted: boolean) => {
  const normArea = area.toLowerCase().replace(/\s+/g, '');
  
  if (category === "Road Damage") {
    return {
      before: "/images/road/road_damage_default.jpeg",
      after: isCompleted ? "/images/completed/road_fixed_default.jpeg" : undefined
    };
  }

  if (category === "Water Leakage") {
    return {
      before: "/images/water_before.jpg",
      after: isCompleted ? "/images/water_after.jpg" : undefined
    };
  }

  if (category === "Garbage Overflow") {
    let afterImg = "/images/completed/garbage_fixed_default.jpg";
    if (normArea.includes("podanur")) {
      afterImg = "/images/completed/garbage_fixed_podanur.jpg";
    }
    return {
      before: "/images/water/sewage_default.jpg",
      after: isCompleted ? afterImg : undefined
    };
  }

  if (category === "Streetlight Failure") {
    return {
      before: "/images/streetlight_before.jpg",
      after: isCompleted ? "/images/streetlight_after.jpg" : undefined
    };
  }

  if (category === "Sewage Overflow") {
    return {
      before: "/images/sewage_before.jpg",
      after: isCompleted ? "/images/sewage_after.jpg" : undefined
    };
  }

  return {
    before: "/images/road/road_damage_default.jpeg",
    after: isCompleted ? "/images/completed/road_fixed_default.jpeg" : undefined
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
        { id: `cmt-1-${id}`, userId: "cit-101", userName: "Yeswanth kumar D.", userRole: "citizen", text: "This blocks school vans in the morning. Extremely dangerous.", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
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

  // Append custom sample cases filed by Yeswanth kumar D. (cit-101 / cit-1)
  const yeswanthIssues: CivicIssue[] = [
    {
      id: "CIV-COI-9001",
      reportNumber: "9001",
      reporterName: "Yeswanth kumar D.",
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
      beforeImg: "/images/water_before.jpg",
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
      citizenName: "Yeswanth kumar D.",
      citizenId: "cit-101",
      officerName: "S. Ganeshan",
      urgency: "High",
      beforeImage: "/images/water_before.jpg",
      comments: [
        { id: "cmt-9001-1", userId: "cit-102", userName: "Vignesh Kumar", userRole: "citizen", text: "Water is flowing into nearby shops. Please fix quickly!", createdAt: new Date().toISOString() }
      ],
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9002",
      reportNumber: "9002",
      reporterName: "Yeswanth kumar D.",
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
      beforeImg: "/images/road/road_damage_default.jpeg",
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
      citizenName: "Yeswanth kumar D.",
      citizenId: "cit-101",
      officerName: "",
      urgency: "Critical",
      beforeImage: "/images/road/road_damage_default.jpeg",
      comments: [],
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9003",
      reportNumber: "9003",
      reporterName: "Yeswanth kumar D.",
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
      beforeImg: "/images/water/sewage_default.jpg",
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
      citizenName: "Yeswanth kumar D.",
      citizenId: "cit-101",
      officerName: "S. Ganeshan",
      urgency: "Medium",
      beforeImage: "/images/water/sewage_default.jpg",
      afterImage: "/images/completed/garbage_fixed_default.jpg",
      remarks: "The waste bin was completely cleared, sanitized, and surrounding footpath washed by CCMC sanitation crew.",
      comments: [
        { id: "cmt-9003-1", userId: "cit-103", userName: "K. Meenakshi", userRole: "citizen", text: "Thank you for the quick cleanup!", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9004",
      reportNumber: "9004",
      reporterName: "Yeswanth kumar D.",
      userId: "cit-101",
      title: "Non-Functional Streetlights on Sathy Road",
      description: "Five consecutive streetlights are not working on the main Sathy Road stretch. It becomes pitch dark in the evening, making it unsafe for pedestrians and vehicle riders.",
      location: "Sathy Road, Gandhipuram, Coimbatore - 641012",
      zone: "Central Zone",
      category: "Streetlight Failure",
      severity: "High",
      status: "Completed",
      department: "Electricity",
      predictedDeadline: "18 hours",
      predictedDays: 0.75,
      timeElapsedDays: 0.5,
      aiConfidence: 93,
      reasoning: "Lux sensor reading zero on consecutive lampposts. High correlation with local transit hours.",
      createdAtText: "2d ago",
      upvotes: 18,
      citizenVerified: true,
      assignedOfficer: "B. Ezhilarasan",
      localSupervisor: "Savitha CCMC",
      delayProbability: 8,
      beforeImg: "/images/streetlight_before.jpg",
      afterImg: "/images/streetlight_after.jpg",
      geotag: { lat: 11.0190, lng: 76.9730 },
      exifData: {
        latitude: 11.0190,
        longitude: 76.9730,
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        deviceId: "DEV-COI-9004",
        imageFreshnessScore: 97,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 96,
        isAuthentic: true
      },
      verifications: [
        { name: "K. Murugan", votedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), distanceMeters: 18, antiFraudPassed: true }
      ],
      emailDispatched: true,
      emails: [],
      isEscalatedToCommissioner: false,
      area: "Gandhipuram",
      citizenName: "Yeswanth kumar D.",
      citizenId: "cit-101",
      officerName: "B. Ezhilarasan",
      urgency: "High",
      beforeImage: "/images/streetlight_before.jpg",
      afterImage: "/images/streetlight_after.jpg",
      remarks: "Replaced blown-out LED bulbs and restored cable connection.",
      comments: [],
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "CIV-COI-9005",
      reportNumber: "9005",
      reporterName: "Yeswanth kumar D.",
      userId: "cit-101",
      title: "Blocked Sewage Drain Overflow near Cross Cut Road",
      description: "A major domestic sewage line is completely clogged near the Cross Cut Road entrance, causing contaminated black wastewater to overflow directly onto the walking pavements. Extremely bad odor and a severe health hazard.",
      location: "Cross Cut Road Corner, Gandhipuram, Coimbatore - 641012",
      zone: "Central Zone",
      category: "Sewage Overflow",
      severity: "Critical",
      status: "Pending",
      department: "Sewage",
      predictedDeadline: "6 hours",
      predictedDays: 0.25,
      timeElapsedDays: 0.05,
      aiConfidence: 95,
      reasoning: "High moisture signature and dark pixel color identification from aerial and citizen-sourced imaging.",
      createdAtText: "4h ago",
      upvotes: 32,
      citizenVerified: false,
      assignedOfficer: "",
      localSupervisor: "Savitha CCMC",
      delayProbability: 5,
      beforeImg: "/images/sewage_before.jpg",
      geotag: { lat: 11.0210, lng: 76.9710 },
      exifData: {
        latitude: 11.0210,
        longitude: 76.9710,
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        deviceId: "DEV-COI-9005",
        imageFreshnessScore: 99,
        locationPlausibilityScore: 100,
        manipulationCheckScore: 98,
        isAuthentic: true
      },
      verifications: [],
      emailDispatched: false,
      emails: [],
      isEscalatedToCommissioner: false,
      area: "Gandhipuram",
      citizenName: "Yeswanth kumar D.",
      citizenId: "cit-101",
      officerName: "",
      urgency: "Critical",
      beforeImage: "/images/sewage_before.jpg",
      comments: [],
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    }
  ];

  list.push(...yeswanthIssues);

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
