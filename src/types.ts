export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export type IssueCategory = 
  | "Road Damage" 
  | "Sanitation" 
  | "Water Leakage" 
  | "Streetlight" 
  | "Public Safety" 
  | "Parks & Trees"
  | "Sewage Overflow"
  | "Garbage Overflow"
  | "Streetlight Failure";

export type IssueStatus = 
  | "Intake"
  | "Authenticating"
  | "Prioritized" 
  | "Assigned" 
  | "In Progress"
  | "Pending"
  | "Resolved"
  | "Completed"
  | "Verified" 
  | "Escalated";

export interface ExifMetadata {
  latitude: number;
  longitude: number;
  timestamp: string;
  deviceId: string;
  imageFreshnessScore: number; // 0-100
  locationPlausibilityScore: number; // 0-100
  manipulationCheckScore: number; // 0-100 (high is good, i.e., authentic)
  isAuthentic: boolean;
  rejectionReason?: string;
}

export interface VerifiedCitizen {
  uid: string;
  name: string;
  idType: "Aadhaar" | "Voter ID" | "Utility Bill" | "Property Tax Receipt";
  idNumberMasked: string;
  ocrExtractedAddress?: string;
  address?: string;
  assignedGeozone: string; // e.g. "Central Zone", "East Zone", "West Zone", "North Zone", "South Zone"
  isFraudDetected: boolean;
  fraudAnalysisReasoning?: string;
  faceMatchScore: number; // 0-100
  isVerified: boolean;
  avatarUrl?: string;
  role?: "citizen" | "officer" | "admin";
  trustScore?: number;
  landmark?: string;
  pincode?: string;
  locationVerified?: boolean;
  locationConfidence?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ResidentVerification {
  name: string;
  votedAt: string;
  distanceMeters: number;
  antiFraudPassed: boolean;
  integrityScore?: number;
  verificationMethod?: string;
}

export interface EmailLog {
  id: string;
  issueId: string;
  toEmail: string;
  toRole: "Department Head" | "Area Engineer" | "Local Supervisor" | "Municipal Commissioner";
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  status: "queued" | "sent" | "failed";
}

export interface CivicIssue {
  id: string; // e.g. CIV-COI-1001
  reportNumber: string;
  reporterName: string;
  userId?: string;
  title: string;
  description: string;
  location: string;
  zone: string; // "Central Zone", "East Zone" etc.
  category: IssueCategory;
  severity: SeverityLevel;
  status: IssueStatus;
  department: string;
  predictedDeadline: string; // e.g. "18 hours", "3 days", "6 hours"
  predictedDays: number; // For calculations
  timeElapsedDays: number;
  aiConfidence: number;
  reasoning: string;
  createdAtText: string;
  upvotes: number;
  citizenVerified: boolean;
  assignedOfficer: string;
  localSupervisor: string;
  escalationTarget?: string;
  delayProbability: number;
  beforeImg?: string;
  afterImg?: string;
  geotag: {
    lat: number;
    lng: number;
  };
  exifData?: ExifMetadata;
  verifications: ResidentVerification[];
  emailDispatched: boolean;
  emails: EmailLog[];
  isEscalatedToCommissioner: boolean;
  escalationReportSentAt?: string;
  voters?: string[]; // array of citizen names or uids who have voted/verified proximity on this issue
  upvoters?: string[]; // array of citizen names or uids who have upvoted/liked this issue

  // Conformed Core Complaint structure fields:
  area?: string;
  citizenName?: string;
  citizenId?: string;
  officerName?: string;
  urgency?: string;
  beforeImage?: string;
  afterImage?: string;
  remarks?: string;
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    text: string;
    createdAt: string;
  }>;
  ratings?: number[];
  reviews?: Array<{
    userId: string;
    userName: string;
    rating: number;
    text: string;
    createdAt: string;
  }>;
  createdAt?: string;
  completedAt?: string;
}

export interface DepartmentMetric {
  name: string;
  code: string;
  zone: string;
  slaCompliance: number; // SLA % (Performance % = Solved / Total * 100)
  totalCases: number;
  solvedCases: number;
  pendingCases: number;
  delayedCases: number;
  avgResolutionDays: number;
}

export interface PipelineStep {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
}

