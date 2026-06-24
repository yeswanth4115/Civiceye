import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { CivicIssue, EmailLog } from "./src/types";

appletServer();

async function appletServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper AI client - Strictly compliant with gemini-api skill instructions
  const getAiClient = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // In-Memory state representing the databases of CIVICEYE
  // Seeded with Coimbatore Cases and Department Metrics matching user requirements
  let issuesDb: CivicIssue[] = [
    {
      id: "CIV-COI-1001",
      reportNumber: "1001",
      reporterName: "R. Prakash",
      title: "Continuous Underground Water Pipeline Leakage",
      description: "Continuous water leakage from underground pipeline near Gandhipuram bus stand causing road flooding and water wastage.",
      location: "14, Sathy Road, Gandhipuram, Coimbatore",
      zone: "Central Zone",
      category: "Water Leakage" as any,
      severity: "High" as any,
      status: "Verified" as any,
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
      emails: [] as any[]
    },
    {
      id: "CIV-COI-1002",
      reportNumber: "1002",
      reporterName: "Vignesh Kumar",
      title: "Large Pothole near PSG Tech Signal",
      description: "Large pothole near PSG Tech signal causing bike accidents during peak hours.",
      location: "Avinashi Road, Peelamedu, Coimbatore",
      zone: "East Zone",
      category: "Road Damage" as any,
      severity: "Medium" as any,
      status: "Assigned" as any,
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
      emails: [] as any[]
    },
    {
      id: "CIV-COI-1003",
      reportNumber: "1003",
      reporterName: "K. Meenakshi",
      title: "Overflowing Garbage Bins on DB Road",
      description: "Garbage bins overflowing for 3 days causing foul smell and stray dog activity.",
      location: "DB Road, RS Puram, Coimbatore",
      zone: "West Zone",
      category: "Sanitation" as any,
      severity: "High" as any,
      status: "In Progress" as any,
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
      emails: [] as any[]
    },
    {
      id: "CIV-COI-1004",
      reportNumber: "1004",
      reporterName: "Arun Kumar",
      title: "Five Consecutive Streetlight Failures",
      description: "Five consecutive streetlights not functioning, creating safety concerns at night.",
      location: "Thudiyalur Main Road, Coimbatore",
      zone: "North Zone",
      category: "Streetlight" as any,
      severity: "Medium" as any,
      status: "Assigned" as any,
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
      emails: [] as any[]
    },
    {
      id: "CIV-COI-1005",
      reportNumber: "1005",
      reporterName: "D. Maheshwari",
      title: "Critical Sewage Overflow into Residential Streets",
      description: "Sewage mixed with rainwater entering residential streets causing health hazards.",
      location: "Podanur Main Road, Coimbatore",
      zone: "South Zone",
      category: "Sewage Overflow" as any,
      severity: "Critical" as any,
      status: "Escalated" as any,
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
      delayProbability: 92,
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
      emails: [] as any[]
    }
  ];

  let departmentMetricsDb = [
    { name: "Water Board", code: "H2O", zone: "Central Zone", slaCompliance: 80.0, totalCases: 5, solvedCases: 4, pendingCases: 1, delayedCases: 0, avgResolutionDays: 1.2 },
    { name: "Municipal Engineering", code: "ENG", zone: "East Zone", slaCompliance: 66.7, totalCases: 3, solvedCases: 2, pendingCases: 1, delayedCases: 0, avgResolutionDays: 3.5 },
    { name: "Sanitation Dept", code: "SAN", zone: "West Zone", slaCompliance: 75.0, totalCases: 4, solvedCases: 3, pendingCases: 1, delayedCases: 0, avgResolutionDays: 0.8 },
    { name: "Electricity Board", code: "EB", zone: "North Zone", slaCompliance: 50.0, totalCases: 2, solvedCases: 1, pendingCases: 1, delayedCases: 0, avgResolutionDays: 1.8 },
    { name: "Sewage Operations", code: "SEW", zone: "South Zone", slaCompliance: 25.0, totalCases: 4, solvedCases: 1, pendingCases: 2, delayedCases: 1, avgResolutionDays: 2.5 }
  ];

  let emailLogsDb: any[] = [];

  // Initialize seeded emails
  issuesDb.forEach(iss => {
    if (iss.id === "CIV-COI-1001") {
      iss.emails = [
        {
          id: "em-1001-a",
          issueId: "CIV-COI-1001",
          toEmail: "m.ganeshan.water@coimbatore.gov.in",
          toRole: "Department Head",
          recipientName: "M. Ganeshan",
          subject: "[URGENT] Water Leakage Escalation - CIV-COI-1001 (Gandhipuram)",
          body: `Respected Sir,\n\nA high-severity Water Leakage issue (CIV-COI-1001) has reached community consensus of 3 verified residents in Gandhipuram, Sathy Road.\n\nIssue Details:\n- ID: CIV-COI-1001\n- Reporter: R. Prakash\n- Location: 14, Sathy Road, Gandhipuram, Coimbatore (Geotag: 11.0183, 76.9725)\n- Description: Continuous water leakage from underground pipeline near Gandhipuram bus stand causing road flooding and water wastage.\n- Target SLA Deadline: 18 hours\n- Area Supervisor Assigned: Yogachithra\n\nPlease dispatch the rapid repair crew immediately to prevent further potable water loss.\n\nRegards,\nCIVICEYE Automated Intelligence`,
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
          body: `Hi Yogachithra,\n\nYou have been assigned as the local supervisor for resolving issue CIV-COI-1001.\nLocation: 14, Sathy Road, Gandhipuram.\nPlease coordinate with crew lead and upload completion image for citizen verification within the 18 hours SLA.\n\nCIVICEYE Control Center`,
          sentAt: "2026-06-23T18:43:00Z",
          status: "sent"
        }
      ];
      emailLogsDb.push(...iss.emails);
    } else if (iss.id === "CIV-COI-1005") {
      iss.emails = [
        {
          id: "em-1005-a",
          issueId: "CIV-COI-1005",
          toEmail: "n.dakshinamurthy.south@coimbatore.gov.in",
          toRole: "Department Head",
          recipientName: "N. Dakshinamurthy",
          subject: "[CRITICAL SEWAGE EXPOSURE] Podanur Main Road - CIV-COI-1005",
          body: `CRITICAL ALERT:\n\nSewage entering households at Podanur Main Road. SLA is 6 hours and elapsed time has exceeded 12 hours without resolution.\n\nDepartment: Sewage Operations\nSupervisor: M.V. Andiappan.\n\nCIVICEYE Emergency Response`,
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
          body: `Respected Commissioner Katta Ravi Teja Sir,\n\nWe are escalating a critical public health failure in the South Zone (Podanur Main Road). Sewage mixed with rainwater has been entering residential streets for over 12 hours. The Sewage Operations department under N. Dakshinamurthy has failed to resolve this within the predicted 6-hour SLA.\n\nEscalation Parameters:\n- Issue ID: CIV-COI-1005\n- Performance index for Sewage Operations: 25.0% (Threshold for escalation is < 30.0%)\n- Worst-performing officer flagged: N. Dakshinamurthy\n- Delay factor: Live public health biohazard exposure\n\nPlease find the attached analytical performance briefing for direct command intervention.\n\nRegards,\nCIVICEYE Commissioner Escalation Engine`,
          sentAt: "2026-06-23T13:12:00Z",
          status: "sent"
        }
      ];
      emailLogsDb.push(...iss.emails);
    }
  });

  // API 1: Verified Citizen Authentication / Onboarding OCR Simulation
  app.post("/api/auth/onboard", async (req, res) => {
    try {
      const { citizenName, idType, idNumber, textAddress } = req.body;
      const ai = getAiClient();

      let geozone = "Central Zone";
      const addrLower = (textAddress || "").toLowerCase();
      if (addrLower.includes("peelamedu") || addrLower.includes("avinashi") || addrLower.includes("east")) {
        geozone = "East Zone";
      } else if (addrLower.includes("rs puram") || addrLower.includes("db road") || addrLower.includes("west")) {
        geozone = "West Zone";
      } else if (addrLower.includes("thudiyalur") || addrLower.includes("north")) {
        geozone = "North Zone";
      } else if (addrLower.includes("podanur") || addrLower.includes("south")) {
        geozone = "South Zone";
      }

      const maskedNum = idNumber 
        ? `${idNumber.slice(0, 4)}-XXXX-XXXX-${idNumber.slice(-4)}`
        : "XXXX-XXXX-3329";

      if (ai) {
        // AI OCR / Fraud Detection flow
        const prompt = `You are a Government Document Verification OCR & Fraud Detection Agent for Coimbatore Municipal Corporation.
Analyze this submitted onboarding profile:
- Name: "${citizenName}"
- Document Type: "${idType}"
- Document Number Input: "${idNumber}"
- Address Specified: "${textAddress}"

Verify if there is any sign of document fraud, compute a face-match confidence score between 80.0% and 99.5%, and verify alignment between the address and the geozone "${geozone}".
Return the response strictly in valid JSON format with these exact keys:
{
  "isFraudDetected": boolean,
  "fraudAnalysisReasoning": string,
  "faceMatchScore": number (e.g. 93.5),
  "ocrExtractedAddress": string (a neatly formatted version of the address)
}
Return only JSON without markdown wrappers.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
          });
          
          let text = response.text || "{}";
          text = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(text);

          const result = {
            uid: `cit-${Math.floor(100 + Math.random() * 900)}`,
            name: citizenName,
            idType,
            idNumberMasked: maskedNum,
            ocrExtractedAddress: parsed.ocrExtractedAddress || textAddress,
            assignedGeozone: geozone,
            isFraudDetected: parsed.isFraudDetected || false,
            fraudAnalysisReasoning: parsed.fraudAnalysisReasoning || "ID verified via biometric database cross-reference. No anomalies found.",
            faceMatchScore: parsed.faceMatchScore || 92.4,
            isVerified: !(parsed.isFraudDetected || false),
            avatarUrl: `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 500000000)}?auto=format&fit=crop&w=150&q=80`
          };

          return res.json({ success: true, citizen: result });
        } catch (err) {
          console.warn("AI Onboarding failed, using heuristic fallback:", err);
        }
      }

      // Fallback
      const fallbackCitizen = {
        uid: `cit-${Math.floor(100 + Math.random() * 900)}`,
        name: citizenName,
        idType,
        idNumberMasked: maskedNum,
        ocrExtractedAddress: textAddress || "Coimbatore, Tamil Nadu",
        assignedGeozone: geozone,
        isFraudDetected: false,
        fraudAnalysisReasoning: "Government digital signature validated successfully. Address matching confirmed with spatial municipal records.",
        faceMatchScore: 93.8,
        isVerified: true,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`
      };

      res.json({ success: true, citizen: fallbackCitizen });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 2: Camera + GPS Evidence Validation
  app.post("/api/camera/validate", async (req, res) => {
    try {
      const { latitude, longitude, imageCategory, title } = req.body;
      const ai = getAiClient();

      // Location boundary checks for Coimbatore (roughly lat: 10.90 to 11.15, lng: 76.85 to 77.10)
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);
      const isWithinCoimbatore = (latNum >= 10.90 && latNum <= 11.15) && (lngNum >= 76.85 && lngNum <= 77.10);

      let isAuthentic = true;
      let reason = "";
      
      if (isNaN(latNum) || isNaN(lngNum) || latNum === 0 || lngNum === 0) {
        isAuthentic = false;
        reason = "REJECTED: GPS Exif Geotag is missing or corrupted. Live-capture required.";
      } else if (!isWithinCoimbatore) {
        isAuthentic = false;
        reason = `REJECTED: Geolocation spatial bounds mismatch (${latNum.toFixed(4)}, ${lngNum.toFixed(4)}). Out of Coimbatore jurisdiction.`;
      }

      if (ai && isAuthentic) {
        const prompt = `You are an AI Forensic Image Analysis model for municipal evidence audit.
Analyze this civic complaint photo submission:
- Category: "${imageCategory}"
- Issue Title: "${title}"
- Captured GPS: ${latitude}, ${longitude}

Assess:
1. Image freshness (Is this likely a live capture or a screenshot of an old image? Score 0-100)
2. Location plausibility (Does this category match typical outdoor civic scenarios? Score 0-100)
3. Manipulation / Deepfake detection (Is there evidence of gallery spoofing, metadata tampering, or photoshop filters? Score 0-100, where 100 means fully authentic and untouched)

Return the result strictly in valid JSON format with these exact keys:
{
  "imageFreshnessScore": number,
  "locationPlausibilityScore": number,
  "manipulationCheckScore": number,
  "isAuthentic": boolean,
  "rejectionReason": string (empty if authentic)
}
Return only JSON without markdown wrappers.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
          });
          
          let text = response.text || "{}";
          text = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(text);
          
          return res.json({
            success: true,
            exifData: {
              latitude: latNum,
              longitude: lngNum,
              timestamp: new Date().toISOString(),
              deviceId: `DEV-MUNI-${Math.floor(1000 + Math.random() * 9000)}`,
              imageFreshnessScore: parsed.imageFreshnessScore || 95,
              locationPlausibilityScore: parsed.locationPlausibilityScore || 98,
              manipulationCheckScore: parsed.manipulationCheckScore || 96,
              isAuthentic: parsed.isAuthentic !== false,
              rejectionReason: parsed.rejectionReason || ""
            }
          });
        } catch (err) {
          console.warn("AI camera validation failed, using heuristic:", err);
        }
      }

      // Fallback or boundary rejection response
      res.json({
        success: true,
        exifData: {
          latitude: latNum,
          longitude: lngNum,
          timestamp: new Date().toISOString(),
          deviceId: `DEV-MUNI-SYS-${Math.floor(1000 + Math.random() * 9000)}`,
          imageFreshnessScore: isAuthentic ? 94 : 20,
          locationPlausibilityScore: isAuthentic ? 97 : 15,
          manipulationCheckScore: isAuthentic ? 96 : 30,
          isAuthentic,
          rejectionReason: reason
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 3: Radical Consensus Vote + Bot Pattern Anti-Fraud Layer
  app.post("/api/consensus/validate-vote", async (req, res) => {
    try {
      const { issueId, voterName, voterLat, voterLng, issueLat, issueLng } = req.body;
      
      // Calculate distance (Haversine formula approximation)
      const R = 6371e3; // meters
      const phi1 = (voterLat * Math.PI) / 180;
      const phi2 = (issueLat * Math.PI) / 180;
      const deltaPhi = ((issueLat - voterLat) * Math.PI) / 180;
      const deltaLambda = ((issueLng - voterLng) * Math.PI) / 180;

      const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // in meters

      // Bot pattern/Coordinated manipulation check
      // E.g., multiple votes from the exact same GPS or instant timestamps
      const timestamp = new Date().toISOString();
      const isCoordinated = distance < 1; // unrealistic voting from the exact same meter

      let antiFraudPassed = true;
      let errorReason = "";

      if (distance > 2000) {
        antiFraudPassed = false;
        errorReason = `Voter is too far (${(distance / 1000).toFixed(2)} km). Must be within 2 km radius of the civic issue boundary.`;
      } else if (isCoordinated) {
        antiFraudPassed = false;
        errorReason = "Anti-fraud block: Coordinated GPS spoofing detected. Vote matching incident coordinates perfectly.";
      }

      res.json({
        success: true,
        vote: {
          name: voterName,
          votedAt: timestamp,
          distanceMeters: Math.round(distance),
          antiFraudPassed,
          errorReason
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 4: Automated Department Email Engine trigger
  app.post("/api/email/trigger", async (req, res) => {
    try {
      const { issueId } = req.body;
      const issue = issuesDb.find(i => i.id === issueId);

      if (!issue) {
        return res.status(404).json({ success: false, error: "Issue not found." });
      }

      // Map roles & contacts
      let deptHead = "M. Ganeshan";
      let deptEmail = "m.ganeshan.water@coimbatore.gov.in";
      let supervisor = "Yogachithra";
      let supEmail = "yogachithra.gandhipuram@coimbatore.gov.in";

      if (issue.category === "Road Damage") {
        deptHead = "K. Dakshinamurthy";
        deptEmail = "k.dakshinamurthy.east@coimbatore.gov.in";
        supervisor = "Ezhil";
        supEmail = "ezhil.peelamedu@coimbatore.gov.in";
      } else if (issue.category === "Sanitation") {
        deptHead = "S. Narmadha";
        deptEmail = "s.narmadha.san@coimbatore.gov.in";
        supervisor = "C. Veeran";
        supEmail = "c.veeran.rspuram@coimbatore.gov.in";
      } else if (issue.category === "Streetlight") {
        deptHead = "S.N. Shanmugam";
        deptEmail = "s.n.shanmugam.north@coimbatore.gov.in";
        supervisor = "Savitha";
        supEmail = "savitha.thudiyalur@coimbatore.gov.in";
      } else if (issue.category === "Sewage Overflow") {
        deptHead = "N. Dakshinamurthy";
        deptEmail = "n.dakshinamurthy.south@coimbatore.gov.in";
        supervisor = "M.V. Andiappan";
        supEmail = "mv.andiappan.podanur@coimbatore.gov.in";
      }

      const timestamp = new Date().toISOString();
      const generatedEmails: any[] = [
        {
          id: `em-${issueId}-head-${Math.floor(100 + Math.random() * 900)}`,
          issueId,
          toEmail: deptEmail,
          toRole: "Department Head",
          recipientName: deptHead,
          subject: `[ACTION REQUIRED] Community Consensus Approved: ${issue.category} - ${issue.id}`,
          body: `Respected Sir,\n\nA validated civic grievance (${issue.id}) has successfully attained the required 3 unique resident confirmations. This ticket is now escalated for immediate resolution dispatch.\n\nIssue Parameters:\n- Category: ${issue.category}\n- Severity Level: ${issue.severity}\n- Location: ${issue.location}\n- Geotag: ${issue.geotag.lat}, ${issue.geotag.lng}\n- Predicted SLA Timeframe: ${issue.predictedDeadline}\n- Active Local Supervisor: ${supervisor}\n\nAll verified resident telemetry is attached in compliance with municipal laws.\n\nRegards,\nCIVICEYE Automation Gateway`,
          sentAt: timestamp,
          status: "sent"
        },
        {
          id: `em-${issueId}-sup-${Math.floor(100 + Math.random() * 900)}`,
          issueId,
          toEmail: supEmail,
          toRole: "Local Supervisor",
          recipientName: supervisor,
          subject: `[TASK ASSIGNED] Field Inspection Dispatch: ${issue.category} - ${issue.id}`,
          body: `Dear ${supervisor},\n\nYou have been dispatched as the primary local supervisor for resolving CIVICEYE report ${issue.id}.\n\nLocation: ${issue.location}\nSLA Deadline: ${issue.predictedDeadline}\n\nPlease inspect the field coordinates, collaborate with the rapid engineering crew, and document completion photos once fixed.\n\nRegards,\nCIVICEYE Field Tasker`,
          sentAt: timestamp,
          status: "sent"
        }
      ];

      issue.emails = [...issue.emails, ...generatedEmails];
      issue.emailDispatched = true;
      emailLogsDb.push(...generatedEmails);

      res.json({ success: true, emails: generatedEmails });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 5: Commissioner Escalation Logic
  app.post("/api/escalate/commissioner", async (req, res) => {
    try {
      const { issueId, departmentCode } = req.body;
      const issue = issuesDb.find(i => i.id === issueId);
      
      const dept = departmentMetricsDb.find(d => d.code === departmentCode) || {
        name: "Sewage Operations",
        code: "SEW",
        slaCompliance: 25.0,
        totalCases: 4,
        solvedCases: 1,
        pendingCases: 2,
        delayedCases: 1,
        avgResolutionDays: 2.5
      };

      const timestamp = new Date().toISOString();
      const commissionerEmail: EmailLog = {
        id: `em-${issueId || 'bulk'}-comm-${Math.floor(100 + Math.random() * 900)}`,
        issueId: issueId || "CIV-COI-GEN",
        toEmail: "katta.raviteja.commissioner@coimbatore.gov.in",
        toRole: "Municipal Commissioner",
        recipientName: "Katta Ravi Teja",
        subject: `[CRITICAL ESCALATION] Performance Failure in ${dept.name} - Under 30% Compliance`,
        body: `Respected Commissioner Katta Ravi Teja Sir,\n\nWe are escalating an operational alert for the South Zone. The performance index of ${dept.name} (${dept.code}) has slipped to ${dept.slaCompliance.toFixed(1)}%, which triggers immediate commissioner oversight under SLA regulations.\n\nAnalytical Briefing:\n- Active Unresolved Grievances: ${dept.pendingCases}\n- Overdue / Delayed Cases: ${dept.delayedCases}\n- Average Resolution Span: ${dept.avgResolutionDays} days\n- Worst-performing official flagged: N. Dakshinamurthy\n\nDelayed List Detail:\n- ID: ${issue ? issue.id : 'CIV-COI-1005'}\n- Description: ${issue ? issue.description : 'Sewage mixed with rainwater entering residential streets.'}\n- Location: ${issue ? issue.location : 'Podanur Main Road'}\n- Target Deadline: ${issue ? issue.predictedDeadline : '6 hours'} (Time elapsed exceeds 12h)\n\nWe recommend immediate command intervention, resource reallocation, and performance reviews for the assigned department leads.\n\nRegards,\nCIVICEYE Automated Escalation Engine`,
        sentAt: timestamp,
        status: "sent"
      };

      if (issue) {
        issue.isEscalatedToCommissioner = true;
        issue.status = "Escalated";
        issue.emails.push(commissionerEmail);
      }
      emailLogsDb.push(commissionerEmail);

      // Decrement performance to showcase real-time changes
      dept.slaCompliance = Math.max(15, dept.slaCompliance - 5);
      dept.delayedCases += 1;

      res.json({ success: true, email: commissionerEmail });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Fetch updated dataset
  app.get("/api/issues", (req, res) => {
    res.json({ success: true, issues: issuesDb, departments: departmentMetricsDb, emails: emailLogsDb });
  });

  // Ticket AI Auto-Classification and Smart Routing
  app.post("/api/classify", async (req, res) => {
    try {
      const { title, description, location } = req.body;
      const ai = getAiClient();

      if (ai) {
        const prompt = `You are an AI Ticket Routing model for Coimbatore Municipal Corporation.
Analyze this civic complaint details:
- Title: "${title}"
- Description: "${description}"
- Location: "${location}"

Determine:
1. Category: Must be one of the following exact strings: "Water Leakage", "Road Damage", "Sanitation", "Streetlight", "Sewage Overflow", "Public Safety"
2. Severity: Must be one of: "Low", "Medium", "High", "Critical"
3. Department: Must be one of: "Water Board", "Municipal Engineering", "Sanitation Dept", "Electricity Board", "Sewage Operations"
4. SLA Days: Recommend realistic resolution speed in days as a float (e.g. 0.25, 0.5, 1.0, 3.0)
5. SLA Deadline Text: Recommend a user-friendly SLA string (e.g. "6 hours", "12 hours", "24 hours", "3 days")
6. Reasoning: Provide a highly professional, human-like automated dispatch routing memo. Include details about which area supervisor should handle it.

Return the result strictly in valid JSON format with these exact keys:
{
  "category": "Water Leakage" | "Road Damage" | "Sanitation" | "Streetlight" | "Sewage Overflow" | "Public Safety",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "department": "Water Board" | "Municipal Engineering" | "Sanitation Dept" | "Electricity Board" | "Sewage Operations",
  "predictedDays": number,
  "predictedDeadline": string,
  "aiConfidence": number (between 85 and 99.5),
  "reasoning": string
}
Return only JSON without markdown wrappers.`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            }
          });

          let text = response.text || "{}";
          text = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(text);

          return res.json({
            success: true,
            classification: {
              category: parsed.category || "Public Safety",
              severity: parsed.severity || "Medium",
              department: parsed.department || "Municipal Engineering",
              predictedDays: parsed.predictedDays || 3.0,
              predictedDeadline: parsed.predictedDeadline || "3 days",
              aiConfidence: parsed.aiConfidence || 94.5,
              reasoning: parsed.reasoning || "Automatic intake heuristic routing."
            }
          });
        } catch (err) {
          console.warn("AI ticket classification failed, using heuristic fallback:", err);
        }
      }

      // Fallback
      const lower = `${title} ${description}`.toLowerCase();
      let category = 'Public Safety';
      let department = 'Municipal Engineering';
      let severity = 'Medium';
      let predictedDays = 3.0;
      let predictedDeadline = "3 days";

      if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak')) {
        category = 'Water Leakage'; department = 'Water Board'; severity = 'High'; predictedDays = 0.75; predictedDeadline = "18 hours";
      } else if (lower.includes('pothole') || lower.includes('road')) {
        category = 'Road Damage'; department = 'Municipal Engineering'; severity = 'Medium'; predictedDays = 3.0; predictedDeadline = "3 days";
      } else if (lower.includes('trash') || lower.includes('garbage') || lower.includes('dump')) {
        category = 'Sanitation'; department = 'Sanitation Dept'; severity = 'High'; predictedDays = 0.5; predictedDeadline = "12 hours";
      } else if (lower.includes('light') || lower.includes('dark')) {
        category = 'Streetlight'; department = 'Electricity Board'; severity = 'Medium'; predictedDays = 1.0; predictedDeadline = "24 hours";
      } else if (lower.includes('sewage') || lower.includes('gutter') || lower.includes('drain')) {
        category = 'Sewage Overflow'; department = 'Sewage Operations'; severity = 'Critical'; predictedDays = 0.25; predictedDeadline = "6 hours";
      }

      res.json({
        success: true,
        classification: {
          category,
          severity,
          predictedDays,
          predictedDeadline,
          department,
          aiConfidence: 91.2,
          reasoning: `Intake routing engine auto-classified ${category} and routed ticket to ${department} with ± ${predictedDeadline} SLA.`
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update existing issues state (allows creating and voting dynamically)
  app.post("/api/issues/create", async (req, res) => {
    try {
      const { issue } = req.body;
      const newIssue = {
        ...issue,
        emails: issue.emails || [],
        verifications: issue.verifications || [],
        emailDispatched: issue.emailDispatched || false,
        isEscalatedToCommissioner: issue.isEscalatedToCommissioner || false
      };
      
      issuesDb = [newIssue, ...issuesDb];

      // Update total department cases
      const dept = departmentMetricsDb.find(d => d.name === newIssue.department);
      if (dept) {
        dept.totalCases += 1;
        dept.pendingCases += 1;
        dept.slaCompliance = Math.round((dept.solvedCases / dept.totalCases) * 100);
      }

      res.json({ success: true, issue: newIssue, departments: departmentMetricsDb });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Real API endpoint to handle upvotes/likes with citizen duplicate prevention
  app.post("/api/issues/upvote", async (req, res) => {
    try {
      const { issueId, citizenUid, citizenName } = req.body;
      const issue = issuesDb.find(i => i.id === issueId);
      if (!issue) {
        return res.status(404).json({ success: false, error: "Issue not found" });
      }

      if (!issue.upvoters) {
        issue.upvoters = [];
      }

      const voterIdentifier = citizenUid || citizenName || "anonymous";

      if (issue.upvoters.includes(voterIdentifier)) {
        return res.json({ success: false, error: "You have already upvoted/liked this issue!" });
      }

      issue.upvoters.push(voterIdentifier);
      issue.upvotes += 1;

      res.json({ success: true, issues: issuesDb });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/issues/vote-simulate", async (req, res) => {
    try {
      const { issueId, verification } = req.body;
      const issue = issuesDb.find(i => i.id === issueId);
      if (issue) {
        if (!issue.voters) {
          issue.voters = [];
        }

        const voterName = verification.name;
        const alreadyVoted = issue.voters.includes(voterName) || 
                            issue.verifications.some(v => v.name.toLowerCase() === voterName.toLowerCase());

        if (alreadyVoted) {
          return res.json({ success: false, error: "You have already cast a proximity verification vote on this issue!" });
        }

        issue.voters.push(voterName);
        issue.verifications = [...issue.verifications, verification];
        issue.upvotes += 1;

        // Auto trigger email engine if reached 3 verifications
        if (issue.verifications.length >= 3 && !issue.emailDispatched) {
          // Do a mock dispatch
          issue.emailDispatched = true;
          // Auto trigger dispatch code
          const dept = issue.department;
          let deptHead = "M. Ganeshan";
          let deptEmail = "m.ganeshan.water@coimbatore.gov.in";
          let supervisor = "Yogachithra";
          let supEmail = "yogachithra.gandhipuram@coimbatore.gov.in";

          if (issue.category === "Road Damage") {
            deptHead = "K. Dakshinamurthy";
            deptEmail = "k.dakshinamurthy.east@coimbatore.gov.in";
            supervisor = "Ezhil";
            supEmail = "ezhil.peelamedu@coimbatore.gov.in";
          } else if (issue.category === "Sanitation") {
            deptHead = "S. Narmadha";
            deptEmail = "s.narmadha.san@coimbatore.gov.in";
            supervisor = "C. Veeran";
            supEmail = "c.veeran.rspuram@coimbatore.gov.in";
          } else if (issue.category === "Streetlight") {
            deptHead = "S.N. Shanmugam";
            deptEmail = "s.n.shanmugam.north@coimbatore.gov.in";
            supervisor = "Savitha";
            supEmail = "savitha.thudiyalur@coimbatore.gov.in";
          } else if (issue.category === "Sewage Overflow") {
            deptHead = "N. Dakshinamurthy";
            deptEmail = "n.dakshinamurthy.south@coimbatore.gov.in";
            supervisor = "M.V. Andiappan";
            supEmail = "mv.andiappan.podanur@coimbatore.gov.in";
          }

          const timestamp = new Date().toISOString();
          const autoEmails: EmailLog[] = [
            {
              id: `em-${issueId}-head-auto`,
              issueId,
              toEmail: deptEmail,
              toRole: "Department Head",
              recipientName: deptHead,
              subject: `[ACTION REQUIRED] Community Consensus Approved: ${issue.category} - ${issue.id}`,
              body: `Respected Sir,\n\nA validated civic grievance (${issue.id}) has successfully attained the required 3 unique resident confirmations. This ticket is now escalated for immediate resolution dispatch.\n\nIssue Parameters:\n- Category: ${issue.category}\n- Severity Level: ${issue.severity}\n- Location: ${issue.location}\n- Geotag: ${issue.geotag.lat}, ${issue.geotag.lng}\n- Predicted SLA Timeframe: ${issue.predictedDeadline}\n- Active Local Supervisor: ${supervisor}\n\nAll verified resident telemetry is attached in compliance with municipal laws.\n\nRegards,\nCIVICEYE Automation Gateway`,
              sentAt: timestamp,
              status: "sent"
            },
            {
              id: `em-${issueId}-sup-auto`,
              issueId,
              toEmail: supEmail,
              toRole: "Local Supervisor",
              recipientName: supervisor,
              subject: `[TASK ASSIGNED] Field Inspection Dispatch: ${issue.category} - ${issue.id}`,
              body: `Dear ${supervisor},\n\nYou have been dispatched as the primary local supervisor for resolving CIVICEYE report ${issue.id}.\nLocation: ${issue.location}\nSLA Deadline: ${issue.predictedDeadline}\n\nPlease inspect the field coordinates, collaborate with the rapid engineering crew, and document completion photos once fixed.\n\nRegards,\nCIVICEYE Field Tasker`,
              sentAt: timestamp,
              status: "sent"
            }
          ];

          issue.emails = [...issue.emails, ...autoEmails];
          emailLogsDb.push(...autoEmails);
        }

        // Auto trigger Commissioner Escalation if Sewage Operations drops below 30% or delays are critical
        if (issue.severity === "Critical" && issue.timeElapsedDays >= issue.predictedDays && !issue.isEscalatedToCommissioner) {
          issue.status = "Escalated";
        }
      }
      res.json({ success: true, issues: issuesDb, departments: departmentMetricsDb, emails: emailLogsDb });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Verify / Resolve Issue simulation (changes SLA metrics dynamically)
  app.post("/api/issues/resolve-simulate", async (req, res) => {
    try {
      const { issueId } = req.body;
      const issue = issuesDb.find(i => i.id === issueId);
      if (issue) {
        issue.status = "Verified";
        issue.citizenVerified = true;
        // Set realistic category-specific after image
        if (issue.category === "Water Leakage") {
          issue.afterImg = "/images/water_after.jpg";
        } else if (issue.category === "Road Damage") {
          issue.afterImg = "/images/road_after.jpg";
        } else if (issue.category === "Sanitation") {
          issue.afterImg = "/images/garbage_after.jpg";
        } else if (issue.category === "Streetlight") {
          issue.afterImg = "/images/streetlight_after.jpg";
        } else if (issue.category === "Sewage Overflow") {
          issue.afterImg = "/images/sewage_after.jpg";
        } else {
          issue.afterImg = "/images/road_after.jpg";
        }

        // Update department metrics to reflect a solved case
        const dept = departmentMetricsDb.find(d => d.name === issue.department);
        if (dept) {
          dept.solvedCases = Math.min(dept.totalCases, dept.solvedCases + 1);
          dept.pendingCases = Math.max(0, dept.pendingCases - 1);
          dept.slaCompliance = Math.round((dept.solvedCases / dept.totalCases) * 100);
        }
      }
      res.json({ success: true, issues: issuesDb, departments: departmentMetricsDb });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicEye Server running on port ${PORT}`);
  });
}
