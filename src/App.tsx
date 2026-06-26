import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  Layers,
  MapPin,
  Fingerprint,
  Users,
  Mail,
  AlertTriangle,
  Flame,
  Info,
  Check,
  Building,
  UserCheck,
  History,
  User,
  LogOut,
  Camera,
  Activity,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  FileText,
  RotateCw,
  Search,
  Filter,
  CheckCircle,
  Share2,
  Link,
  MessageSquare,
  Map as MapIcon,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CivicIssue, DepartmentMetric, VerifiedCitizen, ResidentVerification, EmailLog, ExifMetadata } from './types';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { EvidenceCaptureCard } from './components/EvidenceCaptureCard';
import { DepartmentMetricsCard } from './components/DepartmentMetricsCard';
import { CommissionerEscalationCard } from './components/CommissionerEscalationCard';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const RAW_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_API_KEY ||
  '';

const API_KEY = RAW_KEY.trim().replace(/^["'`]|["'`]$/g, '');
const hasValidKey = Boolean(API_KEY) && API_KEY.startsWith('AIzaSy');

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'file-complaint' | 'vouch-verify' | 'my-grievances' | 'officer-desk' | 'profile' | 'auth'>('dashboard');

  // Application Data States
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [departments, setDepartments] = useState<DepartmentMetric[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  
  // Current Citizen Session
  const [currentCitizen, setCurrentCitizen] = useState<VerifiedCitizen | null>(null);
  const [userStats, setUserStats] = useState<{ totalRaised: number; totalResolved: number }>({ totalRaised: 0, totalResolved: 0 });

  // Selected ticket for detailed view in dashboard / detail module
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');

  // Filtering states
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterZone, setFilterZone] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regLandmark, setRegLandmark] = useState('');
  const [regPincode, setRegPincode] = useState('');
  const [regZone, setRegZone] = useState('Central Zone');
  const [regLat, setRegLat] = useState('11.0183');
  const [regLng, setRegLng] = useState('76.9725');
  const [regIdType, setRegIdType] = useState<'Aadhaar' | 'Voter ID' | 'Utility Bill' | 'Property Tax Receipt'>('Aadhaar');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regProofBase64, setRegProofBase64] = useState<string | null>(null);
  const [regProofFileName, setRegProofFileName] = useState('');
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [ocrLog, setOcrLog] = useState<string[]>([]);

  // File Complaint form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'Water Leakage' | 'Road Damage' | 'Sanitation' | 'Streetlight' | 'Public Safety' | 'Parks & Trees' | 'Sewage Overflow'>('Road Damage');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newExif, setNewExif] = useState<ExifMetadata | null>(null);
  const [newIsAnonymous, setNewIsAnonymous] = useState(false);
  const [isTriageAnalyzing, setIsTriageAnalyzing] = useState(false);
  const [triagePrediction, setTriagePrediction] = useState<any | null>(null);

  // Officer completion form states
  const [selectedOfficerTicketId, setSelectedOfficerTicketId] = useState('');
  const [officerAfterImgBase64, setOfficerAfterImgBase64] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [isOfficerSubmitting, setIsOfficerSubmitting] = useState(false);

  // Nearby simulation GPS coordinates ( Gandhipuram Central Coimbatore )
  const [citizenGPSLat, setCitizenGPSLat] = useState('11.0183');
  const [citizenGPSLng, setCitizenGPSLng] = useState('76.9725');
  const [cardMethods, setCardMethods] = useState<Record<string, string>>({});
  const [cardAffirmations, setCardAffirmations] = useState<Record<string, boolean>>({});

  // Auto-dismiss global message toast
  useEffect(() => {
    if (globalMessage) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalMessage]);

  // Load state on mount & Auto-Login seeded citizen
  useEffect(() => {
    fetchCityState();
    autoLoginSeededUser();
  }, []);

  // Sync profile details if current citizen changes
  useEffect(() => {
    if (currentCitizen) {
      fetchUserProfileStats(currentCitizen.uid);
    }
  }, [currentCitizen, issues]);

  const normalizeCitizenUser = (user: any): VerifiedCitizen => ({
    uid: user?.uid || user?.id || '',
    name: user?.name || '',
    idType: user?.idType || 'Aadhaar',
    idNumberMasked: user?.idNumberMasked || user?.idNumber || 'XXXX-XXXX',
    ocrExtractedAddress: user?.ocrExtractedAddress || user?.address || '',
    address: user?.address || '',
    assignedGeozone: user?.assignedGeozone || user?.zone || 'Central Zone',
    isFraudDetected: Boolean(user?.isFraudDetected),
    fraudAnalysisReasoning: user?.fraudAnalysisReasoning,
    faceMatchScore: user?.faceMatchScore ?? 90,
    isVerified: Boolean(user?.isVerified),
    avatarUrl: user?.avatarUrl || '',
    role: user?.role || 'citizen',
    trustScore: user?.trustScore ?? 80,
    landmark: user?.landmark || '',
    pincode: user?.pincode || '',
    locationVerified: Boolean(user?.locationVerified),
    locationConfidence: user?.locationConfidence ?? 0,
    coordinates: user?.coordinates
  });

  const fetchCityState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/issues/list');
      const data = await res.json();
      if (data.success) {
        setIssues(data.issues);
        const urlParams = new URLSearchParams(window.location.search);
        const urlIssueId = urlParams.get('issue');
        if (urlIssueId && data.issues.some((i: any) => i.id === urlIssueId)) {
          setSelectedIssueId(urlIssueId);
        } else if (data.issues.length > 0) {
          setSelectedIssueId(data.issues[0].id);
        }
        // Also fetch department performance
        const deptRes = await fetch('/api/departments/performance');
        const deptData = await deptRes.json();
        if (deptData.success) {
          setDepartments(deptData.departments);
        }
      }
    } catch (err) {
      console.error("Failed to fetch city state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const autoLoginSeededUser = async () => {
    try {
      // Seed R. Prakash ('cit-1') by default to avoid friction
      const res = await fetch('/api/profile/me?uid=cit-1');
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentCitizen(normalizeCitizenUser(data.user));
        setUserStats(data.stats);
      }
    } catch (err) {
      console.error("Auto login failed", err);
    }
  };

  const fetchUserProfileStats = async (uid: string) => {
    try {
      const res = await fetch(`/api/profile/me?uid=${uid}`);
      const data = await res.json();
      if (data.success) {
        setUserStats(data.stats);
        setCurrentCitizen(normalizeCitizenUser(data.user));
      }
    } catch (err) {
      console.error("Failed to load user statistics", err);
    }
  };

  const resetSessionState = () => {
    setCurrentCitizen(null);
    setUserStats({ totalRaised: 0, totalResolved: 0 });
    setSelectedIssueId('');
    setAuthPhone('');
    setAuthPassword('');
    setAuthMode('login');
    setActiveTab('auth');
    setSessionKey(prev => prev + 1);
  };

  const handleLogout = () => {
    resetSessionState();
    setGlobalMessage({ text: 'Signed out. You can now sign in with another account.', type: 'success' });
  };

  const handleSwitchAccount = () => {
    resetSessionState();
    setGlobalMessage({ text: 'Switch account selected. Please sign in with the new profile.', type: 'success' });
  };

  const handleUpvote = async (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCitizen) {
      setGlobalMessage({
        text: "Access Denied: Please log in or verify your resident profile to like or upvote civic tickets.",
        type: 'error'
      });
      setActiveTab('auth');
      return;
    }

    try {
      const res = await fetch("/api/issues/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          citizenUid: currentCitizen.uid
        })
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.issues);
        setGlobalMessage({
          text: "Civic ticket upvoted successfully!",
          type: "success"
        });
      } else {
        setGlobalMessage({
          text: data.error || "You have already upvoted this ticket.",
          type: "error"
        });
      }
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  // Login handler
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhone || !authPassword) return;

    setIsAuthProcessing(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: authPhone, password: authPassword })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentCitizen(null);
        setUserStats({ totalRaised: 0, totalResolved: 0 });
        setSelectedIssueId('');
        setTimeout(() => {
          setCurrentCitizen(normalizeCitizenUser(data.user));
          setSessionKey(prev => prev + 1);
          setGlobalMessage({ text: `Welcome back, ${data.user.name}!`, type: 'success' });
          setActiveTab('dashboard');
          setAuthPhone('');
          setAuthPassword('');
        }, 0);
      } else {
        setGlobalMessage({ text: data.error || "Invalid phone number or password.", type: 'error' });
      }
    } catch (err: any) {
      setGlobalMessage({ text: err.message, type: 'error' });
    } finally {
      setIsAuthProcessing(false);
    }
  };

  // File document upload handler (Convert to base64)
  const handleRegProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRegProofFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setRegProofBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Register / Onboard handler with AI Document Extraction
  const handleAuthRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !authPhone || !authPassword || !regAddress) {
      setGlobalMessage({ text: "Please fill out all required fields.", type: 'error' });
      return;
    }

    setIsAuthProcessing(true);
    setOcrLog([
      "🔄 Booting Coimbatore Municipal AI OCR Reader...",
      "📸 Scanning layout and extracting structural pixel grids...",
      "🧠 Executing biometric matching checks & tamper analysis..."
    ]);

    // Simulate stepping
    const runOcrLogs = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOcrLog(prev => [...prev, "🗺️ Matching address text to Coimbatore Geozone boundaries..."]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setOcrLog(prev => [...prev, "✓ Document check cleared. Querying anti-fraud database..."]);
    };
    await runOcrLogs();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          phone: authPhone,
          password: authPassword,
          address: regAddress,
          landmark: regLandmark,
          pincode: regPincode,
          zone: regZone,
          coordinates: {
            lat: parseFloat(regLat) || 11.0183,
            lng: parseFloat(regLng) || 76.9725
          },
          locationVerified: true,
          idType: regIdType,
          idNumber: regIdNumber,
          proofDocument: regProofBase64
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentCitizen(normalizeCitizenUser(data.user));
        setGlobalMessage({
          text: `Account registration verified! Welcome to CivicEye, ${data.user.name}. Your trust score starts at ${data.user.trustScore}.`,
          type: 'success'
        });
        setActiveTab('dashboard');
        // Reset forms
        setRegName('');
        setAuthPhone('');
        setAuthPassword('');
        setRegAddress('');
        setRegLandmark('');
        setRegPincode('');
        setRegLat('11.0183');
        setRegLng('76.9725');
        setRegIdNumber('');
        setRegProofBase64(null);
        setRegProofFileName('');
      } else {
        setGlobalMessage({ text: data.error || "Onboarding failed.", type: 'error' });
      }
    } catch (err: any) {
      setGlobalMessage({ text: err.message, type: 'error' });
    } finally {
      setIsAuthProcessing(false);
      setOcrLog([]);
    }
  };

  // Simulate quick testing pre-fill
  const handleQuickSeedOnboard = (type: 'aadhaar' | 'voter') => {
    if (type === 'aadhaar') {
      setRegName('R. Prakash');
      setAuthPhone('9876543210');
      setAuthPassword('password123');
      setRegAddress('14, Sathy Road, Gandhipuram, Coimbatore - 641012');
      setRegLandmark('Opposite to City Center');
      setRegPincode('641012');
      setRegLat('11.0183');
      setRegLng('76.9725');
      setRegZone('Central Zone');
      setRegIdType('Aadhaar');
      setRegIdNumber('552388129940');
      setRegProofFileName('scanned_aadhaar.png');
      setRegProofBase64('data:image/png;base64,iVBORw0K...');
    } else {
      setRegName('Vignesh Kumar');
      setAuthPhone('9876543211');
      setAuthPassword('password123');
      setRegAddress('82, Avinashi Road, Peelamedu, Coimbatore - 641004');
      setRegLandmark('Near Peelamedu Bus Stop');
      setRegPincode('641004');
      setRegLat('11.0287');
      setRegLng('77.0024');
      setRegZone('East Zone');
      setRegIdType('Voter ID');
      setRegIdNumber('TN/03/021/45921');
      setRegProofFileName('scanned_voter_card.png');
      setRegProofBase64('data:image/png;base64,iVBORw0K...');
    }
    setGlobalMessage({ text: "Testing mock data pre-filled. Press onboarding button to submit.", type: 'success' });
  };

  // Ticket Triage Smart Analyzer
  const handleRunAiTriageAnalyze = async () => {
    if (!newTitle) {
      setGlobalMessage({ text: "Please enter a complaint title before analyzing.", type: 'error' });
      return;
    }
    setIsTriageAnalyzing(true);
    setTriagePrediction(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          location: `GPS Overrides`
        })
      });
      const data = await res.json();
      if (data.success && data.classification) {
        setTriagePrediction(data.classification);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriageAnalyzing(false);
    }
  };

  // Submit Complaint
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCitizen) {
      setGlobalMessage({ text: "Please log in first to submit a complaint.", type: 'error' });
      return;
    }
    if (!newTitle || !newDescription) {
      setGlobalMessage({ text: "Title and description are required.", type: 'error' });
      return;
    }
    if (!newImgUrl || !newExif) {
      setGlobalMessage({ text: "Compliance error: You must capture a validated Coimbatore geotagged photo.", type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/issues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentCitizen.uid,
          title: newTitle,
          description: newDescription,
          category: newCategory,
          lat: newExif.latitude,
          lng: newExif.longitude,
          beforeImg: newImgUrl,
          exifData: newExif,
          isAnonymous: newIsAnonymous
        })
      });
      const data = await res.json();
      if (data.success && data.issue) {
        setGlobalMessage({
          text: `Grievance ticket registered! Ticket ID: ${data.issue.id}. Dispatched to ${data.issue.department}. Requires 3 nearby resident confirmations to assign work order.`,
          type: 'success'
        });
        // Reset complaint state
        setNewTitle('');
        setNewDescription('');
        setNewImgUrl('');
        setNewExif(null);
        setNewIsAnonymous(false);
        setTriagePrediction(null);
        // Refresh & redirect
        await fetchCityState();
        setSelectedIssueId(data.issue.id);
        setActiveTab('dashboard');
      } else {
        setGlobalMessage({ text: data.error || "Grievance filing failed.", type: 'error' });
      }
    } catch (err: any) {
      setGlobalMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Proximity confirm/vote vouch
  const handleVouchVoucherSubmit = async (issueId: string) => {
    if (!currentCitizen) {
      setGlobalMessage({ text: "Authentication required to vouch for local tickets.", type: 'error' });
      setActiveTab('auth');
      return;
    }

    const isAffirmed = cardAffirmations[issueId];
    if (!isAffirmed) {
      setGlobalMessage({ text: "Integrity protection: You must acknowledge and sign the resident code declaration.", type: 'error' });
      return;
    }

    const method = cardMethods[issueId] || "Secure GNSS Checksum";

    try {
      const res = await fetch("/api/issues/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId: issueId,
          userId: currentCitizen.uid,
          lat: parseFloat(citizenGPSLat),
          lng: parseFloat(citizenGPSLng),
          verificationMethod: method
        })
      });
      const data = await res.json();
      if (data.success) {
        setGlobalMessage({ text: "Community proximity confirmation registered with high-integrity telemetry!", type: 'success' });
        setIssues(data.issues);
        fetchCityState();
      } else {
        setGlobalMessage({ text: data.error || "Proximity verification rejected.", type: 'error' });
      }
    } catch (err: any) {
      setGlobalMessage({ text: err.message, type: 'error' });
    }
  };

  // Convert officer image change
  const handleOfficerAfterImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setOfficerAfterImgBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Officer completion submit
  const handleOfficerCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficerTicketId || !officerAfterImgBase64) {
      setGlobalMessage({ text: "Please select an assigned ticket and upload a comparative resolution photo.", type: 'error' });
      return;
    }

    setIsOfficerSubmitting(true);
    try {
      const res = await fetch("/api/issues/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId: selectedOfficerTicketId,
          afterImg: officerAfterImgBase64,
          remarks: officerRemarks,
          officerId: currentCitizen?.role === 'officer' ? currentCitizen.uid : 'off-1'
        })
      });
      const data = await res.json();
      if (data.success) {
        setGlobalMessage({ text: "Job closure verified! Ticket marked resolved and comparative slider dispatched.", type: 'success' });
        setOfficerAfterImgBase64('');
        setOfficerRemarks('');
        setSelectedOfficerTicketId('');
        await fetchCityState();
      } else {
        setGlobalMessage({ text: data.error || "Failed to submit work order closure.", type: 'error' });
      }
    } catch (err: any) {
      setGlobalMessage({ text: err.message, type: 'error' });
    } finally {
      setIsOfficerSubmitting(false);
    }
  };

  const downloadPDFReport = () => {
    try {
      const doc = new jsPDF();
      
      // Title Block
      doc.setFillColor(18, 18, 20);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('COIMBATORE MUNICIPAL CORPORATION', 15, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(161, 161, 170);
      doc.text('CivicEye Operations Room - Automated Oversight Portal', 15, 24);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 15, 30);
      
      // Document Title
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('COMMISSIONER EXECUTIVE PERFORMANCE AUDIT REPORT', 15, 55);
      
      // Executive Summary Banner
      const failingCount = departments.filter(d => d.slaCompliance < 80).length;
      const avgSla = Math.round(departments.reduce((acc, d) => acc + d.slaCompliance, 0) / (departments.length || 1));
      
      doc.setFillColor(244, 244, 245);
      doc.rect(15, 62, 180, 24, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('EXECUTIVE METRICS SUMMARY:', 20, 68);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Monitored Departments: ${departments.length}`, 20, 74);
      doc.text(`Critical SLA Violations (< 80%): `, 20, 80);
      
      // Color warning for critical violations count
      if (failingCount > 0) {
        doc.setTextColor(225, 29, 72); // Rose
        doc.setFont('helvetica', 'bold');
        doc.text(`${failingCount} DEPARTMENTS`, 74, 80);
      } else {
        doc.setTextColor(22, 163, 74); // Green
        doc.setFont('helvetica', 'bold');
        doc.text('NONE (Operational Safety)', 74, 80);
      }
      
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text(`Average City-wide SLA Compliance: `, 115, 74);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241); // Indigo
      doc.text(`${avgSla}%`, 175, 74);
      
      // Draw a line
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.5);
      doc.line(15, 94, 195, 94);
      
      // Table Header
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('DEPT PERFORMANCE METRICS SHEET:', 15, 102);
      
      // Table Columns
      let y = 112;
      doc.setFillColor(39, 39, 42);
      doc.rect(15, y, 180, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('CODE', 18, y + 5);
      doc.text('DEPARTMENT NAME', 35, y + 5);
      doc.text('ZONE', 95, y + 5);
      doc.text('SLA %', 125, y + 5);
      doc.text('CASES', 142, y + 5);
      doc.text('SOLVED', 157, y + 5);
      doc.text('DELAYED', 175, y + 5);
      
      y += 8;
      
      // Table Rows
      departments.forEach((dept, index) => {
        // Alternating background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, y, 180, 8, 'F');
        } else {
          doc.setFillColor(244, 244, 245);
          doc.rect(15, y, 180, 8, 'F');
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(39, 39, 42);
        doc.text(dept.code, 18, y + 5);
        
        // Truncate dept name if too long
        let deptName = dept.name;
        if (deptName.length > 28) {
          deptName = deptName.substring(0, 25) + '...';
        }
        doc.text(deptName, 35, y + 5);
        
        doc.text(dept.zone || 'Coimbatore', 95, y + 5);
        
        // Warning color for low SLA
        if (dept.slaCompliance < 80) {
          doc.setTextColor(225, 29, 72);
          doc.setFont('helvetica', 'bold');
        } else if (dept.slaCompliance >= 90) {
          doc.setTextColor(22, 163, 74);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
        }
        doc.text(`${dept.slaCompliance}%`, 125, y + 5);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(39, 39, 42);
        doc.text(String(dept.totalCases), 142, y + 5);
        doc.text(String(dept.solvedCases), 157, y + 5);
        doc.text(String(dept.delayedCases), 175, y + 5);
        
        y += 8;
      });
      
      // Footer and Sign-off
      y += 15;
      doc.setDrawColor(228, 228, 231);
      doc.line(15, y, 195, y);
      
      y += 10;
      doc.setTextColor(113, 113, 122);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('This document is electronically verified by the CivicEye Operational consensus network.', 15, y);
      doc.text('Data is compiled from real-time resident geotagged verifications on-chain.', 15, y + 4);
      
      // Signature Box
      y += 5;
      doc.setDrawColor(15, 23, 42);
      doc.rect(135, y, 55, 22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('APPROVED BY:', 138, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('Katta Ravi Teja', 138, y + 12);
      doc.setFontSize(7);
      doc.setTextColor(113, 113, 122);
      doc.text('Municipal Commissioner', 138, y + 17);
      
      doc.save(`CivicEye_Commissioner_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setGlobalMessage({
        text: "Executive PDF Audit Report generated and downloaded successfully!",
        type: "success"
      });
    } catch (err: any) {
      console.error(err);
      setGlobalMessage({
        text: `Error generating PDF: ${err.message}`,
        type: "error"
      });
    }
  };

  const downloadCSVReport = () => {
    try {
      const headers = ["Department Code", "Department Name", "Zone", "SLA Compliance %", "Total Cases", "Solved Cases", "Pending Cases", "Delayed Cases", "Avg Resolution (Days)"];
      const rows = departments.map(d => [
        `"${d.code}"`,
        `"${d.name}"`,
        `"${d.zone}"`,
        d.slaCompliance,
        d.totalCases,
        d.solvedCases,
        d.pendingCases,
        d.delayedCases,
        d.avgResolutionDays
      ]);
      
      const csvContent = [
        ["CivicEye Coimbatore - Department Performance Audit Report"],
        [`Generated: ${new Date().toISOString()}`],
        [],
        headers,
        ...rows
      ].map(e => e.join(",")).join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CivicEye_Department_Performance_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setGlobalMessage({
        text: "Performance CSV Spreadsheet downloaded successfully!",
        type: "success"
      });
    } catch (err: any) {
      console.error(err);
      setGlobalMessage({
        text: `Error downloading CSV: ${err.message}`,
        type: "error"
      });
    }
  };

  // Filter complaints list
  const filteredIssuesList = issues.filter(iss => {
    const matchCat = filterCategory === 'All' || iss.category === filterCategory;
    const matchZone = filterZone === 'All' || iss.zone === filterZone;
    const matchStatus = filterStatus === 'All' || 
                        (filterStatus === 'Pending' && iss.status === 'Pending') ||
                        (filterStatus === 'In Progress' && (iss.status === 'Assigned' || iss.status === 'In Progress')) ||
                        (filterStatus === 'Completed' && iss.status === 'Completed') ||
                        (filterStatus === 'Escalated' && iss.status === 'Escalated');
    
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query ||
                       iss.title.toLowerCase().includes(query) ||
                       iss.id.toLowerCase().includes(query) ||
                       (iss.reportNumber && iss.reportNumber.toLowerCase().includes(query)) ||
                       iss.description.toLowerCase().includes(query);

    return matchCat && matchZone && matchStatus && matchQuery;
  });

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  const categoriesList = ['All', 'Water Leakage', 'Road Damage', 'Sanitation', 'Streetlight', 'Sewage Overflow', 'Public Safety', 'Parks & Trees'];
  const zonesList = ['All', 'Central Zone', 'East Zone', 'West Zone', 'North Zone', 'South Zone'];
  const statusList = ['All', 'Pending', 'In Progress', 'Completed', 'Escalated'];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Toast Alerts */}
      {globalMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-fadeIn ${
          globalMessage.type === 'error' 
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' 
            : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">{globalMessage.text}</span>
          <button onClick={() => setGlobalMessage(null)} className="ml-2 hover:text-white font-extrabold cursor-pointer">×</button>
        </div>
      )}

      {/* HEADER SECTION */}
      <header key={`header-${sessionKey}`} className="bg-[#101013] border-b border-zinc-850 px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              CIVIC<span className="text-indigo-500">EYE</span>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-400 font-mono px-2 py-0.5 rounded border border-indigo-500/25">PRODUCTION PRO</span>
            </h1>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Coimbatore Smart City Incident Management Portal & Geotag Verification Engine
            </p>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-[#17171d] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Ops Room
          </button>
          
          <button
            onClick={() => {
              if (!currentCitizen) {
                setGlobalMessage({ text: "Authentication Required: Please register or login first to file a live grievance.", type: 'error' });
                setActiveTab('auth');
                return;
              }
              setActiveTab('file-complaint');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'file-complaint' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> File Complaint
          </button>

          <button
            onClick={() => setActiveTab('vouch-verify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vouch-verify' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Vouch (Proximity)
          </button>

          <button
            onClick={() => {
              if (!currentCitizen) {
                setGlobalMessage({ text: "Authentication Required: Please register or login to view your personalized tracking history.", type: 'error' });
                setActiveTab('auth');
                return;
              }
              setActiveTab('my-grievances');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my-grievances' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <History className="w-3.5 h-3.5" /> My History
          </button>

          <button
            onClick={() => setActiveTab('officer-desk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'officer-desk' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Officer Desk
          </button>

          <button
            onClick={() => {
              if (!currentCitizen) {
                setActiveTab('auth');
                return;
              }
              setActiveTab('profile');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile' || (activeTab === 'auth' && !currentCitizen) ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile
          </button>
        </nav>

        {/* Global User status widget */}
        <div className="flex items-center gap-3">
          {currentCitizen ? (
            <div className="flex items-center gap-2 bg-[#17171d] border border-zinc-800 px-3.5 py-1.5 rounded-xl">
              <img 
                src={currentCitizen.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt="Profile Avatar"
                className="w-6 h-6 rounded-full object-cover border border-indigo-500/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 block leading-none">{currentCitizen.role === 'officer' ? 'Municipality Official' : 'Verified Resident'}</span>
                <span className="text-xs font-bold text-white leading-none mt-1 block">{currentCitizen.name}</span>
              </div>
              <button
                onClick={handleSwitchAccount}
                title="Switch account"
                className="px-2 py-1 text-[10px] font-semibold rounded border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-indigo-500/50 cursor-pointer"
              >
                Switch
              </button>
              <button 
                onClick={handleLogout}
                title="Sign out"
                className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-900/20"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* PRIMARY GRID CONTENT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ======================================================== */}
        {/* VIEW 1: OPS ROOM (DASHBOARD & FEEDS) */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* LEFT FEED GRID (4/12 columns) */}
            <div className="xl:col-span-4 bg-[#111114] border border-zinc-850 rounded-2xl p-5 flex flex-col h-[780px]">
              <div className="text-xs font-bold uppercase text-zinc-500 mb-4 flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold tracking-wider text-zinc-400">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Live Grievance Intake
                </span>
                <span className="font-mono bg-zinc-900 px-2.5 py-0.5 border border-zinc-800 rounded text-[10px] text-indigo-400">
                  {filteredIssuesList.length} ACTIVE GRIDS
                </span>
              </div>

              {/* Grid filters inside list feed */}
              <div className="space-y-3 pb-3.5 border-b border-zinc-850">
                {/* Search Bar */}
                <div className="relative">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Search complaints</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, ID (#), description..."
                      className="w-full bg-[#0a0a0c] border border-[#27272a] rounded-lg py-1.5 pl-8 pr-7 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600 font-medium"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm font-bold cursor-pointer"
                        title="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Incident Category</span>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                    >
                      {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Administrative Zone</span>
                    <select
                      value={filterZone}
                      onChange={(e) => setFilterZone(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                    >
                      {zonesList.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Infinite Feed Wrapper */}
              <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1 scrollbar-thin">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center text-zinc-650 text-xs">
                    <span>🔄 Connecting to Coimbatore central database...</span>
                  </div>
                ) : filteredIssuesList.length > 0 ? (
                  filteredIssuesList.map((iss) => {
                    const isSelected = iss.id === selectedIssueId;
                    const isCritical = iss.severity === "Critical";
                    const isFailing = iss.status === "Escalated";

                    return (
                      <div
                        key={iss.id}
                        onClick={() => setSelectedIssueId(iss.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-[#17171d] border-indigo-500/80 shadow-lg shadow-indigo-950/20'
                            : 'bg-[#0b0b0d]/80 border-zinc-850 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">
                              #{iss.reportNumber}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-mono ml-2">
                              Zone: {iss.zone}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                              isCritical 
                                ? 'bg-rose-950/40 text-rose-400 border border-rose-900/40' 
                                : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {iss.severity}
                            </span>
                            
                            <button
                              onClick={(e) => handleUpvote(iss.id, e)}
                              className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-400 bg-zinc-850/60 px-1.5 py-0.5 rounded border border-zinc-800 cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {iss.upvotes}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-zinc-200 mt-2 line-clamp-1 group-hover:text-white">
                          {iss.title}
                        </h4>

                        <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1">
                          {iss.description}
                        </p>

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-zinc-850/50">
                          <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" /> Deadline: {iss.predictedDeadline}
                          </span>
                          
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            iss.status === 'Completed' || iss.status === 'Verified'
                              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/45'
                              : isFailing
                              ? 'bg-rose-950/30 text-rose-400 border border-rose-900/45 animate-pulse'
                              : 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/45'
                          }`}>
                            {iss.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 p-4">
                    <p className="text-xs">No active reports match selected administrative parameters.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT WORK DETAIL AREA (8/12 columns) */}
            <div className="xl:col-span-8 space-y-5">
              {selectedIssue ? (
                <div className="bg-[#111114] border border-zinc-850 rounded-2xl p-6 space-y-5">
                  
                  {/* COMPREHENSIVE RECONCILIATION PROGRESS LINE */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                      Autonomous Citizen Consensus & Remediation Flow Status
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[9px] text-center font-mono font-bold">
                      <div className="p-2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                        1. INTAKE OCR
                      </div>
                      <div className="p-2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                        2. EXIF AUDIT
                      </div>
                      <div className={`p-2 rounded ${
                        selectedIssue.verifications.length >= 3 ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-amber-950/50 text-amber-300 border border-amber-800/20 animate-pulse'
                      }`}>
                        3. CONSENSUS ({selectedIssue.verifications.length}/3)
                      </div>
                      <div className={`p-2 rounded ${
                        selectedIssue.status !== 'Pending' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' : 'bg-zinc-900 text-zinc-600'
                      }`}>
                        4. SLA DISPATCH
                      </div>
                      <div className={`p-2 rounded ${
                        selectedIssue.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-zinc-900 text-zinc-600'
                      }`}>
                        5. COMPLETED
                      </div>
                      <div className={`p-2 rounded ${
                        selectedIssue.isEscalatedToCommissioner ? 'bg-rose-950 text-rose-400 border border-rose-800/40 animate-pulse' : 'bg-zinc-900 text-zinc-600'
                      }`}>
                        6. COMM ESCALATION
                      </div>
                    </div>
                  </div>

                  {/* Header title */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-3.5 border-t border-zinc-850">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex flex-wrap items-center gap-2 break-words">
                        {selectedIssue.title}
                        {selectedIssue.status === 'Completed' && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shrink-0">
                            ✓ SOLVED
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl break-words">
                        {selectedIssue.description}
                      </p>
                      <div className="text-[11px] text-indigo-400 font-mono pt-1 break-words">
                        📍 Incident Location: <span className="underline text-zinc-300 font-semibold">{selectedIssue.location}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right sm:shrink-0 text-xs font-mono max-w-full sm:max-w-[280px] break-all space-y-1">
                      <div className="text-zinc-500">Grievance Ticket: <strong className="text-zinc-300">{selectedIssue.id}</strong></div>
                      <div className="text-zinc-500">Reporter: <strong className="text-indigo-400 break-words">{selectedIssue.reporterName}</strong></div>
                      <div className="text-zinc-500">Zone: <strong className="text-zinc-300">{selectedIssue.zone}</strong></div>
                    </div>
                  </div>

                  {/* Share Grievance & Location Map Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-zinc-850">
                    
                    {/* VENUE GEOTAG MAP */}
                    <div className="bg-[#15151a] border border-zinc-850 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                          <MapIcon className="w-3.5 h-3.5 text-indigo-400" /> Siting Venue Geolocation Map
                        </label>
                        <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded">
                          {selectedIssue.geotag.lat.toFixed(4)}, {selectedIssue.geotag.lng.toFixed(4)}
                        </span>
                      </div>

                      {hasValidKey ? (
                        <APIProvider apiKey={API_KEY} version="weekly">
                          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#08080a] h-[160px] relative">
                            <Map
                              center={{ lat: selectedIssue.geotag.lat, lng: selectedIssue.geotag.lng }}
                              zoom={15}
                              mapId="DEMO_MAP_ID"
                              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                              style={{ width: '100%', height: '100%' }}
                              disableDefaultUI={true}
                              zoomControl={true}
                            >
                              <AdvancedMarker position={{ lat: selectedIssue.geotag.lat, lng: selectedIssue.geotag.lng }}>
                                <Pin background="#6366f1" glyphColor="#fff" />
                              </AdvancedMarker>
                            </Map>
                          </div>
                        </APIProvider>
                      ) : (
                        <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#08080a] h-[160px] relative">
                          <iframe
                            title="Venue Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${selectedIssue.geotag.lat},${selectedIssue.geotag.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="filter invert-[90%] hue-rotate-180 contrast-125 opacity-80"
                          ></iframe>
                        </div>
                      )}

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedIssue.geotag.lat},${selectedIssue.geotag.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#09090c] hover:bg-[#121217] text-indigo-400 hover:text-indigo-300 border border-zinc-800 hover:border-zinc-700 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        Open Siting Venue in Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* MOBILIZE NEIGHBORS FOR CONSENSUS */}
                    <div className="bg-[#15151a] border border-zinc-850 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share Complaint & Mobilize Consensus
                        </label>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          This platform is built on <strong>citizen consensus</strong>. Share this ticket with Coimbatore residents to verify and vouch so it triggers immediate officer dispatch!
                        </p>
                      </div>

                      {/* Vouch Progress tracker inside the share block to keep context */}
                      <div className="bg-[#09090c] border border-zinc-900 p-2.5 rounded-lg space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-500 font-mono">Consensus Vouch Progress:</span>
                          <span className={`font-mono font-bold ${selectedIssue.verifications.length >= 3 ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                            {selectedIssue.verifications.length} / 3 vouches
                          </span>
                        </div>
                        <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${selectedIssue.verifications.length >= 3 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min(100, (selectedIssue.verifications.length / 3) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            const shareText = `🚨 Coimbatore Grievance: "${selectedIssue.title}" at ${selectedIssue.location}.\n\n` +
                              `We need 3 verified resident vouches to trigger automated dispatch! Please support and vouch now:\n` +
                              `${window.location.origin}/?issue=${selectedIssue.id}\n\n` +
                              `Let's solve this together!`;
                            navigator.clipboard.writeText(shareText).then(() => {
                              setGlobalMessage({
                                text: `Invitation link for Ticket ${selectedIssue.id} copied! Share it with your neighbors.`,
                                type: 'success'
                              });
                            });
                          }}
                          className="flex items-center justify-center gap-1.5 bg-[#1b1c24] hover:bg-zinc-800 text-zinc-200 border border-zinc-750 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Link className="w-3.5 h-3.5 text-indigo-400" />
                          Copy Link
                        </button>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `🚨 Coimbatore Civic Alert: "${selectedIssue.title}" at ${selectedIssue.location}.\n\nWe need 3 verified resident vouches to dispatch municipal officers. Support and vouch here: ${window.location.origin}/?issue=${selectedIssue.id}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 border border-emerald-900/40 py-2 rounded-lg text-[11px] font-bold transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          WhatsApp
                        </a>

                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            `🚨 Grievance: ${selectedIssue.title} at ${selectedIssue.location}. Let's reach 3 vouches for dispatch! Vouch here:`
                          )}&url=${encodeURIComponent(`${window.location.origin}/?issue=${selectedIssue.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-sky-950/40 hover:bg-sky-950/70 text-sky-300 border border-sky-900/40 py-2 rounded-lg text-[11px] font-bold transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5 text-sky-400" />
                          Twitter / X
                        </a>

                        <a
                          href={`mailto:?subject=${encodeURIComponent(
                            `Consensus required: ${selectedIssue.title}`
                          )}&body=${encodeURIComponent(
                            `Hello Neighbors,\n\nI reported a civic issue: "${selectedIssue.title}" located at ${selectedIssue.location}.\n\nWe need 3 verified resident vouches so the system automatically routes this and alerts department heads. Support and vouch here:\n${window.location.origin}/?issue=${selectedIssue.id}`
                          )}`}
                          className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold transition-all"
                        >
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          Email Group
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Responsible official information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#17171c] p-4 rounded-xl border border-zinc-850 space-y-2">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Responsible Remediation Routing</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold">Department</span>
                          <strong className="text-zinc-200">{selectedIssue.department}</strong>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold">Lead Officer</span>
                          <strong className="text-zinc-200">{selectedIssue.assignedOfficer}</strong>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800 col-span-2">
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold">Active Supervisor (Phone Contacts)</span>
                          <strong className="text-zinc-200 font-mono text-[10px]">{selectedIssue.localSupervisor} ({selectedIssue.zone})</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#17171c] p-4 rounded-xl border border-zinc-850 space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Neural SLA Timer & Confidence</span>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <Clock className="w-5 h-5 text-emerald-400" />
                          <div>
                            <span className="text-sm font-black text-emerald-400">{selectedIssue.predictedDeadline} Target</span>
                            <span className="text-[9px] text-zinc-500 block font-mono">Confidence Level: {selectedIssue.aiConfidence}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-lg text-[10px] italic text-zinc-400 leading-normal border-l-2 border-l-indigo-500">
                        "AI Dispatch Heuristic: {selectedIssue.reasoning}"
                      </div>
                    </div>
                  </div>

                  {/* Vouch progress card */}
                  <div className="bg-[#17171c] p-4 rounded-xl border border-zinc-850 space-y-3">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">Community Verification Logs ({selectedIssue.verifications.length}/3 Confirmed)</span>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded">GPS Vouch active</span>
                    </div>

                    {selectedIssue.verifications.length > 0 ? (
                      <div className="space-y-2">
                        {selectedIssue.verifications.map((v, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-850 text-xs">
                            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {v.name}
                            </span>
                            <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
                              <span>Distance: <strong className="text-indigo-400">{v.distanceMeters}m</strong></span>
                              <span className="text-emerald-400">✓ anti-spoof passed</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-500 text-center py-2 italic">No nearby residents have vouched for this ticket yet. Head over to the 'Vouch (Proximity)' tab to confirm!</p>
                    )}
                  </div>

                  {/* comparative visuals slider */}
                  <div className="bg-[#17171c] border border-zinc-850 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Comparative Remediation Evidence</h3>
                        <p className="text-[10px] text-zinc-500">Citizen visual audit loops</p>
                      </div>
                      
                      {selectedIssue.status === 'Completed' ? (
                        <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">
                          ✓ RESOLVED & CONFIRMED BY MUNICIPALITY
                        </span>
                      ) : (
                        <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
                          PENDING — Resolution image will be available after completion.
                        </span>
                      )}
                    </div>

                    {selectedIssue.afterImg ? (
                      <BeforeAfterSlider
                        beforeImg={selectedIssue.beforeImg || "/images/road_before.jpg"}
                        afterImg={selectedIssue.afterImg}
                        category={selectedIssue.category}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Before fixing (Live Capture)</span>
                          <div className="bg-black border border-zinc-900 rounded-xl overflow-hidden h-[180px] flex items-center justify-center">
                            <img 
                              src={selectedIssue.beforeImg || "/images/road_before.jpg"} 
                              alt="Before" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">After Remediation (Officer Dispatch)</span>
                          <div className="bg-[#0b0b0d]/50 border border-zinc-900 border-dashed rounded-xl overflow-hidden h-[180px] flex items-center justify-center relative">
                            <div className="p-4 space-y-3 text-center">
                              <p className="text-[11px] text-zinc-500 leading-normal">
                                No closure proof uploaded by the department yet. Officers must capture a live photo on-site once fixed to close the ticket.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="bg-[#111114] border border-zinc-850 rounded-2xl p-12 text-center text-zinc-500">
                  Select an active complaint ticket from the left feed to access the civic operations room.
                </div>
              )}

              {/* ADMIN WIDGETS LOWER ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department performance radar */}
                <div className="bg-[#111114] border border-zinc-850 rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-850 pb-2.5 mb-3 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-indigo-400" />
                    Department Performance indices
                  </h3>
                  <div className="space-y-3">
                    {departments.map((dept, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between items-center text-zinc-300">
                          <span className="font-semibold">{dept.name}</span>
                          <span className="font-mono text-[11px] text-indigo-400">{dept.slaCompliance}% SLA</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 border border-zinc-800">
                          <div 
                            className={`h-full rounded-full ${
                              dept.slaCompliance > 85 ? 'bg-emerald-500' : dept.slaCompliance > 50 ? 'bg-indigo-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${dept.slaCompliance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commissioner escalation alerts */}
                <div className="bg-[#111114] border border-zinc-850 rounded-2xl p-5">
                  <div className="text-xs font-black uppercase tracking-wider text-rose-400 border-b border-zinc-850 pb-2.5 mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      Commissioner Oversight Gateways
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={downloadPDFReport}
                        className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded text-[9px] font-extrabold uppercase transition-all flex items-center gap-1 cursor-pointer"
                        title="Download executive PDF audit report"
                      >
                        <FileText className="w-3 h-3 text-rose-400" />
                        PDF Report
                      </button>
                      <button
                        onClick={downloadCSVReport}
                        className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded text-[9px] font-extrabold uppercase transition-all flex items-center gap-1 cursor-pointer"
                        title="Download performance CSV data"
                      >
                        <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                        CSV Sheet
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {departments.some(d => d.slaCompliance < 80) ? (
                      <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl text-[11px] text-rose-300 leading-normal space-y-2">
                        <p>The performance of <strong>Sewage Operations</strong> is failing at <strong>78% compliance</strong>. Automated telemetry has dispatched operational briefings to Municipal Commissioner.</p>
                        <button
                          onClick={async () => {
                            const res = await fetch("/api/issues/list");
                            setGlobalMessage({ text: "Commissioner escalation audit dispatched successfully!", type: "success" });
                          }}
                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          Dispatched briefing logs
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">All administrative departments are currently performing within SLA safety margins.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: FILE NEW COMPLAINT (CAMERA METADATA LOCK) */}
        {/* ======================================================== */}
        {activeTab === 'file-complaint' && (
          <div className="max-w-3xl mx-auto bg-[#111114] border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="border-b border-zinc-850 pb-4">
              <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> File Live Grievance Report
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Camera uploads are validated by EXIF forensics to prevent spoofing.</p>
            </div>

            <form onSubmit={handleComplaintSubmit} className="space-y-5">
              {/* Evidence capture module component wrapper */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider">1. Capture Live Evidence Geotag</label>
                <EvidenceCaptureCard 
                  selectedCategory={newCategory}
                  onCaptureCompleted={(img, exif) => {
                    setNewImgUrl(img);
                    setNewExif(exif);
                    setGlobalMessage({ text: "Camera evidence locked & GPS audited successfully!", type: 'success' });
                  }}
                />
              </div>

              {/* Text inputs */}
              <div className="space-y-4 pt-2 border-t border-zinc-850">
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider">2. Provide Incident Particulars</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Incident Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                    >
                      <option value="Road Damage">Road Damage</option>
                      <option value="Water Leakage">Water Leakage</option>
                      <option value="Sanitation">Sanitation / Overflowing Bins</option>
                      <option value="Streetlight">Streetlight Maintenance</option>
                      <option value="Sewage Overflow">Sewage Overflow</option>
                      <option value="Public Safety">Public Safety Concern</option>
                      <option value="Parks & Trees">Parks & Trees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Grievance Headline / Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Broken water pipeline flooding roads"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Detailed Description of Incident</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide details about size, impact on traffic, pedestrian hazard, how long the issue has persisted..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-700 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox"
                    id="anonymous-checkbox"
                    checked={newIsAnonymous}
                    onChange={(e) => setNewIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-[#0a0a0c] text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                  />
                  <label htmlFor="anonymous-checkbox" className="text-xs font-semibold text-zinc-400 cursor-pointer select-none">
                    File anonymously <span className="text-[10px] text-zinc-500 font-normal">(hide your name on public dashboards)</span>
                  </label>
                </div>
              </div>

              {/* Intelligent route preview helper */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAiTriageAnalyze}
                  disabled={isTriageAnalyzing || !newTitle}
                  className="w-full py-2.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Run AI Triage (Classify & Predict Deadline)
                </button>
              </div>

              {triagePrediction && (
                <div className="bg-[#17171c] border border-indigo-500/20 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs text-indigo-300 border-b border-zinc-800 pb-2">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-400" /> AI Classification predictions</span>
                    <span className="font-mono text-[10px] bg-indigo-500/10 px-1.5 py-0.5 rounded">{triagePrediction.aiConfidence}% confidence</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-850">
                      <span className="text-zinc-500 block text-[8px] uppercase">SEVERITY</span>
                      <strong className="text-zinc-300">{triagePrediction.severity}</strong>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-850">
                      <span className="text-zinc-500 block text-[8px] uppercase">TARGET SLA</span>
                      <strong className="text-emerald-400">{triagePrediction.predictedDeadline}</strong>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-850">
                      <span className="text-zinc-500 block text-[8px] uppercase">DEPARTMENT</span>
                      <strong className="text-zinc-300">{triagePrediction.department}</strong>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-zinc-400 italic">"AI Memo: {triagePrediction.reasoning}"</p>
                </div>
              )}

              {/* Submit triggers */}
              <div className="pt-4 border-t border-zinc-850 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImgUrl || !newExif}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Dispatch Grievance Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: VOUCH & PROXIMITY CONSENSUS */}
        {/* ======================================================== */}
        {activeTab === 'vouch-verify' && (
          <div className="space-y-6">
            
            {/* Simulation settings block */}
            <div className="bg-[#111114] border border-zinc-850 rounded-2xl p-5 space-y-3 max-w-xl mx-auto">
              <h3 className="text-xs font-black uppercase text-zinc-400 border-b border-zinc-850 pb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Active Proximity Calibration
              </h3>
              <p className="text-[11px] text-zinc-500 leading-normal">
                To confirm consensus, your registered GPS coordinates must be within <strong>500 meters</strong> of the reported incident. Simulate your device location coordinates below:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Your Device Latitude</label>
                  <input 
                    type="text"
                    value={citizenGPSLat}
                    onChange={(e) => setCitizenGPSLat(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Your Device Longitude</label>
                  <input 
                    type="text"
                    value={citizenGPSLng}
                    onChange={(e) => setCitizenGPSLng(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => { setCitizenGPSLat('11.0183'); setCitizenGPSLng('76.9725'); }}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 cursor-pointer"
                >
                  Central Zone (Sathy Rd)
                </button>
                <button
                  onClick={() => { setCitizenGPSLat('11.0287'); setCitizenGPSLng('77.0024'); }}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 cursor-pointer"
                >
                  East Zone (Peelamedu)
                </button>
                <button
                  onClick={() => { setCitizenGPSLat('11.0084'); setCitizenGPSLng('76.9512'); }}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 cursor-pointer"
                >
                  West Zone (RS Puram)
                </button>
              </div>
            </div>

            {/* Deck of pending consensus items */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {issues.filter(iss => iss.status === 'Pending').length > 0 ? (
                issues.filter(iss => iss.status === 'Pending').map((iss) => {
                  const getDistanceMetersLocal = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                    const R = 6371000;
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a =
                      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return Math.round(R * c);
                  };

                  const dist = getDistanceMetersLocal(
                    parseFloat(citizenGPSLat) || 0,
                    parseFloat(citizenGPSLng) || 0,
                    iss.geotag.lat,
                    iss.geotag.lng
                  );

                  const isVouchLocked = dist > 500;
                  const alreadyVoted = iss.verifications.some(v => v.name === currentCitizen?.name);

                  // Setup display traits for distance
                  let rangeBadgeColor = "";
                  let rangeLabel = "";
                  if (dist <= 100) {
                    rangeBadgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-900";
                    rangeLabel = "Direct Physical Range";
                  } else if (dist <= 300) {
                    rangeBadgeColor = "text-cyan-400 bg-cyan-950/40 border-cyan-900";
                    rangeLabel = "Visual Sightline Range";
                  } else if (dist <= 500) {
                    rangeBadgeColor = "text-yellow-400 bg-yellow-950/40 border-yellow-900";
                    rangeLabel = "Ward Boundary Range";
                  } else {
                    rangeBadgeColor = "text-rose-400 bg-rose-950/40 border-rose-900";
                    rangeLabel = "Out of Bounds (Vouch Locked)";
                  }

                  const selectedMethod = cardMethods[iss.id] || "Secure GNSS Checksum";
                  const isAffirmed = cardAffirmations[iss.id] || false;

                  const expectedIntegrity = isVouchLocked 
                    ? 0 
                    : Math.min(100, Math.round((Math.max(50, 100 - (dist / 7.5)) * 0.6) + ((currentCitizen?.trustScore || 94) * 0.4)));

                  return (
                    <div key={iss.id} className="bg-[#111114] border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start text-xs font-mono">
                          <span className="text-indigo-400 font-bold">#{iss.reportNumber}</span>
                          <span className="text-zinc-500">Zone: {iss.zone}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-bold text-zinc-200 line-clamp-1">{iss.title}</h3>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-normal mt-1">{iss.description}</p>
                        </div>

                        {/* Interactive Distance Telemetry Meter */}
                        <div className="bg-[#0c0c0e] border border-zinc-900 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-zinc-500">Proximity Distance:</span>
                            <span className="text-zinc-300 font-bold">{dist.toLocaleString()} meters</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${isVouchLocked ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${Math.min(100, (dist / 500) * 100)}%` }}
                            ></div>
                          </div>

                          <div className={`flex items-center justify-center border rounded-lg py-1 text-[9px] font-mono font-bold uppercase tracking-wider ${rangeBadgeColor}`}>
                            <MapPin className="w-3 h-3 mr-1" /> {rangeLabel}
                          </div>
                        </div>

                        {/* Verification Settings / Integrity Parameters */}
                        {!isVouchLocked && !alreadyVoted && (
                          <div className="space-y-2.5 pt-1">
                            <div>
                              <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Select Validation Method</label>
                              <select
                                value={selectedMethod}
                                onChange={(e) => setCardMethods({ ...cardMethods, [iss.id]: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                              >
                                <option value="Secure GNSS Checksum">Secure GNSS Checksum (Hardware-Signed)</option>
                                <option value="Coimbatore Municipal Wi-Fi Hub">Coimbatore Wi-Fi Hub (BSSID Match)</option>
                                <option value="Cellular Tower Triangulation">Cellular Triangulation (BSNL/Jio/Airtel)</option>
                                <option value="Aadhaar Geofence Match">Aadhaar Resident Geofence Match</option>
                              </select>
                            </div>

                            {/* Integrity checklist */}
                            <div className="bg-[#08080a] p-2.5 rounded-lg text-[10px] space-y-1 font-mono border border-zinc-900 text-zinc-400">
                              <div className="flex justify-between">
                                <span>GNSS Anti-Spoof Shield:</span>
                                <span className="text-emerald-400 font-bold flex items-center"><ShieldCheck className="w-3 h-3 mr-0.5" /> SECURE</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Coimbatore Resident ID:</span>
                                <span className="text-emerald-400 font-bold flex items-center"><UserCheck className="w-3 h-3 mr-0.5" /> CONFIRMED</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Proximity Consensus Weight:</span>
                                <span className="text-indigo-400 font-bold">~{expectedIntegrity}% Integrity Score</span>
                              </div>
                            </div>

                            {/* Legal affirmation code check */}
                            <label className="flex items-start gap-2 cursor-pointer pt-1 group select-none">
                              <input
                                type="checkbox"
                                checked={isAffirmed}
                                onChange={(e) => setCardAffirmations({ ...cardAffirmations, [iss.id]: e.target.checked })}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 leading-normal">
                                I affirm under civic penalty that I am physically present at this site and have witnessed this issue.
                              </span>
                            </label>
                          </div>
                        )}

                        <div className="bg-zinc-950 p-2.5 rounded-xl text-[10px] text-zinc-400 space-y-1 font-mono border border-zinc-900">
                          <div className="flex justify-between">
                            <span>Report Coordinates:</span>
                            <span className="text-zinc-300 font-bold">{iss.geotag.lat.toFixed(4)}, {iss.geotag.lng.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active vouches:</span>
                            <span className="text-indigo-400 font-bold">{iss.verifications.length} / 3 citizens</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-zinc-850">
                        {alreadyVoted ? (
                          <div className="w-full py-2 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-[10px] font-mono text-center rounded-xl font-bold flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" /> VOUCHED SUCCESSFULLY
                          </div>
                        ) : isVouchLocked ? (
                          <div className="w-full py-2 bg-rose-950/20 border border-rose-900/40 text-rose-400 text-[10px] font-mono text-center rounded-xl font-bold flex items-center justify-center gap-1">
                            <ShieldAlert className="w-4 h-4" /> VOUCH LOCKED: OUT OF RANGE
                          </div>
                        ) : (
                          <button
                            onClick={() => handleVouchVoucherSubmit(iss.id)}
                            disabled={!isAffirmed}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md hover:shadow-indigo-500/10"
                          >
                            <UserCheck className="w-4 h-4" /> Cast Proximity Verification
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-[#111114] border border-zinc-850 rounded-2xl p-12 text-center text-zinc-500 italic">
                  All logged civic grievances have successfully achieved community consensus and are dispatched for resolution!
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: MY HISTORY (PERSISTENT REDIRECTS) */}
        {/* ======================================================== */}
        {activeTab === 'my-grievances' && (
          <div className="space-y-6">
            
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-850 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white">My Grievance Log history</h2>
                <p className="text-xs text-zinc-500 mt-1">Detailed resolutions and comparative telemetry logs.</p>
              </div>

              <div className="flex items-center gap-2">
                {statusList.map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      filterStatus === st ? 'bg-indigo-600 text-white font-bold' : 'bg-[#111114] border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCitizen ? (
                filteredIssuesList.filter(i => {
                  return i.userId === currentCitizen.uid || i.reporterName.toLowerCase().includes(currentCitizen.name.toLowerCase());
                }).length > 0 ? (
                  filteredIssuesList.filter(i => {
                    return i.userId === currentCitizen.uid || i.reporterName.toLowerCase().includes(currentCitizen.name.toLowerCase());
                  }).map(iss => (
                    <div key={iss.id} className="bg-[#111114] border border-zinc-850 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start text-xs font-mono">
                          <span className="text-indigo-400 font-black">#{iss.reportNumber}</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            iss.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-indigo-950 text-indigo-400 border border-indigo-900/40'
                          }`}>{iss.status}</span>
                        </div>
                        <h3 className="text-sm font-black text-white">{iss.title}</h3>
                        <p className="text-xs text-zinc-400 leading-normal">{iss.description}</p>
                        <div className="bg-zinc-950 p-2.5 rounded-xl text-[10px] text-zinc-500 font-mono space-y-1">
                          <div>Responsible: <strong>{iss.department} ({iss.assignedOfficer})</strong></div>
                          <div>Target ETA: <strong className="text-emerald-400">{iss.predictedDeadline}</strong></div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-850 space-y-3">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Remediation Proof</span>
                        {iss.afterImg ? (
                          <BeforeAfterSlider
                            beforeImg={iss.beforeImg || "/images/road_before.jpg"}
                            afterImg={iss.afterImg}
                            category={iss.category}
                          />
                        ) : (
                          <div className="bg-[#0b0b0d] p-4 text-center rounded-xl border border-zinc-900 text-xs text-zinc-500 italic">
                            Pending — Resolution image will be available after completion.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-[#111114] border border-zinc-850 rounded-2xl p-12 text-center text-zinc-500 italic">
                    You haven't submitted any civic grievance reports yet.
                  </div>
                )
              ) : (
                <div className="col-span-full bg-[#111114] border border-zinc-850 rounded-2xl p-12 text-center text-zinc-500 italic">
                  Please log in to check your filing history.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: OFFICER RESOLUTION WORKBENCH */}
        {/* ======================================================== */}
        {activeTab === 'officer-desk' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left list of tickets */}
            <div className="md:col-span-5 bg-[#111114] border border-zinc-850 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-zinc-400 border-b border-zinc-850 pb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Assigned Tickets (Dispatched)
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                {issues.filter(i => i.status !== 'Completed' && i.status !== 'Verified').length > 0 ? (
                  issues.filter(i => i.status !== 'Completed' && i.status !== 'Verified').map(iss => (
                    <div
                      key={iss.id}
                      onClick={() => {
                        setSelectedOfficerTicketId(iss.id);
                        setOfficerRemarks(`Water pipeline sealed. Flow rate checked and normal pressure restored. verified on-site.`);
                      }}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedOfficerTicketId === iss.id 
                          ? 'bg-[#17171d] border-indigo-500' 
                          : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 font-mono text-[10px]">
                        <span className="text-indigo-400">#{iss.reportNumber}</span>
                        <span className="text-rose-400 font-bold">{iss.severity}</span>
                      </div>
                      <h4 className="font-bold text-zinc-300 truncate">{iss.title}</h4>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{iss.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic text-center py-6">All assigned tickets resolved successfully!</p>
                )}
              </div>
            </div>

            {/* Right form submission */}
            <div className="md:col-span-7 bg-[#111114] border border-zinc-850 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-zinc-400 border-b border-zinc-850 pb-2">Work order closure submission</h3>
              
              {selectedOfficerTicketId ? (
                <form onSubmit={handleOfficerCompleteSubmit} className="space-y-4 text-xs">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-[11px] text-zinc-400">
                    <div>Filing resolution proof for: <strong>{selectedOfficerTicketId}</strong></div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Upload comparative After Resolution photo</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const matchingComp = issues.find(c => c.id === selectedOfficerTicketId);
                          if (matchingComp) {
                            if (matchingComp.category === "Water Leakage") setOfficerAfterImgBase64("/images/water_after.jpg");
                            else if (matchingComp.category === "Road Damage") setOfficerAfterImgBase64("/images/road_after.jpg");
                            else if (matchingComp.category === "Sanitation") setOfficerAfterImgBase64("/images/garbage_after.jpg");
                            else if (matchingComp.category === "Streetlight") setOfficerAfterImgBase64("/images/streetlight_after.jpg");
                            else if (matchingComp.category === "Sewage Overflow") setOfficerAfterImgBase64("/images/sewage_after.jpg");
                            else setOfficerAfterImgBase64("/images/road_after.jpg");
                          }
                          setGlobalMessage({ text: "Standard resolution visual pre-filled for testing.", type: "success" });
                        }}
                        className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded font-bold uppercase text-[9px] text-zinc-400 cursor-pointer"
                      >
                        Auto-fill resolution photo
                      </button>

                      <label className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded font-bold uppercase text-[9px] text-zinc-400 text-center cursor-pointer block">
                        <span>Browse...</span>
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleOfficerAfterImgChange}
                        />
                      </label>
                    </div>
                  </div>

                  {officerAfterImgBase64 && (
                    <div className="h-[140px] rounded-lg overflow-hidden border border-zinc-800 bg-black">
                      <img src={officerAfterImgBase64} alt="Resolution" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1 font-mono uppercase text-[9px]">Engineeringremarks</label>
                    <textarea 
                      rows={3}
                      placeholder="Remarks..."
                      value={officerRemarks}
                      onChange={(e) => setOfficerRemarks(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:outline-none placeholder:text-zinc-700 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isOfficerSubmitting || !officerAfterImgBase64}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    Submit Work Closure Order
                  </button>
                </form>
              ) : (
                <p className="text-zinc-500 text-center py-12 italic text-xs">Please select an assigned grievance ticket on the left menu to record resolution work.</p>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 6: MY PROFILE */}
        {/* ======================================================== */}
        {activeTab === 'profile' && currentCitizen && (
          <div className="max-w-2xl mx-auto bg-[#111114] border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-zinc-850 pb-4">
              <img 
                src={currentCitizen.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border border-indigo-500/30"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Verified Citizen Identity Card</span>
                <h2 className="text-xl font-extrabold text-white">{currentCitizen.name}</h2>
                <div className="text-xs text-indigo-400 font-mono flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> Mapped Geozone: <span className="underline font-bold text-zinc-300">{currentCitizen.assignedGeozone || currentCitizen.ocrExtractedAddress}</span>
                </div>
              </div>
            </div>

            {/* Visual ID Card details */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                SECURE PROFILE
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 block font-mono text-[9px]">DOCUMENT ID TYPE</span>
                    <strong className="text-zinc-300">{currentCitizen.idType}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block font-mono text-[9px]">MASKED DOCUMENT REFERENCE</span>
                    <strong className="text-zinc-300 font-mono">{currentCitizen.idNumberMasked || 'XXXX-XXXX-9940'}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 block font-mono text-[9px]">OFFICIALLY RECORDED OCR ADDRESS</span>
                  <p className="text-zinc-400 font-serif leading-relaxed mt-1 text-[11px]">{currentCitizen.ocrExtractedAddress || currentCitizen.address}</p>
                </div>
              </div>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 block text-[9px]">RAISED GRIDS</span>
                <strong className="text-lg text-zinc-200">{userStats.totalRaised}</strong>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 block text-[9px]">REMEDIATED GRIDS</span>
                <strong className="text-lg text-emerald-400">{userStats.totalResolved}</strong>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 block text-[9px]">ROLE</span>
                <strong className="text-xs text-indigo-400 uppercase font-mono block mt-1">{currentCitizen.role}</strong>
              </div>
            </div>

            {/* Trust scoring gauge */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono">Resident Trust Rating</span>
                <strong className="text-emerald-400 font-mono">{currentCitizen.trustScore}% Verified</strong>
              </div>
              <div className="w-full bg-zinc-900 border border-zinc-850 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentCitizen.trustScore}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 italic leading-normal">"Trust levels automatically escalate based on nearby consensus confirms, authentic EXIF uploads, and zero flagged pixel manipulations."</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 7: ONBOARDING LOGIN & REGISTER PORTAL */}
        {/* ======================================================== */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto bg-[#111114] border border-zinc-850 rounded-2xl p-6 space-y-6">
            
            <div className="flex gap-2 border-b border-zinc-850 pb-4">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                }`}
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleAuthLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="9876543210"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Password</label>
                  <input 
                    type="password" 
                    placeholder="password123"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                    required
                  />
                </div>

                {/* Simulated profiles to help fast-track evaluation */}
                <div className="pt-2">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold mb-1">Fast Testing Quick-Credentials</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setAuthPhone('9876543210'); setAuthPassword('password123'); }}
                      className="py-1 px-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded text-[10px] text-zinc-400 cursor-pointer text-left truncate"
                    >
                      👤 Prakash (Citizen)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthPhone('9999999999'); setAuthPassword('password123'); }}
                      className="py-1 px-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded text-[10px] text-zinc-400 cursor-pointer text-left truncate"
                    >
                      👮 Ganeshan (Officer)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthProcessing}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer mt-4"
                >
                  {isAuthProcessing ? "Authenticating Session..." : "Sign In Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuthRegister} className="space-y-4 text-xs">
                
                {/* Simulated profile loader buttons to fast track */}
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Onboard quick test citizens:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickSeedOnboard('aadhaar')}
                      className="py-1.5 px-2 bg-[#17171d] hover:bg-zinc-800 rounded border border-zinc-800 text-[10px] text-zinc-400 cursor-pointer"
                    >
                      Pre-fill Prakash (Aadhaar)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSeedOnboard('voter')}
                      className="py-1.5 px-2 bg-[#17171d] hover:bg-zinc-800 rounded border border-zinc-800 text-[10px] text-zinc-400 cursor-pointer"
                    >
                      Pre-fill Vignesh (Voter ID)
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-850 pt-3">
                  <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider">Government ID Scanned Copy</label>
                  <label className="border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl p-3 bg-zinc-950 hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 cursor-pointer">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleRegProofFileChange}
                      className="hidden"
                    />
                    <Camera className="w-5 h-5 text-zinc-500" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-zinc-300">
                        {regProofFileName ? `📎 ${regProofFileName}` : 'Choose scanned file...'}
                      </p>
                      <p className="text-[9px] text-zinc-500">Gemini OCR extracts details instantly</p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-500 mb-0.5">Government ID Type</label>
                    <select
                      value={regIdType}
                      onChange={(e) => setRegIdType(e.target.value as any)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-300 focus:outline-none"
                    >
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Utility Bill">Utility Bill</option>
                      <option value="Property Tax Receipt">Property Tax Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-0.5">ID Reference Number</label>
                    <input 
                      type="text" 
                      placeholder="552388129940"
                      value={regIdNumber}
                      onChange={(e) => setRegIdNumber(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-500 mb-0.5">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="9876543210"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-0.5">Password</label>
                    <input 
                      type="password" 
                      placeholder="password123"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 mb-0.5">Citizen full Name</label>
                  <input 
                    type="text" 
                    placeholder="R. Prakash"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-zinc-500 mb-0.5">Resident full Address</label>
                      <input 
                        type="text" 
                        placeholder="14, Sathy Road, Gandhipuram"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-0.5">Admin Zone</label>
                      <select
                        value={regZone}
                        onChange={(e) => setRegZone(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2 py-2 text-zinc-300 focus:outline-none"
                      >
                        <option value="Central Zone">Central</option>
                        <option value="East Zone">East</option>
                        <option value="West Zone">West</option>
                        <option value="North Zone">North</option>
                        <option value="South Zone">South</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-500 mb-0.5">Nearest Landmark</label>
                      <input 
                        type="text"
                        placeholder="Near City Center / Bus Stop"
                        value={regLandmark}
                        onChange={(e) => setRegLandmark(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-0.5">PIN Code</label>
                      <input 
                        type="text"
                        placeholder="641012"
                        value={regPincode}
                        onChange={(e) => setRegPincode(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-500 mb-0.5">GPS Latitude</label>
                      <input 
                        type="text"
                        value={regLat}
                        onChange={(e) => setRegLat(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-0.5">GPS Longitude</label>
                      <input 
                        type="text"
                        value={regLng}
                        onChange={(e) => setRegLng(e.target.value)}
                        className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-2.5 text-[10px] text-indigo-300">
                    <div className="font-semibold">Verification checklist</div>
                    <div className="mt-1 text-[9px] text-indigo-200/80">• ID proof is scanned and parsed • Address is geo-tagged • Zone is auto-mapped for ward routing</div>
                  </div>
                </div>

                {isAuthProcessing && ocrLog.length > 0 && (
                  <div className="bg-black border border-indigo-500/10 rounded-xl p-3 text-[10px] text-indigo-400 font-mono space-y-1">
                    {ocrLog.map((log, i) => <div key={i} className="animate-fadeIn">{log}</div>)}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthProcessing || !regName || !authPhone || !authPassword}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  {isAuthProcessing ? "Extracting document data with Gemini OCR..." : "Onboard Citizen Account"}
                </button>
              </form>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-6 border-t border-zinc-850 bg-[#0a0a0d] text-center text-[10px] text-zinc-600">
        <p>© 2026 Coimbatore Municipal Corporation. All operations logged in accordance with the Civic Accountability SLA Act.</p>
      </footer>
    </div>
  );
}
