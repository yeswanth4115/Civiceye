import fs from 'fs';
import path from 'path';

export interface UserTable {
  id: string;
  name: string;
  phone: string;
  password?: string;
  address: string;
  zone: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl: string;
  role: 'citizen' | 'officer';
  createdAt: string;
  landmark?: string;
  pincode?: string;
  locationVerified?: boolean;
  locationConfidence?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProofTable {
  id: string;
  userId: string;
  documentType: 'Aadhaar' | 'Voter ID' | 'Utility Bill' | 'Property Tax Receipt';
  documentNumber: string;
  fileName: string;
  extractedName: string;
  extractedAddress: string;
  faceMatchScore: number;
  fraudDetected: boolean;
  reasoning: string;
  createdAt: string;
}

export interface ComplaintTable {
  id: string;
  reportNumber: string;
  userId: string;
  reporterName: string;
  title: string;
  description: string;
  category: 'Road Damage' | 'Sanitation' | 'Water Leakage' | 'Streetlight' | 'Public Safety' | 'Parks & Trees' | 'Sewage Overflow' | 'Garbage Overflow' | 'Streetlight Failure';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Under Review' | 'Verified' | 'Assigned' | 'In Progress' | 'Completed' | 'Escalated';
  zone: string;
  beforeImg: string;
  afterImg?: string;
  lat: number;
  lng: number;
  createdAt: string;
  assignedOfficerId?: string;
  assignedDepartmentId?: string;
  delayProbability: number;
  predictedDays: number;
  predictedDeadline: string;
  aiConfidence: number;
  aiReasoning: string;
  isEscalatedToCommissioner: boolean;
  escalationReportSentAt?: string;
  verificationsCount: number;
  voters: string[]; // UIDs or names of citizens who verified proximity
  upvoters: string[]; // UIDs of citizens who liked
}

export interface ComplaintVerificationTable {
  id: string;
  complaintId: string;
  userId: string;
  residentName: string;
  distanceMeters: number;
  antiFraudPassed: boolean;
  votedAt: string;
  integrityScore?: number;
  verificationMethod?: string;
}

export interface OfficerTable {
  id: string;
  name: string;
  departmentId: string;
  email: string;
  phone: string;
  efficiencyScore: number;
  avatarUrl: string;
}

export interface DepartmentTable {
  id: string;
  name: string;
  code: string;
  zone: string;
  slaCompliance: number;
  totalCases: number;
  solvedCases: number;
  pendingCases: number;
  delayedCases: number;
  avgResolutionDays: number;
}

export interface EscalationTable {
  id: string;
  complaintId: string;
  escalatedAt: string;
  reason: string;
  departmentId: string;
  status: 'active' | 'resolved';
}

export interface CompletionImageTable {
  id: string;
  complaintId: string;
  imageUrl: string;
  remarks: string;
  officerId: string;
  completedAt: string;
}

export interface DatabaseState {
  users: UserTable[];
  proofs: ProofTable[];
  complaints: ComplaintTable[];
  complaint_verifications: ComplaintVerificationTable[];
  officers: OfficerTable[];
  departments: DepartmentTable[];
  escalations: EscalationTable[];
  completion_images: CompletionImageTable[];
}

const DB_FILE = path.join(process.cwd(), 'database.json');

export class CivicDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = {
      users: [],
      proofs: [],
      complaints: [],
      complaint_verifications: [],
      officers: [],
      departments: [],
      escalations: [],
      completion_images: []
    };
    this.load();
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(data);
        return;
      } catch (err) {
        console.error("Failed to read database.json, re-initializing", err);
      }
    }
    this.seed();
    this.save();
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed to write database.json", err);
    }
  }

  private seed() {
    console.log("Seeding Database...");
    
    // Seed Departments
    this.state.departments = [
      { id: "dept-1", name: "Water Board", code: "COI-WTB", zone: "Central Zone", slaCompliance: 92, totalCases: 24, solvedCases: 18, pendingCases: 5, delayedCases: 1, avgResolutionDays: 1.2 },
      { id: "dept-2", name: "Municipal Engineering", code: "COI-ENG", zone: "East Zone", slaCompliance: 84, totalCases: 18, solvedCases: 12, pendingCases: 4, delayedCases: 2, avgResolutionDays: 3.5 },
      { id: "dept-3", name: "Sanitation Dept", code: "COI-SAN", zone: "West Zone", slaCompliance: 96, totalCases: 32, solvedCases: 28, pendingCases: 3, delayedCases: 1, avgResolutionDays: 0.6 },
      { id: "dept-4", name: "Streetlight Operations", code: "COI-SLO", zone: "North Zone", slaCompliance: 90, totalCases: 15, solvedCases: 11, pendingCases: 3, delayedCases: 1, avgResolutionDays: 1.8 },
      { id: "dept-5", name: "Sewage Operations", code: "COI-SWG", zone: "South Zone", slaCompliance: 78, totalCases: 12, solvedCases: 8, pendingCases: 3, delayedCases: 1, avgResolutionDays: 2.1 }
    ];

    // Seed Officers
    this.state.officers = [
      { id: "off-1", name: "M. Ganeshan", departmentId: "dept-1", email: "ganeshan.water@coimbatore.gov.in", phone: "+91 94432 00101", efficiencyScore: 94, avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" },
      { id: "off-2", name: "K. Dakshinamurthy", departmentId: "dept-2", email: "dakshin.eng@coimbatore.gov.in", phone: "+91 94432 00102", efficiencyScore: 82, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { id: "off-3", name: "S. Narmadha", departmentId: "dept-3", email: "narmadha.san@coimbatore.gov.in", phone: "+91 94432 00103", efficiencyScore: 98, avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" },
      { id: "off-4", name: "B. Ezhilarasan", departmentId: "dept-4", email: "ezhil.light@coimbatore.gov.in", phone: "+91 94432 00104", efficiencyScore: 89, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
      { id: "off-5", name: "V. Shakthivel", departmentId: "dept-5", email: "shakthi.sewage@coimbatore.gov.in", phone: "+91 94432 00105", efficiencyScore: 81, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
    ];

    // Seed default Users (a citizen and an officer)
    this.state.users = [
      {
        id: "cit-1",
        name: "Yeswanth kumar D.",
        phone: "9876543210",
        password: "password123",
        address: "14, Sathy Road, Gandhipuram, Coimbatore - 641012",
        zone: "Central Zone",
        trustScore: 85,
        isVerified: true,
        avatarUrl: "/images/yeswanth_profile.jpg",
        role: "citizen",
        createdAt: "2026-01-10T10:00:00Z"
      },
      {
        id: "cit-2",
        name: "Vignesh Kumar",
        phone: "9876543211",
        password: "password123",
        address: "82, Avinashi Road, Peelamedu, Coimbatore - 641004",
        zone: "East Zone",
        trustScore: 90,
        isVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        role: "citizen",
        createdAt: "2026-02-15T10:00:00Z"
      },
      {
        id: "usr-off-1",
        name: "Officer Ganeshan",
        phone: "9999999999",
        password: "password123",
        address: "Coimbatore Corporation Office, Town Hall",
        zone: "Central Zone",
        trustScore: 100,
        isVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
        role: "officer",
        createdAt: "2026-01-01T10:00:00Z"
      }
    ];

    // Seed Proofs for verified users
    this.state.proofs = [
      {
        id: "proof-1",
        userId: "cit-1",
        documentType: "Aadhaar",
        documentNumber: "552388129940",
        fileName: "aadhaar_scanned.png",
        extractedName: "Yeswanth kumar D.",
        extractedAddress: "14, Sathy Road, Gandhipuram, Coimbatore - 641012",
        faceMatchScore: 94.5,
        fraudDetected: false,
        reasoning: "OCR Extraction succeeded. Biometric profile verification matched live sample with high probability.",
        createdAt: "2026-01-10T10:00:00Z"
      },
      {
        id: "proof-2",
        userId: "cit-2",
        documentType: "Voter ID",
        documentNumber: "TN/03/021/45921",
        fileName: "voter_scanned.png",
        extractedName: "Vignesh Kumar",
        extractedAddress: "82, Avinashi Road, Peelamedu, Coimbatore - 641004",
        faceMatchScore: 92.1,
        fraudDetected: false,
        reasoning: "Voter ID card scan matched. Address reversibility score is optimal.",
        createdAt: "2026-02-15T10:00:00Z"
      }
    ];

    // Seed Complaints
    this.state.complaints = [
      {
        id: "CIV-COI-1001",
        reportNumber: "1001",
        userId: "cit-1",
        reporterName: "Yeswanth kumar D.",
        title: "Continuous Underground Water Pipeline Leakage",
        description: "Continuous water leakage from underground pipeline near Gandhipuram bus stand causing road flooding and water wastage.",
        category: "Water Leakage",
        severity: "High",
        status: "Completed",
        zone: "Central Zone",
        beforeImg: "/images/water_before.jpg",
        afterImg: "/images/water_after.jpg",
        lat: 11.0183,
        lng: 76.9725,
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        assignedOfficerId: "off-1",
        assignedDepartmentId: "dept-1",
        delayProbability: 15,
        predictedDays: 0.75,
        predictedDeadline: "18 hours",
        aiConfidence: 96.5,
        aiReasoning: "Hydraulic pressure flow near major commercial hub detected via audio sensor telemetry and visual volume estimation.",
        isEscalatedToCommissioner: false,
        verificationsCount: 3,
        voters: ["Vignesh Kumar", "S. Karthikeyan", "M. Revathi"],
        upvoters: ["cit-1", "cit-2"]
      },
      {
        id: "CIV-COI-1002",
        reportNumber: "1002",
        userId: "cit-2",
        reporterName: "Vignesh Kumar",
        title: "Large Pothole near PSG Tech Signal",
        description: "Large pothole near PSG Tech signal causing bike accidents during peak hours.",
        category: "Road Damage",
        severity: "Medium",
        status: "Assigned",
        zone: "East Zone",
        beforeImg: "/images/road/road_damage_default.jpeg",
        lat: 11.0287,
        lng: 77.0024,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        assignedOfficerId: "off-2",
        assignedDepartmentId: "dept-2",
        delayProbability: 25,
        predictedDays: 3.0,
        predictedDeadline: "3 days",
        aiConfidence: 94.2,
        aiReasoning: "Deep crater on a high-speed transit arterial. High traffic flow density elevates accident risk score.",
        isEscalatedToCommissioner: false,
        verificationsCount: 1,
        voters: ["Yeswanth kumar D."],
        upvoters: ["cit-2"]
      },
      {
        id: "CIV-COI-1003",
        reportNumber: "1003",
        userId: "cit-1",
        reporterName: "Yeswanth kumar D.",
        title: "Overflowing Garbage Bins on DB Road",
        description: "Garbage bins overflowing for 3 days causing foul smell and stray dog activity.",
        category: "Garbage Overflow",
        severity: "High",
        status: "Pending",
        zone: "West Zone",
        beforeImg: "/images/completed/garbage_fixed_ukkadam.jpg",
        lat: 11.0084,
        lng: 76.9512,
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        assignedDepartmentId: "dept-3",
        delayProbability: 12,
        predictedDays: 0.5,
        predictedDeadline: "12 hours",
        aiConfidence: 97.1,
        aiReasoning: "Solid waste accumulation in highly populated shopping zone triggers rapid public health vectors.",
        isEscalatedToCommissioner: false,
        verificationsCount: 0,
        voters: [],
        upvoters: []
      },
      {
        id: "CIV-COI-1004",
        reportNumber: "1004",
        userId: "cit-1",
        reporterName: "Yeswanth kumar D.",
        title: "Non-Functional Streetlights on Sathy Road",
        description: "Five consecutive streetlights are not working on the main Sathy Road stretch. It becomes pitch dark in the evening, making it unsafe for pedestrians and vehicle riders.",
        category: "Streetlight Failure",
        severity: "High",
        status: "Completed",
        zone: "Central Zone",
        beforeImg: "/images/streetlight_before.jpg",
        afterImg: "/images/streetlight_after.jpg",
        lat: 11.0190,
        lng: 76.9730,
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        assignedOfficerId: "off-4",
        assignedDepartmentId: "dept-4",
        delayProbability: 8,
        predictedDays: 0.75,
        predictedDeadline: "18 hours",
        aiConfidence: 93.0,
        aiReasoning: "Lux sensor reading zero on consecutive lampposts. High correlation with local transit hours.",
        isEscalatedToCommissioner: false,
        verificationsCount: 1,
        voters: ["K. Murugan"],
        upvoters: ["cit-1"]
      },
      {
        id: "CIV-COI-1005",
        reportNumber: "1005",
        userId: "cit-1",
        reporterName: "Yeswanth kumar D.",
        title: "Blocked Sewage Drain Overflow near Cross Cut Road",
        description: "A major domestic sewage line is completely clogged near the Cross Cut Road entrance, causing contaminated black wastewater to overflow directly onto the walking pavements.",
        category: "Sewage Overflow",
        severity: "Critical",
        status: "Pending",
        zone: "Central Zone",
        beforeImg: "/images/sewage_before.jpg",
        lat: 11.0210,
        lng: 76.9710,
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        assignedDepartmentId: "dept-5",
        delayProbability: 5,
        predictedDays: 0.25,
        predictedDeadline: "6 hours",
        aiConfidence: 95.0,
        aiReasoning: "High moisture signature and dark pixel color identification from aerial and citizen-sourced imaging.",
        isEscalatedToCommissioner: false,
        verificationsCount: 0,
        voters: [],
        upvoters: []
      }
    ];

    // Seed Verifications
    this.state.complaint_verifications = [
      { id: "v-1", complaintId: "CIV-COI-1001", userId: "cit-2", residentName: "Vignesh Kumar", distanceMeters: 45, antiFraudPassed: true, votedAt: new Date(Date.now() - 40 * 3600000).toISOString() },
      { id: "v-2", complaintId: "CIV-COI-1001", userId: "temp-1", residentName: "S. Karthikeyan", distanceMeters: 120, antiFraudPassed: true, votedAt: new Date(Date.now() - 39 * 3600000).toISOString() },
      { id: "v-3", complaintId: "CIV-COI-1001", userId: "temp-2", residentName: "M. Revathi", distanceMeters: 230, antiFraudPassed: true, votedAt: new Date(Date.now() - 38 * 3600000).toISOString() },
      { id: "v-4", complaintId: "CIV-COI-1002", userId: "cit-1", residentName: "Yeswanth kumar D.", distanceMeters: 80, antiFraudPassed: true, votedAt: new Date(Date.now() - 10 * 3600000).toISOString() }
    ];

    // Seed completion images
    this.state.completion_images = [
      {
        id: "ci-1",
        complaintId: "CIV-COI-1001",
        imageUrl: "/images/water_after.jpg",
        remarks: "Water pipeline leakage successfully repaired and sealed with heavy-duty concrete collar sleeve. Water flow restored with normal pressure.",
        officerId: "off-1",
        completedAt: new Date(Date.now() - 24 * 3600000).toISOString()
      }
    ];
  }

  // Database helper methods
  public getUsers() { return this.state.users; }
  public getProofs() { return this.state.proofs; }
  public getComplaints() { return this.state.complaints; }
  public getVerifications() { return this.state.complaint_verifications; }
  public getOfficers() { return this.state.officers; }
  public getDepartments() { return this.state.departments; }
  public getEscalations() { return this.state.escalations; }
  public getCompletionImages() { return this.state.completion_images; }

  public addUser(user: UserTable) {
    this.state.users.push(user);
    this.save();
    return user;
  }

  public addProof(proof: ProofTable) {
    this.state.proofs.push(proof);
    this.save();
    return proof;
  }

  public addComplaint(complaint: ComplaintTable) {
    this.state.complaints.unshift(complaint);
    this.save();
    return complaint;
  }

  public updateComplaint(id: string, updates: Partial<ComplaintTable>) {
    const complaint = this.state.complaints.find(c => c.id === id);
    if (complaint) {
      Object.assign(complaint, updates);
      this.save();
    }
    return complaint;
  }

  public addVerification(v: ComplaintVerificationTable) {
    this.state.complaint_verifications.push(v);
    
    // Update verification counts in complaints
    const comp = this.state.complaints.find(c => c.id === v.complaintId);
    if (comp) {
      if (!comp.voters) comp.voters = [];
      if (!comp.voters.includes(v.residentName)) {
        comp.voters.push(v.residentName);
      }
      comp.verificationsCount = comp.voters.length;
      
      // Notify Nearby Residents or Auto-Assign to Department once 3 verifications are met
      if (comp.verificationsCount >= 3 && comp.status === 'Pending') {
        comp.status = 'Assigned';
        // Auto-assign to first matched officer of department
        const dept = this.state.departments.find(d => d.name === comp.category || d.name.toLowerCase().includes(comp.category.toLowerCase().split(' ')[0]));
        if (dept) {
          comp.assignedDepartmentId = dept.id;
          const off = this.state.officers.find(o => o.departmentId === dept.id);
          if (off) {
            comp.assignedOfficerId = off.id;
          }
        }
      }
      this.save();
    }
    return v;
  }

  public addCompletionImage(ci: CompletionImageTable) {
    this.state.completion_images.push(ci);
    this.save();
    return ci;
  }

  public addEscalation(esc: EscalationTable) {
    this.state.escalations.push(esc);
    this.save();
    return esc;
  }
}
