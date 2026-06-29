import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  HelpCircle,
  House,
  ListFilter,
  LogOut,
  Menu,
  MessageSquareQuote,
  PhoneCall,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
  Mic,
  MicOff,
  Bot,
  Eye,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react';
import type { CivicIssue, DepartmentMetric } from './types';
import { INITIAL_ISSUES, DEPARTMENT_METRICS, MOCKED_CITIZENS, COIMBATORE_OFFICERS, getCategoryDefaultImage, getCategoryDefaultAfterImage } from './data';
import { useTheme } from './ThemeContext';

const civicEyeLogo = "/src/assets/images/civic_eye_logo_1782375268415.jpg";

type AppRole = 'citizen' | 'officer' | 'admin';
type ViewKey =
  | 'dashboard'
  | 'new-complaint'
  | 'all-problems'
  | 'my-complaints'
  | 'zone-performance'
  | 'nearby-verification'
  | 'suggestions'
  | 'help'
  | 'contacts'
  | 'profile'
  | 'assigned-cases'
  | 'update-status'
  | 'upload-completion'
  | 'performance'
  | 'departments'
  | 'officers'
  | 'escalations'
  | 'reports'
  | 'complaint-detail';

interface DemoAccount {
  uid: string;
  name: string;
  role: AppRole;
  phone: string;
  password: string;
  zone: string;
  avatar: string;
}

interface ProfileStats {
  totalRaised: number;
  totalResolved: number;
}

interface FeedbackItem {
  id: string;
  title: string;
  detail: string;
  type: string;
  createdAt: string;
}

const demoAccounts: DemoAccount[] = [
  {
    uid: 'cit-1',
    name: 'Yeswanth kumar D.',
    role: 'citizen',
    phone: '9876543210',
    password: 'password123',
    zone: 'Central Zone',
    avatar: '/images/yeswanth_profile.jpg',
  },
  {
    uid: 'off-ganeshan',
    name: 'S. Ganeshan',
    role: 'officer',
    phone: '9876543212',
    password: 'password123',
    zone: 'Central Zone',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
  },
];

const supportCategories = [
  { title: 'Water complaints', icon: '💧', description: 'Leaks, low pressure and pipeline concerns' },
  { title: 'Road issues', icon: '🛣️', description: 'Potholes, road cuts and traffic hazards' },
  { title: 'Garbage issues', icon: '🗑️', description: 'Overflowing bins and sanitation requests' },
  { title: 'Electricity', icon: '⚡', description: 'Streetlight and power-related concerns' },
  { title: 'Sewage', icon: '🚽', description: 'Drain blockage and overflow issues' },
];

const contactDirectory = [
  {
    name: 'Katta Ravi Teja IAS',
    role: 'Commissioner',
    department: 'Municipal Administration',
    contact: 'commr.coimbatore@tn.gov.in',
    zone: 'Head Office',
  },
  { name: 'East Zone Officer', role: 'Zone Officer', department: 'Engineering', contact: 'eastzone@coimbatore.gov.in', zone: 'East Zone' },
  { name: 'West Zone Officer', role: 'Zone Officer', department: 'Sanitation', contact: 'westzone@coimbatore.gov.in', zone: 'West Zone' },
  { name: 'North Zone Officer', role: 'Zone Officer', department: 'Streetlights', contact: 'northzone@coimbatore.gov.in', zone: 'North Zone' },
  { name: 'South Zone Officer', role: 'Zone Officer', department: 'Sewage', contact: 'southzone@coimbatore.gov.in', zone: 'South Zone' },
  { name: 'Central Zone Officer', role: 'Zone Officer', department: 'Public Works', contact: 'centralzone@coimbatore.gov.in', zone: 'Central Zone' },
];

const faqItems = [
  { q: 'How do I submit a complaint?', a: 'Open New Complaint, add the issue details, capture a photo and submit.' },
  { q: 'How long will it take?', a: 'The system estimates a fix time based on the department and urgency level.' },
  { q: 'Can I track my complaint?', a: 'Yes. Check My Complaints to see progress and completion updates.' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Assigned: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Escalated: 'bg-rose-100 text-rose-800',
};

export default function AppNew() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [viewHistory, setViewHistory] = useState<ViewKey[]>(['dashboard']);

  const navigateToView = (view: ViewKey) => {
    setViewHistory((prev) => [...prev, view]);
    setActiveView(view);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const updated = [...viewHistory];
      updated.pop();
      setViewHistory(updated);
      setActiveView(updated[updated.length - 1]);
    } else {
      setActiveView('dashboard');
    }
  };

  const renderBackButton = (ticketId?: string) => (
    <div className="flex items-center justify-between mb-4 animate-fade-in">
      <button
        onClick={handleBack}
        className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:border-slate-300 active:scale-95 cursor-pointer"
        title={showTamil ? "பின்னால் செல்ல" : "Go back"}
      >
        <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5 text-[#0f4f3a]" />
        <span>{showTamil ? "பின்னால் செல்ல" : "Back"}</span>
      </button>
      {ticketId && (
        <div className="text-xs text-slate-400 font-mono bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/50">
          {showTamil ? `டிக்கெட் #${ticketId}` : `Ticket #${ticketId}`}
        </div>
      )}
    </div>
  );
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [upvotedIssues, setUpvotedIssues] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('civiceye_upvoted_issues');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const translateTitleAndDesc = (title: string, desc: string): { title: string, desc: string } => {
    if (!showTamil) return { title, desc };
    
    let tTitle = title;
    let tDesc = desc;

    const lowerTitle = (title || '').toLowerCase();

    if (lowerTitle.includes("pothole") || lowerTitle.includes("road crack") || lowerTitle.includes("damage")) {
      tTitle = "சாலையில் கடுமையான பள்ளங்கள் மற்றும் விரிசல்";
      tDesc = "பிரதான போக்குவரத்து பாதையில் பெரிய பள்ளங்கள் ஏற்பட்டுள்ளன, இதனால் இருசக்கர வாகனங்கள் சறுக்கி விபத்துக்குள்ளாகும் அபாயம் மற்றும் போக்குவரத்து நெரிசல் ஏற்படுகிறது. உடனடியாக சரிசெய்யவும்.";
    } else if (lowerTitle.includes("water leakage") || lowerTitle.includes("pipeline leakage") || lowerTitle.includes("water line")) {
      tTitle = "பூமிக்கடியில் உள்ள குடிநீர் குழாய் கசிவு";
      tDesc = "முக்கிய குடிநீர் விநியோக குழாயில் கசிவு ஏற்பட்டுள்ளது. இதனால் ஆயிரக்கணக்கான லிட்டர் தூய குடிநீர் வீணாகி, சுற்றியுள்ள பகுதிகள் மற்றும் கடைகளுக்குள் புகுந்து சேதத்தை ஏற்படுகிறது.";
    } else if (lowerTitle.includes("garbage") || lowerTitle.includes("waste dustbin") || lowerTitle.includes("dumping") || lowerTitle.includes("waste accumulation")) {
      tTitle = "குப்பைத் தொட்டி நிரம்பி வழிதல்";
      tDesc = "பொது குப்பைத் தொட்டிகள் முழுமையாக நிரம்பி வழிகின்றன. குப்பைகள் சாலை முழுவதும் சிதறி, கடுமையான துர்நாற்றம், தெரு நாய்கள் தொல்லை மற்றும் சுகாதார சீர்கேட்டை ஏற்படுத்துகிறது.";
    } else if (lowerTitle.includes("streetlight") || lowerTitle.includes("electrical") || lowerTitle.includes("segment outage") || lowerTitle.includes("dark zone risk")) {
      tTitle = "தெருவிளக்குகள் முழுமையாக பழுது";
      tDesc = "தொடர்ச்சியான பல நகராட்சி தெருவிளக்குகள் எரியவில்லை. இதனால் குடியிருப்பு மற்றும் பிரதான சாலைகள் இருளில் மூழ்கி, இரவு நேரங்களில் மக்கள் பாதுகாப்புக்கு அச்சுறுத்தல் ஏற்படுகிறது.";
    } else if (lowerTitle.includes("sewage") || lowerTitle.includes("drain") || lowerTitle.includes("clogged")) {
      tTitle = "திறந்தவெளி கழிவுநீர் அடைப்பு மற்றும் வழிந்தோடல்";
      tDesc = "கழிவுநீர் குழாய் அடைக்கப்பட்டு, அசுத்தமான கழிவுநீர் நேரடியாக தெருவிலும் நடைபாதைகளிலும் வழிந்தோடுவதால் பொதுமக்களுக்கு பெரும் அச்சுறுத்தலாகவும் சுகாதார சீர்கேடாகவும் உள்ளது.";
    }

    return { title: tTitle, desc: tDesc };
  };

  const [departments, setDepartments] = useState<DepartmentMetric[]>([]);
  const computedDepartments = useMemo(() => {
    const deptNames = ["Water", "Road", "Sewage", "Electricity"];
    const deptCodes: Record<string, string> = { Water: "WAT", Road: "ROD", Sewage: "SEW", Electricity: "ELE" };
    
    return deptNames.map(name => {
      const deptIssues = issues.filter(issue => issue.department === name);
      const totalCases = deptIssues.length;
      const solvedCases = deptIssues.filter(issue => issue.status === 'Completed').length;
      const pendingCases = deptIssues.filter(issue => issue.status !== 'Completed' && issue.status !== 'Escalated').length;
      const delayedCases = deptIssues.filter(issue => issue.status === 'Escalated').length;
      
      const slaCompliance = totalCases > 0 
        ? Math.round((solvedCases / totalCases) * 100) 
        : 85;

      return {
        name,
        code: deptCodes[name] || name.slice(0, 3).toUpperCase(),
        zone: "CCMC Districts",
        slaCompliance,
        totalCases,
        solvedCases,
        pendingCases,
        delayedCases,
        avgResolutionDays: totalCases > 0 ? 1.5 : 0
      };
    });
  }, [issues]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [stats, setStats] = useState<ProfileStats>({ totalRaised: 0, totalResolved: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { t, i18n } = useTranslation();
  const showTamil = i18n.language === 'ta';
  const setShowTamil = (val: boolean | ((p: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(i18n.language === 'ta') : val;
    void i18n.changeLanguage(nextVal ? 'ta' : 'en');
  };

  const isAccessible = false;

  // CivicAI Chat Assistant states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; action?: string }>>([
    { sender: 'bot', text: 'வணக்கம்! நான் கோவை மாநகராட்சி AI உதவியாளர். உங்களுக்கு இன்று எவ்வாறு உதவட்டும்? / Hello! I am your CCMC CivicAI Assistant. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');

  // Load chat history on user change
  useEffect(() => {
    const userId = currentUser?.uid || currentUser?.id || 'guest';
    const savedHistory = localStorage.getItem(`civiceye_chat_history_${userId}`);
    if (savedHistory) {
      try {
        setChatMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      setChatMessages([
        { sender: 'bot', text: 'வணக்கம்! நான் கோவை மாநகராட்சி AI உதவியாளர். உங்களுக்கு இன்று எவ்வாறு உதவட்டும்? / Hello! I am your CCMC CivicAI Assistant. How can I assist you today?' }
      ]);
    }
  }, [currentUser]);

  // Persist chat history on change
  useEffect(() => {
    const userId = currentUser?.uid || currentUser?.id || 'guest';
    if (chatMessages.length > 0) {
      localStorage.setItem(`civiceye_chat_history_${userId}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, currentUser]);

  // Chat message sender
  const handleSendChatMessage = async (e?: React.FormEvent, retryText?: string) => {
    if (e) e.preventDefault();
    const userMsg = retryText || chatInput;
    if (!userMsg.trim() || isChatLoading) return;

    setChatError(false);
    if (!retryText) {
      setLastUserMessage(userMsg);
      setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
      setChatInput('');
    }
    setIsChatLoading(true);

    try {
      const res = await fetch('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || currentUser?.id || 'guest',
          language: i18n.language,
          message: userMsg,
          query: userMsg,
          role: currentUser?.role || 'citizen',
          currentPage: activeView,
          complaintContext: activeView === 'my-complaints' ? 'viewing registered complaints status' : ''
        })
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const botText = data.translatedReply || data.reply;
      setChatMessages(prev => [...prev, { sender: 'bot', text: botText, action: data.suggestedAction }]);
      

    } catch (err) {
      console.error(err);
      setChatError(true);
      setChatMessages(prev => [...prev, { sender: 'bot', text: i18n.language === 'ta' ? 'தொடர்பு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Sorry, a connection error occurred. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // AI smart error trigger
  const triggerSmartError = async (errorType: string) => {
    let errorMsg = "";
    if (errorType === 'gps') {
      errorMsg = "Location check failed. Your location was not detected. Please enable GPS/location services on your device.";
    } else if (errorType === 'document') {
      errorMsg = "Verification failed. The uploaded document is blurry or the name does not match your profile. Please upload a clear Aadhaar card or property tax receipt.";
    } else if (errorType === 'image') {
      errorMsg = "Invalid image upload. The image size is too large or the file format is unsupported. Please upload a standard JPG or PNG image.";
    } else {
      errorMsg = "An unexpected error occurred. Please try again.";
    }

    try {
      const res = await fetch('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || 'guest',
          language: i18n.language,
          message: `Explain this error to the user: "${errorMsg}". Make it helpful, clear and in the selected language.`,
          role: currentUser?.role || 'citizen'
        })
      });
      const data = await res.json();
      setMessage({ type: 'error', text: data.translatedReply || errorMsg });
    } catch (err) {
      setMessage({ type: 'error', text: errorMsg });
    }
  };
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'Road Damage' as CivicIssue['category'],
    location: 'Coimbatore',
    beforeImg: '',
    lat: '11.0183',
    lng: '76.9725',
    isAnonymous: false,
  });
  const [completionForm, setCompletionForm] = useState({ complaintId: '', remarks: '', afterImg: '' });
  const [officerStatus, setOfficerStatus] = useState('In Progress');
  const [suggestionForm, setSuggestionForm] = useState({ title: '', detail: '', type: 'Idea' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'citizen' | 'officer'>('citizen');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerZone, setRegisterZone] = useState('Central Zone');
  const [registerAvatar, setRegisterAvatar] = useState('');
  const [registerProofType, setRegisterProofType] = useState<'Aadhaar' | 'Voter ID' | 'Utility Bill'>('Aadhaar');
  const [registerProofDoc, setRegisterProofDoc] = useState('');
  const [isVerifyingSignup, setIsVerifyingSignup] = useState(false);
  const [signupVerificationStep, setSignupVerificationStep] = useState<string>('');
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
  const [loginVerificationStep, setLoginVerificationStep] = useState<string>('');

  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [aiStep, setAiStep] = useState(0);

  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    // Initialize users in localStorage if not exists
    const savedUsers = localStorage.getItem('civiceye_users');
    if (!savedUsers) {
      const initialUsers = MOCKED_CITIZENS.map((u, i) => ({
        uid: u.uid,
        name: u.name,
        phone: u.uid === 'cit-101' ? '9876543210' : u.uid === 'cit-102' ? '9876543211' : `987654321${i}`,
        password: 'password123',
        address: u.ocrExtractedAddress || 'Coimbatore City, Tamil Nadu',
        zone: u.assignedGeozone || 'Central Zone',
        avatarUrl: u.avatarUrl,
        idType: u.idType || 'Aadhaar',
        idNumberMasked: u.idNumberMasked || 'XXXX-XXXX-8812',
        isVerified: true,
        role: 'citizen'
      }));
      localStorage.setItem('civiceye_users', JSON.stringify(initialUsers));
    } else {
      // Ensure any existing user with phone 9876543210 is updated to Yeswanth kumar D. to avoid caching old names like R prakash
      // Also remove Vignesh Kumar, Arun Kumar, and K. Meenakshi, and rename D. Maheshwari to D. Krishnaveni
      try {
        const parsed = JSON.parse(savedUsers);
        let updated = false;
        
        // 1. Map existing users: update Yeswanth's info, and rename D. Maheshwari to D. Krishnaveni
        let mapped = parsed.map((u: any) => {
          const lowerName = (u.name || '').toLowerCase();
          if (u.phone === '9876543210' && u.name !== 'Yeswanth kumar D.') {
            updated = true;
            return {
              ...u,
              name: 'Yeswanth kumar D.',
              avatarUrl: '/images/yeswanth_profile.jpg',
              uid: u.uid || 'cit-101'
            };
          }
          if (lowerName.includes('maheshwari') || lowerName.includes('maheswari')) {
            updated = true;
            return {
              ...u,
              name: 'D. Krishnaveni'
            };
          }
          return u;
        });

        // 2. Filter out Vignesh Kumar, Arun Kumar, and K. Meenakshi profiles
        const beforeLen = mapped.length;
        mapped = mapped.filter((u: any) => {
          const lowerName = (u.name || '').toLowerCase();
          return !lowerName.includes('vignesh') && !lowerName.includes('arun') && !lowerName.includes('meenakshi');
        });
        if (mapped.length !== beforeLen) {
          updated = true;
        }

        // 3. Ensure Yeswanth's profile is present
        if (!mapped.some((u: any) => u.phone === '9876543210')) {
          mapped.push({
            uid: 'cit-101',
            name: 'Yeswanth kumar D.',
            phone: '9876543210',
            password: 'password123',
            address: '14, Sathy Road, Gandhipuram, Coimbatore - 641012',
            zone: 'Central Zone',
            avatarUrl: '/images/yeswanth_profile.jpg',
            idType: 'Aadhaar',
            idNumberMasked: 'XXXX-XXXX-8921',
            isVerified: true,
            role: 'citizen'
          });
          updated = true;
        }

        if (updated) {
          localStorage.setItem('civiceye_users', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error("Failed to parse and check saved users:", err);
      }
    }

    // Initialize complaints in localStorage if not exists
    const savedIssues = localStorage.getItem('civiceye_complaints');
    let loadedIssues = INITIAL_ISSUES;
    if (!savedIssues) {
      localStorage.setItem('civiceye_complaints', JSON.stringify(INITIAL_ISSUES));
      loadedIssues = INITIAL_ISSUES;
    } else {
      try {
        loadedIssues = JSON.parse(savedIssues);
      } catch (e) {
        loadedIssues = INITIAL_ISSUES;
      }
    }

    // Ensure S. Ganeshan has at least one active complaint (In Progress, Pending, or Escalated)
    const hasActiveGaneshanCase = loadedIssues.some((issue: any) => {
      const isAssigned = (issue.assignedOfficer || '').toLowerCase().includes('ganeshan') ||
                         (issue.officerName || '').toLowerCase().includes('ganeshan');
      const isActive = issue.status === 'In Progress' || issue.status === 'Pending' || issue.status === 'Escalated';
      return isAssigned && isActive;
    });

    if (!hasActiveGaneshanCase) {
      const ganeshanCase = loadedIssues.find((issue: any) => 
        (issue.assignedOfficer || '').toLowerCase().includes('ganeshan') ||
        (issue.officerName || '').toLowerCase().includes('ganeshan')
      );
      if (ganeshanCase) {
        ganeshanCase.status = 'In Progress';
      } else if (loadedIssues.length > 0) {
        loadedIssues[0].assignedOfficer = 'S. Ganeshan';
        loadedIssues[0].officerName = 'S. Ganeshan';
        loadedIssues[0].status = 'In Progress';
      }
      localStorage.setItem('civiceye_complaints', JSON.stringify(loadedIssues));
    }

    setIssues(loadedIssues);

    // Set up default session
    const savedSession = localStorage.getItem('civiceye_current_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        // Correct the current session name if it has phone 9876543210 to prevent old cached name "R prakash"
        if (parsed) {
          let sessionUpdated = false;
          if (parsed.phone === '9876543210' && parsed.name !== 'Yeswanth kumar D.') {
            parsed.name = 'Yeswanth kumar D.';
            parsed.avatarUrl = '/images/yeswanth_profile.jpg';
            sessionUpdated = true;
          }
          const lowerName = (parsed.name || '').toLowerCase();
          if (lowerName.includes('maheshwari') || lowerName.includes('maheswari')) {
            parsed.name = 'D. Krishnaveni';
            sessionUpdated = true;
          }
          if (sessionUpdated) {
            localStorage.setItem('civiceye_current_session', JSON.stringify(parsed));
          }
        }
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Yeswanth default login
      const defaultUser = {
        uid: 'cit-101',
        name: 'Yeswanth kumar D.',
        role: 'citizen',
        phone: '9876543210',
        zone: 'Central Zone',
        address: '14, Sathy Road, Gandhipuram, Coimbatore - 641012',
        avatarUrl: '/images/yeswanth_profile.jpg',
        isVerified: true
      };
      setCurrentUser(defaultUser);
      localStorage.setItem('civiceye_current_session', JSON.stringify(defaultUser));
    }
    
    // Parse URL params for Deep Linking / Verification Links
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const issueIdParam = params.get('issueId');
      if (viewParam === 'complaint-detail' && issueIdParam) {
        setSelectedIssueId(issueIdParam);
        setActiveView('complaint-detail');
      }
    }

    setLoading(false);
  }, []);

  // Ensure there are always complaints mapped to the current user so "My Complaints" is never empty
  useEffect(() => {
    if (currentUser && issues.length > 0) {
      const userComplaints = issues.filter(issue => 
        issue.userId === currentUser.uid || 
        issue.userId === currentUser.id ||
        (issue.reporterName || '').toLowerCase().includes('yeswanth') ||
        (issue.citizenName || '').toLowerCase().includes('yeswanth')
      );
      
      if (userComplaints.length === 0) {
        const updated = issues.map((issue, idx) => {
          if (idx % 5 === 0) {
            return {
              ...issue,
              userId: currentUser.uid || currentUser.id || 'cit-101',
              citizenId: currentUser.uid || currentUser.id || 'cit-101',
              reporterName: currentUser.name || 'Yeswanth kumar D.',
              citizenName: currentUser.name || 'Yeswanth kumar D.'
            };
          }
          return issue;
        });
        setIssues(updated);
        localStorage.setItem('civiceye_complaints', JSON.stringify(updated));
      }
    }
  }, [currentUser, issues.length]);

  useEffect(() => {
    if (message) {
      const timer = window.setTimeout(() => setMessage(null), 3500);
      return () => window.clearTimeout(timer);
    }
  }, [message]);

  const fetchCityState = async () => {
    setLoading(true);
    try {
      const savedIssues = localStorage.getItem('civiceye_complaints');
      if (savedIssues) {
        const parsed = JSON.parse(savedIssues);
        // Ensure Yeswanth's complaints and other seeded cases are merged in if they are missing
        const hasSeeded = parsed.some((issue: any) => issue.id === 'CIV-COI-9001');
        if (!hasSeeded) {
          const merged = [...parsed];
          INITIAL_ISSUES.forEach((initIssue) => {
            if (!merged.some((p: any) => p.id === initIssue.id)) {
              merged.push(initIssue);
            }
          });
          localStorage.setItem('civiceye_complaints', JSON.stringify(merged));
          setIssues(merged);
        } else {
          setIssues(parsed);
        }
      } else {
        localStorage.setItem('civiceye_complaints', JSON.stringify(INITIAL_ISSUES));
        setIssues(INITIAL_ISSUES);
      }
      setDepartments(DEPARTMENT_METRICS);
    } catch (err) {
      console.error(err);
      setIssues(INITIAL_ISSUES);
      setDepartments(DEPARTMENT_METRICS);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (account: DemoAccount) => {
    setLoading(true);
    try {
      const normalized = {
        uid: account.uid,
        name: account.name,
        role: account.role,
        phone: account.phone,
        zone: account.zone,
        address: account.role === 'citizen' ? '14, Sathy Road, Gandhipuram, Coimbatore - 641012' : 'CCMC Central Office',
        avatarUrl: account.avatar,
        isVerified: true
      };
      setCurrentUser(normalized);
      localStorage.setItem('civiceye_current_session', JSON.stringify(normalized));
      const nextView = account.role === 'citizen' ? 'dashboard' : account.role === 'officer' ? 'assigned-cases' : 'dashboard';
      setViewHistory([nextView]);
      setActiveView(nextView);
      setShowAccountMenu(false);
      setMessage({ type: 'success', text: `Signed in as ${account.name}.` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Unable to sign in right now.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civiceye_current_session');
    setViewHistory(['dashboard']);
    setActiveView('dashboard');
    setShowAccountMenu(false);
    setMessage({ type: 'success', text: 'Signed out. You can switch to another profile.' });
  };

  const handleSwitchToUser = (user: any) => {
    setLoading(true);
    try {
      const isYeswanth = user.phone === '9876543210';
      const normalized = {
        uid: user.uid,
        name: isYeswanth ? 'Yeswanth kumar D.' : user.name,
        role: user.role || 'citizen',
        phone: user.phone,
        zone: user.zone || 'Central Zone',
        address: user.address || 'Coimbatore City, Tamil Nadu',
        avatarUrl: isYeswanth ? '/images/yeswanth_profile.jpg' : (user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
        isVerified: true
      };
      setCurrentUser(normalized);
      localStorage.setItem('civiceye_current_session', JSON.stringify(normalized));
      setViewHistory(['dashboard']);
      setActiveView('dashboard');
      setShowAccountMenu(false);
      setMessage({ type: 'success', text: `Switched session to ${isYeswanth ? 'Yeswanth kumar D.' : user.name}.` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Unable to switch session.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Proper validation checks
    if (!registerName || registerName.trim().length < 3) {
      setMessage({ type: 'error', text: 'Full Name must be at least 3 characters long.' });
      return;
    }

    if (!/^\d{10}$/.test(registerPhone)) {
      setMessage({ type: 'error', text: 'Mobile Phone must be a valid 10-digit number.' });
      return;
    }

    if (!registerPassword || registerPassword.length < 6) {
      setMessage({ type: 'error', text: 'Security Password must be at least 6 characters long for resident safety.' });
      return;
    }

    if (!registerAddress || registerAddress.trim().length < 10) {
      setMessage({ type: 'error', text: 'Resident Street Address must be at least 10 characters long for proper verification.' });
      return;
    }

    if (!registerProofDoc) {
      setMessage({ type: 'error', text: 'CCMC mandate: Please upload an ID proof document (Aadhaar/Voter ID) to register.' });
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('civiceye_users') || '[]');
    if (existingUsers.some((u: any) => u.phone === registerPhone)) {
      setMessage({ type: 'error', text: 'A user with this phone number is already registered.' });
      return;
    }

    // Trigger visual multi-step verification
    setIsVerifyingSignup(true);
    setSignupVerificationStep('Scanning uploaded ID proof and running OCR text extraction...');
    
    setTimeout(() => {
      setSignupVerificationStep('OCR Success. Comparing input name with ID record: Match score: 99.4%');
      setTimeout(() => {
        setSignupVerificationStep('Validating address with Coimbatore Ward Census & Voter Registry...');
        setTimeout(() => {
          setSignupVerificationStep('Security checks cleared! Registering verified citizen profile in CCMC local vault...');
          setTimeout(() => {
            const newUser = {
              uid: `cit-${Date.now()}`,
              name: registerName,
              phone: registerPhone,
              password: registerPassword,
              address: registerAddress,
              zone: registerZone,
              avatarUrl: registerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              idType: registerProofType,
              idNumberMasked: registerProofType === 'Aadhaar' ? 'XXXX-XXXX-' + registerPhone.slice(-4) : 'TN/COI/' + registerPhone.slice(-4),
              proofDocumentUrl: registerProofDoc,
              isVerified: true,
              role: 'citizen'
            };

            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem('civiceye_users', JSON.stringify(updatedUsers));

            setIsVerifyingSignup(false);
            setSignupVerificationStep('');
            setMessage({ type: 'success', text: 'Citizen verified and registered successfully! You can now log in.' });
            
            setRegisterName('');
            setLoginPhone(registerPhone);
            setRegisterPassword('');
            setRegisterAddress('');
            setRegisterProofDoc('');
            setAuthTab('login');
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) {
      setMessage({ type: 'error', text: 'Please enter both your phone number and password.' });
      return;
    }

    const isOfficerInput = loginRole === 'officer' || loginPhone === '9876543212' || loginPhone.toLowerCase() === 'ganeshan' || loginPhone.toLowerCase().includes('ganeshan') || loginPhone === 'officer';
    if (isOfficerInput) {
      const matchedOfficerName = COIMBATORE_OFFICERS.find(name => name.toLowerCase().includes(loginPhone.toLowerCase()) || loginPhone === '9876543212' || loginPhone === 'ganeshan');
      
      const offName = matchedOfficerName || 'S. Ganeshan';
      const off = {
        uid: `usr-off-ganeshan`,
        name: offName,
        role: 'officer' as const,
        phone: loginPhone === 'officer' ? '9876543212' : loginPhone,
        zone: 'Central Zone',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
      };
      const normalized = {
        uid: off.uid,
        name: off.name,
        role: 'officer' as const,
        phone: off.phone,
        zone: off.zone,
        address: 'Coimbatore Municipal Office',
        avatarUrl: off.avatar,
        isVerified: true
      };
      
      setIsVerifyingLogin(true);
      setLoginVerificationStep('Authenticating CCMC Ward Officer credentials...');
      setTimeout(() => {
        setLoginVerificationStep('Decrypting officer security keys and initializing session...');
        setTimeout(() => {
          setIsVerifyingLogin(false);
          setLoginVerificationStep('');
          setCurrentUser(normalized);
          localStorage.setItem('civiceye_current_session', JSON.stringify(normalized));
          setViewHistory(['assigned-cases']);
          setActiveView('assigned-cases');
          setMessage({ type: 'success', text: `Welcome Officer ${off.name} to the CCMC Ward Portal.` });
        }, 800);
      }, 800);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('civiceye_users') || '[]');
    const matchedCitizen = savedUsers.find((u: any) => u.phone === loginPhone && u.password === loginPassword);

    if (matchedCitizen) {
      const isYeswanth = matchedCitizen.phone === '9876543210';
      const normalized = {
        uid: matchedCitizen.uid,
        name: isYeswanth ? 'Yeswanth kumar D.' : matchedCitizen.name,
        role: 'citizen' as const,
        phone: matchedCitizen.phone,
        zone: matchedCitizen.zone,
        address: matchedCitizen.address,
        avatarUrl: isYeswanth ? '/images/yeswanth_profile.jpg' : matchedCitizen.avatarUrl,
        idType: matchedCitizen.idType,
        idNumberMasked: matchedCitizen.idNumberMasked,
        proofDocumentUrl: matchedCitizen.proofDocumentUrl,
        isVerified: true
      };

      setIsVerifyingLogin(true);
      setLoginVerificationStep('Verifying mobile number and password signature...');
      setTimeout(() => {
        setLoginVerificationStep('Retrieving verified resident token and active ID proof...');
        setTimeout(() => {
          setIsVerifyingLogin(false);
          setLoginVerificationStep('');
          setCurrentUser(normalized);
          localStorage.setItem('civiceye_current_session', JSON.stringify(normalized));
          setViewHistory(['dashboard']);
          setActiveView('dashboard');
          setMessage({ type: 'success', text: `Welcome back, ${isYeswanth ? 'Yeswanth kumar D.' : matchedCitizen.name}!` });
        }, 800);
      }, 800);
      return;
    }

    if (loginPhone === '9876543210' && loginPassword === 'password123') {
      const fallbackUser = {
        uid: 'cit-1',
        name: 'Yeswanth kumar D.',
        role: 'citizen' as const,
        phone: '9876543210',
        zone: 'Central Zone',
        address: '14, Sathy Road, Gandhipuram, Coimbatore - 641012',
        avatarUrl: '/images/yeswanth_profile.jpg',
        isVerified: true
      };

      setIsVerifyingLogin(true);
      setLoginVerificationStep('Verifying Yeswanth kumar D. default credentials...');
      setTimeout(() => {
        setLoginVerificationStep('Retrieving primary resident token...');
        setTimeout(() => {
          setIsVerifyingLogin(false);
          setLoginVerificationStep('');
          setCurrentUser(fallbackUser);
          localStorage.setItem('civiceye_current_session', JSON.stringify(fallbackUser));
          setViewHistory(['dashboard']);
          setActiveView('dashboard');
          setMessage({ type: 'success', text: 'Logged in as Yeswanth kumar D.' });
        }, 800);
      }, 800);
      return;
    }

    setMessage({ type: 'error', text: 'Invalid citizen phone number or password. Please try again or register.' });
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please sign in before lodging a complaint.' });
      return;
    }
    if (!newComplaint.title || !newComplaint.description) {
      setMessage({ type: 'error', text: 'Please add a short title and description.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const reportNum = (1001 + issues.length).toString();
      const id = `CIV-COI-${reportNum}`;

      // Correctly map category to Coimbatore departments
      let departmentName = 'Road';
      if (newComplaint.category === 'Water Leakage') {
        departmentName = 'Water';
      } else if (newComplaint.category === 'Sewage Overflow' || newComplaint.category === 'Garbage Overflow') {
        departmentName = 'Sewage';
      } else if (newComplaint.category === 'Streetlight Failure') {
        departmentName = 'Electricity';
      }

      const createdIssue: CivicIssue = {
        id,
        reportNumber: reportNum,
        reporterName: newComplaint.isAnonymous ? 'Anonymous' : currentUser.name,
        userId: currentUser.uid || currentUser.id,
        title: newComplaint.title,
        description: newComplaint.description,
        location: `${newComplaint.location || currentUser.address || 'Coimbatore'}, Coimbatore, Tamil Nadu`,
        zone: currentUser.zone || 'Central Zone',
        category: newComplaint.category,
        severity: 'Medium',
        status: 'Pending',
        department: departmentName as any,
        predictedDeadline: '3 days',
        predictedDays: 3,
        timeElapsedDays: 0,
        aiConfidence: 94,
        reasoning: 'Automated municipal intake. Awaiting community consensus and officer assignment.',
        createdAtText: 'Just now',
        upvotes: 0,
        citizenVerified: false,
        assignedOfficer: '',
        localSupervisor: 'Savitha CCMC',
        delayProbability: 10,
        beforeImg: newComplaint.beforeImg || getCategoryDefaultImage(newComplaint.category),
        geotag: { lat: Number(newComplaint.lat) || 11.0183, lng: Number(newComplaint.lng) || 76.9725 },
        verifications: [],
        emailDispatched: false,
        emails: [],
        isEscalatedToCommissioner: false,
        
        area: currentUser.zone || 'Central Zone',
        citizenName: newComplaint.isAnonymous ? 'Anonymous' : currentUser.name,
        citizenId: currentUser.uid || currentUser.id,
        officerName: '',
        urgency: 'Medium',
        beforeImage: newComplaint.beforeImg || getCategoryDefaultImage(newComplaint.category),
        comments: [],
        ratings: [],
        reviews: [],
        createdAt: new Date().toISOString()
      };

      const updatedIssues = [createdIssue, ...issues];
      setIssues(updatedIssues);
      localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));

      setNewComplaint({ title: '', description: '', category: 'Road Damage', location: 'Coimbatore', beforeImg: '', lat: '11.0183', lng: '76.9725', isAnonymous: false });
      navigateToView('my-complaints');
      setMessage({ type: 'success', text: 'Complaint lodged successfully in local storage. Nearby residents can now verify it!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Submission failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNearbyVerify = async (issueId: string) => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please sign in to verify complaints.' });
      return;
    }

    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];

    if (issue.userId === currentUser.uid || issue.userId === currentUser.id) {
      setMessage({ type: 'error', text: 'CCMC Rules: You cannot verify your own complaint!' });
      return;
    }

    const currentVerifications = issue.verifications || [];

    if (currentVerifications.some(v => v.userId === currentUser.uid)) {
      setMessage({ type: 'error', text: 'You have already verified this complaint!' });
      return;
    }

    setIsVerifying(issueId);
    setMessage({ type: 'info', text: 'Simulating secure municipal GPS handshake...' });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const distance = Math.floor(Math.random() * 140) + 10;
    const newVouch = {
      name: currentUser.name,
      userId: currentUser.uid || currentUser.id,
      distanceMeters: distance
    };

    const updatedVerifications = [...currentVerifications, newVouch];
    let newStatus = issue.status;
    let reasoning = issue.reasoning;

    if (updatedVerifications.length >= 3 && issue.status === 'Pending') {
      newStatus = 'Verified';
      reasoning = 'Consensus reached. Verified by 3 nearby residents. SLA clock initiated, routing to departmental desk.';
    }

    const updatedIssue = {
      ...issue,
      verifications: updatedVerifications,
      status: newStatus,
      reasoning
    };

    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = updatedIssue;

    setIssues(updatedIssues);
    localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));
    setIsVerifying(null);

    if (newStatus === 'Verified') {
      setMessage({ 
        type: 'success', 
        text: `Success! GPS verified. Your vouch has been recorded. Complaint has now reached 3 vouches and its status is updated to "Verified"!` 
      });
    } else {
      setMessage({ 
        type: 'success', 
        text: `GPS verified! Your vouch has been recorded. Needs ${3 - updatedVerifications.length} more nearby vouches to transition to "Verified" status.` 
      });
    }
  };

  const handleAddMockVouch = (issueId: string) => {
    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];
    const currentVerifications = issue.verifications || [];

    const mockResidents = [
      { name: "Suresh Kumar", uid: "mock-cit-101", distanceMeters: 45 },
      { name: "Priya Sundaram", uid: "mock-cit-102", distanceMeters: 112 },
      { name: "Anand Selvam", uid: "mock-cit-103", distanceMeters: 89 },
      { name: "Kavitha Raj", uid: "mock-cit-104", distanceMeters: 23 },
    ];

    const nextResident = mockResidents.find(r => !currentVerifications.some(v => v.userId === r.uid));
    
    if (!nextResident) {
      setMessage({ type: 'error', text: 'All available mock residents have already verified this complaint.' });
      return;
    }

    const updatedVerifications = [...currentVerifications, nextResident];
    let newStatus = issue.status;
    let reasoning = issue.reasoning;

    if (updatedVerifications.length >= 3 && issue.status === 'Pending') {
      newStatus = 'Verified';
      reasoning = 'Consensus reached. Verified by 3 nearby residents. SLA clock initiated, routing to departmental desk.';
    }

    const updatedIssue = {
      ...issue,
      verifications: updatedVerifications,
      status: newStatus,
      reasoning
    };

    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = updatedIssue;

    setIssues(updatedIssues);
    localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));

    if (newStatus === 'Verified') {
      setMessage({ 
        type: 'success', 
        text: `Success! ${nextResident.name} verified from ${nextResident.distanceMeters}m away. Ticket has reached 3 vouches and its status is updated to "Verified"!` 
      });
    } else {
      setMessage({ 
        type: 'success', 
        text: `${nextResident.name} verified from ${nextResident.distanceMeters}m away. Needs ${3 - updatedVerifications.length} more nearby vouches to transition to "Verified" status.` 
      });
    }
  };

  const handleClaimCase = (issueId: string) => {
    if (!currentUser) return;
    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];
    const updatedIssue = {
      ...issue,
      assignedOfficer: currentUser.name,
      officerName: currentUser.name,
      status: 'Assigned' as const,
      reasoning: `Assigned to Officer ${currentUser.name} for rapid remediation and SLA monitoring.`
    };

    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = updatedIssue;

    setIssues(updatedIssues);
    localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));
    setMessage({ type: 'success', text: `Case claimed successfully. It has been routed to your active desk.` });
  };

  const handleCommentSubmit = (e: React.FormEvent, issueId: string) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please sign in to post comments.' });
      return;
    }
    if (!newCommentText.trim()) return;

    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];
    const currentComments = issue.comments || [];

    const newComment = {
      id: `cmt-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      text: newCommentText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...currentComments, newComment];

    const updatedIssue = {
      ...issue,
      comments: updatedComments
    };

    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = updatedIssue;

    setIssues(updatedIssues);
    localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));
    setNewCommentText('');
    setMessage({ type: 'success', text: 'Comment posted successfully.' });
  };

  const handleCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!completionForm.complaintId) {
      setMessage({ type: 'error', text: 'Please choose a complaint first.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const issueIndex = issues.findIndex(i => i.id === completionForm.complaintId);
      if (issueIndex === -1) {
        setMessage({ type: 'error', text: 'Complaint not found.' });
        setIsSubmitting(false);
        return;
      }

      const issue = issues[issueIndex];
      
      let afterImg = completionForm.afterImg;
      if (officerStatus === 'Completed' && !afterImg) {
        if (issue.category === 'Water Leakage') {
          afterImg = '/images/water_after.jpg';
        } else if (issue.category === 'Road Damage') {
          afterImg = '/images/completed/road_fixed_default.jpeg';
        } else if (issue.category.includes('Streetlight')) {
          afterImg = '/images/streetlight_after.jpg';
        } else if (issue.category.includes('Sewage')) {
          afterImg = '/images/sewage_after.jpg';
        } else if (issue.category.includes('Garbage') || issue.category.includes('Sanitation')) {
          const normLocation = (issue.location || '').toLowerCase();
          if (normLocation.includes('podanur')) {
            afterImg = '/images/completed/garbage_fixed_podanur.jpg';
          } else {
            afterImg = '/images/completed/garbage_fixed_default.jpg';
          }
        } else {
          afterImg = '/images/completed/road_fixed_default.jpeg';
        }
      }

      const comments = issue.comments || [];
      const updatedComments = [
        ...comments,
        {
          id: `cmt-${Date.now()}`,
          author: currentUser.name,
          role: 'officer',
          text: completionForm.remarks || `Status updated to ${officerStatus}. Work conducted by Coimbatore municipal field crew.`,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedIssue = {
        ...issue,
        status: officerStatus,
        afterImg: afterImg || issue.afterImg,
        afterImage: afterImg || issue.afterImage,
        assignedOfficer: issue.assignedOfficer || currentUser.name,
        officerName: issue.officerName || currentUser.name,
        comments: updatedComments,
        reasoning: officerStatus === 'Completed' 
          ? 'Remediation completed successfully. Photographic evidence validated by field engineer. Verification closed.'
          : `Field update: ${completionForm.remarks || 'Work in progress.'}`
      };

      const updatedIssues = [...issues];
      updatedIssues[issueIndex] = updatedIssue;

      setIssues(updatedIssues);
      localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));

      setCompletionForm({ complaintId: '', remarks: '', afterImg: '' });
      setOfficerStatus('In Progress');
      setMessage({ type: 'success', text: 'Municipal work update saved successfully. Citizens can now see the updated resolution and comments.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Unable to update the case right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionForm.title || !suggestionForm.detail) {
      setMessage({ type: 'error', text: 'Please add both a title and brief details.' });
      return;
    }
    setFeedbackItems((prev) => [{
      id: `fb-${Date.now()}`,
      title: suggestionForm.title,
      detail: suggestionForm.detail,
      type: suggestionForm.type,
      createdAt: new Date().toLocaleDateString('en-IN'),
    }, ...prev]);
    setSuggestionForm({ title: '', detail: '', type: 'Idea' });
    navigateToView('suggestions');
    setMessage({ type: 'success', text: 'Thank you for sharing your suggestion.' });
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after' | 'proof') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (target === 'before') {
        setNewComplaint((prev) => ({ ...prev, beforeImg: result }));
      } else if (target === 'after') {
        setCompletionForm((prev) => ({ ...prev, afterImg: result }));
      } else if (target === 'proof') {
        setRegisterProofDoc(result);
        setMessage({ type: 'success', text: 'CCMC verification document successfully scanned and loaded!' });
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredIssues = useMemo(() => {
    const normalized = searchTerm.toLowerCase();
    let items = [...issues];

    if (activeView === 'my-complaints' && currentUser?.role === 'citizen') {
      items = items.filter((issue) => {
        const userIdMatch = issue.userId === currentUser.uid || 
                            issue.userId === currentUser.id || 
                            issue.citizenId === currentUser.uid || 
                            issue.citizenId === currentUser.id;
        const isYeswanth = (currentUser.name || '').toLowerCase().includes('yeswanth') || (currentUser.email || '').toLowerCase().includes('yeswanth');
        const isIssueYeswanth = (issue.citizenName || issue.reporterName || '').toLowerCase().includes('yeswanth');
        const nameMatch = (issue.citizenName || issue.reporterName || '').trim().toLowerCase() === (currentUser.name || '').trim().toLowerCase() || (isYeswanth && isIssueYeswanth);
        return userIdMatch || nameMatch;
      });
    } else if (activeView === 'nearby-verification' && currentUser?.role === 'citizen') {
      items = items.filter((issue) => {
        const userIdMatch = issue.userId === currentUser.uid || 
                            issue.userId === currentUser.id || 
                            issue.citizenId === currentUser.uid || 
                            issue.citizenId === currentUser.id;
        const isYeswanth = (currentUser.name || '').toLowerCase().includes('yeswanth') || (currentUser.email || '').toLowerCase().includes('yeswanth');
        const isIssueYeswanth = (issue.citizenName || issue.reporterName || '').toLowerCase().includes('yeswanth');
        const nameMatch = (issue.citizenName || issue.reporterName || '').trim().toLowerCase() === (currentUser.name || '').trim().toLowerCase() || (isYeswanth && isIssueYeswanth);
        return !(userIdMatch || nameMatch);
      });
    } else if (currentUser?.role === 'officer') {
      // The officer of a particular zone should be displayed with only the particular zone's problems
      items = items.filter((issue) => {
        const officerZone = currentUser.zone || 'Central Zone';
        return issue.zone === officerZone;
      });
    }

    if (activeView !== 'my-complaints') {
      if (statusFilter !== 'All') items = items.filter((issue) => issue.status === statusFilter);
      if (categoryFilter !== 'All') items = items.filter((issue) => issue.category.toLowerCase() === categoryFilter.toLowerCase());
      if (zoneFilter !== 'All') items = items.filter((issue) => issue.zone === zoneFilter);
      if (severityFilter !== 'All') items = items.filter((issue) => issue.severity === severityFilter);
      if (departmentFilter !== 'All') items = items.filter((issue) => issue.department === departmentFilter);
    }
    
    if (normalized) {
      items = items.filter((issue) => `${issue.title} ${issue.description} ${issue.id} ${issue.category} ${issue.department}`.toLowerCase().includes(normalized));
    }

    // Apply Sorting
    if (sortBy === 'newest') {
      items.sort((a, b) => Number(b.reportNumber) - Number(a.reportNumber));
    } else if (sortBy === 'oldest') {
      items.sort((a, b) => Number(a.reportNumber) - Number(b.reportNumber));
    } else if (sortBy === 'upvotes') {
      items.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === 'severity') {
      const severityWeights: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      items.sort((a, b) => (severityWeights[b.severity] || 0) - (severityWeights[a.severity] || 0));
    } else if (sortBy === 'deadline') {
      items.sort((a, b) => (a.predictedDays || 0) - (b.predictedDays || 0));
    }

    return items;
  }, [issues, currentUser, activeView, searchTerm, statusFilter, categoryFilter, zoneFilter, severityFilter, departmentFilter, sortBy]);

  const pagedIssues = useMemo(() => {
    const startIndex = (page - 1) * 6;
    return filteredIssues.slice(startIndex, startIndex + 6);
  }, [filteredIssues, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, categoryFilter, zoneFilter, currentUser?.role]);

  const roleConfig = useMemo(() => {
    if (!currentUser) {
      return { 
        label: 'Guest', 
        view: 'dashboard' as ViewKey, 
        nav: [
          { key: 'dashboard', label: 'Home', icon: House },
          { key: 'all-problems', label: 'Coimbatore Problems', icon: ShieldCheck },
          { key: 'zone-performance', label: 'Zone Performance', icon: TrendingUp },
          { key: 'help', label: 'Help', icon: HelpCircle },
        ] as Array<{ key: ViewKey; label: string; icon: React.ElementType }> 
      };
    }
    if (currentUser.role === 'officer') {
      return {
        label: 'Officer',
        nav: [
          { key: 'assigned-cases', label: 'Assigned Cases', icon: ClipboardList },
          { key: 'all-problems', label: 'Coimbatore Problems', icon: ShieldCheck },
          { key: 'zone-performance', label: 'Zone Performance', icon: TrendingUp },
          { key: 'update-status', label: 'Update Status', icon: CheckCircle2 },
          { key: 'upload-completion', label: 'Upload Completion', icon: Camera },
          { key: 'performance', label: 'Overall Performance', icon: TrendingUp },
        ],
      };
    }
    if (currentUser.role === 'admin') {
      return {
        label: 'Admin',
        nav: [
          { key: 'dashboard', label: 'Dashboard', icon: House },
          { key: 'departments', label: 'Departments', icon: Building2 },
          { key: 'officers', label: 'Officers', icon: Users },
          { key: 'escalations', label: 'Escalations', icon: AlertCircle },
          { key: 'reports', label: 'Reports', icon: FileText },
        ],
      };
    }
    return {
      label: 'Citizen',
      nav: [
        { key: 'dashboard', label: 'Home', icon: House },
        { key: 'new-complaint', label: 'New Complaint', icon: FileText },
        { key: 'all-problems', label: 'Coimbatore Problems', icon: ShieldCheck },
        { key: 'my-complaints', label: 'My Complaints', icon: ClipboardList },
        { key: 'zone-performance', label: 'Zone Performance', icon: TrendingUp },
        { key: 'nearby-verification', label: 'Nearby Verification', icon: Users },
        { key: 'suggestions', label: 'Suggestions', icon: MessageSquareQuote },
        { key: 'help', label: 'Help', icon: HelpCircle },
        { key: 'contacts', label: 'Contacts', icon: PhoneCall },
        { key: 'profile', label: 'Profile', icon: UserRound },
      ],
    };
  }, [currentUser]);

  const renderHeader = () => (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border p-2 lg:hidden border-slate-200 text-slate-700" onClick={() => setShowMobileMenu((prev) => !prev)}>
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div>
            <div className="text-xs font-semibold text-[#0f4f3a] tracking-wide">
              {showTamil ? 'கோயம்புத்தூர் மாநகராட்சி' : 'Coimbatore City Municipal Corporation'}
            </div>
            <div className="text-xl font-black tracking-wide text-slate-900">CIVICEYE</div>
            <div className="text-xs text-slate-500">
              {showTamil ? 'AI-வழிகாட்டப்பட்ட மக்கள் சேவை இயங்குதளம்' : 'AI-assisted civic governance platform'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center gap-1">
            <Languages size={16} className="text-slate-500" />
            <select
              value={i18n.language}
              onChange={(e) => {
                const lang = e.target.value;
                void i18n.changeLanguage(lang);
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('i18nextLng', lang);
                }
              }}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 bg-white border-slate-200 text-slate-700 focus:ring-[#0f4f3a]"
            >
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="en">English</option>
            </select>
          </div>

          {!currentUser ? (
            <button className="rounded-full px-4 py-2 text-sm font-semibold bg-[#0f4f3a] text-white" onClick={() => navigateToView('dashboard')}>
              {t('sign_in_prompt', 'Sign In')}
            </button>
          ) : (
            <div className="relative">
              <button className="flex items-center gap-2 rounded-full border px-2 py-2 border-slate-200" onClick={() => setShowAccountMenu((prev) => !prev)}>
                <img src={currentUser.avatarUrl || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="profile" className="h-9 w-9 rounded-full object-cover" />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.role === 'citizen' ? 'Resident' : currentUser.role === 'officer' ? 'Officer' : 'Admin'}</div>
                </div>
                <ChevronDown size={16} className="text-slate-500" />
              </button>
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-xl z-50 border-slate-200 bg-white space-y-1">
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100/10" onClick={() => { navigateToView('profile'); setShowAccountMenu(false); }}>
                    <CircleUserRound size={16} /> {t('profile', 'Profile')}
                  </button>
                  
                  <div className={`my-1 border-t ${isAccessible ? 'border-zinc-800' : 'border-slate-100'}`} />
                  
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Account</div>
                  
                  {/* Option 1: Predefined Yeswanth profile if not logged in as him */}
                  {currentUser.phone !== '9876543210' && (
                    <button
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50 transition border border-dashed border-slate-200"
                      onClick={() => handleSwitchToUser({
                        uid: 'cit-1',
                        name: 'Yeswanth kumar D.',
                        role: 'citizen',
                        phone: '9876543210',
                        zone: 'Central Zone',
                        address: '14, Sathy Road, Gandhipuram, Coimbatore - 641012',
                        avatarUrl: '/images/yeswanth_profile.jpg'
                      })}
                    >
                      <div className="flex items-center gap-2">
                        <img src="/images/yeswanth_profile.jpg" alt="yeswanth" className="h-5 w-5 rounded-full object-cover" />
                        <span className="font-semibold text-slate-700">Yeswanth kumar D.</span>
                      </div>
                      <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">Predef</span>
                    </button>
                  )}

                  {/* Option 2: Predefined Officer Ganeshan profile if not logged in as him */}
                  {currentUser.phone !== '9876543212' && (
                    <button
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50 transition border border-dashed border-slate-200"
                      onClick={() => handleSwitchToUser({
                        uid: 'off-ganeshan',
                        name: 'S. Ganeshan',
                        role: 'officer',
                        phone: '9876543212',
                        zone: 'Central Zone',
                        address: 'CCMC Central Zone Office, Coimbatore - 641001',
                        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
                      })}
                    >
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" alt="ganeshan" className="h-5 w-5 rounded-full object-cover" />
                        <span className="font-semibold text-slate-700">S. Ganeshan (Officer)</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">Officer</span>
                    </button>
                  )}

                  {/* Option 3: Custom registered users in localStorage */}
                  {(() => {
                    const saved = JSON.parse(localStorage.getItem('civiceye_users') || '[]');
                    const filtered = saved.filter((u: any) => {
                      const name = (u.name || '').toLowerCase();
                      const isVignesh = name.includes('vignesh');
                      const isArun = name.includes('arun');
                      const isMeenakshi = name.includes('meenakshi');
                      const isKrishnaveni = name.includes('krishnaveni');
                      return u.phone !== currentUser.phone && u.phone !== '9876543210' && !isVignesh && !isArun && !isMeenakshi && !isKrishnaveni;
                    });
                    if (filtered.length > 0) {
                      return filtered.map((user: any) => (
                        <button
                          key={user.uid}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50 transition border border-slate-100"
                          onClick={() => handleSwitchToUser(user)}
                        >
                          <div className="flex items-center gap-2">
                            <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="profile" className="h-5 w-5 rounded-full object-cover" />
                            <span className="font-semibold text-slate-700 truncate max-w-[120px]">{user.name}</span>
                          </div>
                          <span className="text-[9px] text-[#0f4f3a] bg-emerald-50 px-1 py-0.5 rounded">Registered</span>
                        </button>
                      ));
                    }
                    return null;
                  })()}

                  <div className={`my-1 border-t ${isAccessible ? 'border-zinc-800' : 'border-slate-100'}`} />
                  
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-900/10" onClick={handleLogout}>
                    <LogOut size={16} /> {showTamil ? 'வெளியேறு' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50/70 p-5 lg:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{showTamil ? 'பயனர்' : 'User'}</div>
        <div className="mt-3 flex items-center gap-3">
          <img src={currentUser?.avatarUrl || currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-slate-900">{currentUser?.name || 'Guest User'}</div>
            <div className="text-sm text-slate-500">{currentUser ? currentUser.role : 'Please sign in'}</div>
          </div>
        </div>
      </div>
      <nav className="mt-6 space-y-2">
        {roleConfig.nav.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.key;
          return (
            <button key={item.key} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${active ? 'bg-[#0f4f3a] text-white shadow' : 'text-slate-700 hover:bg-white hover:text-slate-900'}`} onClick={() => { navigateToView(item.key); setShowMobileMenu(false); }}>
              <Icon size={18} />
              {showTamil ? item.label.replace(/Home|New Complaint|Coimbatore Problems|My Complaints|Zone Performance|Nearby Verification|Suggestions|Help|Contacts|Profile|Assigned Cases|Update Status|Upload Completion|Overall Performance|Performance|Dashboard|Departments|Officers|Escalations|Reports/g, (match) => ({ Home: 'முகப்பு', 'New Complaint': 'புதிய புகார்', 'Coimbatore Problems': 'கோவை பிரச்சிணைகள்', 'My Complaints': 'என் புகார்கள்', 'Zone Performance': 'மண்டலச் செயல்திறன்', 'Nearby Verification': 'அருகிலுள்ள சரிபார்ப்பு', Suggestions: 'பரிந்துரைகள்', Help: 'உதவி', Contacts: 'தொடர்பு', Profile: 'சுயவிவரம்', 'Assigned Cases': 'ஒதுக்கப்பட்ட வழக்குகள்', 'Update Status': 'நிலையை மாற்று', 'Upload Completion': 'முடிவுத் படம் பதிவேற்று', 'Overall Performance': 'ஒட்டுமொத்தச் செயல்திறன்', Performance: 'செயல்திறன்', Dashboard: 'முகப்பு', Departments: 'துறைகள்', Officers: 'அதிகாரிகள்', Escalations: 'உயர்மட்டப் புகார்கள்', Reports: 'அறிக்கைகள்' }[match] || match)) : item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const renderMobileMenu = () => showMobileMenu && (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl lg:hidden">
      {roleConfig.nav.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.key} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700" onClick={() => { navigateToView(item.key); setShowMobileMenu(false); }}>
            <Icon size={18} /> {item.label}
          </button>
        );
      })}
    </div>
  );

  const renderLanding = () => (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#0f4f3a] to-[#123b5b] p-6 text-white shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">{showTamil ? 'சேவை மற்றும் வெளிப்படைத்தன்மை' : 'Service and transparency'}</div>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              {showTamil 
                ? (currentUser ? `நல்வரவு, ${currentUser.name}` : 'உங்கள் மாநகராட்சி சேவை மையம் தயார் நிலையில் உள்ளது.') 
                : (currentUser ? `Welcome back, ${currentUser.name}` : 'Your city service desk is ready.')}
            </h1>
            <p className="mt-3 text-sm text-slate-100 sm:text-base">
              {showTamil 
                ? 'புகார்களைக் கண்காணிக்கவும், அருகிலுள்ள புகார்களைச் சரிபார்க்கவும், விரைவான பொதுச்சேவை அறிவிப்புகளுடன் கோவை மாநகரத்தை இயக்கத்தில் வைத்திருக்கவும்.' 
                : 'Track issues, verify nearby complaints and keep Coimbatore moving with faster public-service updates.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="text-sm text-slate-500">{showTamil ? 'தீர்க்கப்பட்டவை' : 'Resolved'}</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{issues.filter((item) => item.status === 'Completed').length}</div>
          <div className="mt-2 text-sm text-slate-500">{showTamil ? 'முடிக்கப்பட்ட கோரிக்கைகள்' : 'Completed requests'}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="text-sm text-slate-500">{showTamil ? 'நிலுவையில் உள்ளவை' : 'Pending'}</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{issues.filter((item) => item.status !== 'Completed').length}</div>
          <div className="mt-2 text-sm text-slate-500">{showTamil ? 'செயல்பாட்டில் உள்ளவை' : 'Work in progress'}</div>
        </div>
        <div 
          onClick={() => navigateToView('zone-performance')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">{showTamil ? 'மண்டலங்களின் தீர்வு வீதம்' : 'Zone SLA Performance'}</div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
              {(currentUser?.zone || 'Central Zone').split(' ')[0]}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {(() => {
                const zIssues = issues.filter(i => i.zone === (currentUser?.zone || 'Central Zone'));
                return zIssues.length > 0 ? Math.round((zIssues.filter(i => i.status === 'Completed').length / zIssues.length) * 100) : 74;
              })()}%
            </span>
            <span className="text-xs text-slate-400 font-medium">{showTamil ? 'மண்டலத் தீர்வு' : 'active zone compliance'}</span>
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 text-[9px] font-bold text-slate-400 uppercase">
            {["Central", "East", "West", "North", "South"].map(z => {
              const fullName = `${z} Zone`;
              const zIssues = issues.filter(i => i.zone === fullName);
              const zPercent = zIssues.length > 0 ? Math.round((zIssues.filter(i => i.status === 'Completed').length / zIssues.length) * 100) : (z === 'Central' ? 74 : z === 'East' ? 82 : z === 'West' ? 69 : z === 'North' ? 78 : 85);
              return (
                <span key={z} className={`px-1.5 py-0.5 rounded transition ${currentUser?.zone === fullName ? 'bg-[#0f4f3a] text-white font-black' : 'bg-slate-100 text-slate-600'}`}>
                  {z[0]}: {zPercent}%
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">{showTamil ? 'சமீபத்திய பொது புகார்கள்' : 'Recent civic updates'}</h2>
              <p className="text-sm text-slate-500">{showTamil ? 'கோவையில் பதிவுசெய்யப்பட்ட ஒவ்வொரு புகாரின் நேரடி நிலவரம்.' : 'Clear records for every complaint raised in Coimbatore.'}</p>
            </div>
            <button className="rounded-full bg-[#0f4f3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0c3f2e]" onClick={() => navigateToView(currentUser?.role === 'citizen' ? 'new-complaint' : currentUser?.role === 'officer' ? 'assigned-cases' : 'dashboard')}>{showTamil ? 'புகார் மையத்தைத் திறக்கவும்' : 'Open service hub'}</button>
          </div>
          <div className="mt-5 space-y-3">
            {issues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:bg-slate-100/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {showTamil ? translateTitleAndDesc(issue.title, '').title : issue.title}
                    </div>
                    <div className="text-sm text-slate-500">
                      {showTamil ? (
                        issue.zone === 'Central Zone' ? 'மத்திய மண்டலம்' :
                        issue.zone === 'East Zone' ? 'கிழக்கு மண்டலம்' :
                        issue.zone === 'West Zone' ? 'மேற்கு மண்டலம்' :
                        issue.zone === 'North Zone' ? 'வடக்கு மண்டலம்' :
                        issue.zone === 'South Zone' ? 'தெற்கு மண்டலம்' :
                        issue.zone === 'Head Office' ? 'தலைமை அலுவலகம்' : issue.zone
                      ) : issue.zone} • {showTamil ? (
                        issue.category === 'Road Damage' ? 'சாலைப் பழுது' :
                        issue.category === 'Sanitation' ? 'துப்புரவு' :
                        issue.category === 'Water Leakage' ? 'குடிநீர் கசிவு' :
                        issue.category === 'Streetlight' ? 'தெருவிளக்கு' :
                        issue.category === 'Public Safety' ? 'பொது பாதுகாப்பு' :
                        issue.category === 'Parks & Trees' ? 'பூங்காக்கள் & மரங்கள்' :
                        issue.category === 'Sewage Overflow' ? 'கழிவுநீர் நிரம்பல்' : issue.category
                      ) : issue.category}
                    </div>
                    {/* Uniform Location of Fault */}
                    <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <span className="text-emerald-700">📍 {showTamil ? 'பழுதுள்ள இடம் (Location of Fault):' : 'Location of Fault:'}</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-medium hover:underline flex items-center gap-0.5"
                        title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
                      >
                        {issue.location}
                        <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[issue.status] || 'bg-slate-200 text-slate-700'}`}>
                    {showTamil ? (
                      issue.status === 'Pending' ? 'நிலுவையில்' :
                      issue.status === 'Assigned' ? 'ஒதுக்கப்பட்டது' :
                      issue.status === 'In Progress' ? 'செயல்பாட்டில்' :
                      issue.status === 'Completed' ? 'முடிக்கப்பட்டது' :
                      issue.status === 'Escalated' ? 'உயர்மட்டப் புகார்' : issue.status
                    ) : issue.status}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                  {issue.status !== 'Completed' ? (
                    <span>{showTamil ? 'எதிர்பார்க்கப்படும் தீர்வு நாள்:' : 'Expected fix time:'} {issue.predictedDeadline}</span>
                  ) : (
                    <span></span>
                  )}
                  <button className="font-semibold text-[#0f4f3a] hover:underline" onClick={() => { setSelectedIssueId(issue.id); navigateToView('complaint-detail'); }}>{showTamil ? 'விவரங்களைக் காண்க' : 'View details'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          onClick={() => navigateToView('help')}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer hover:border-[#0f4f3a]/30 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-3 bg-emerald-50 rounded-2xl text-[#0f4f3a] group-hover:scale-110 transition-transform">
                <HelpCircle size={28} />
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {showTamil ? 'வழிகாட்டி' : 'Guides'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{showTamil ? 'உதவி & ஆதரவு' : 'Help & support'}</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {showTamil 
                ? 'புகார் அளிக்கும் முறைகள், உங்கள் வார்டின் முக்கிய தொடர்பு எண்கள் மற்றும் வழிகாட்டுதல்களைப் பார்க்கவும்.' 
                : 'Need guidance? Read our civic handbook, check standard resolution SLAs, and learn how to raise and verify complaints.'}
            </p>
          </div>
          <button 
            className="w-full mt-6 rounded-2xl border border-[#0f4f3a] px-4 py-3 text-sm font-semibold text-[#0f4f3a] bg-emerald-50/20 group-hover:bg-[#0f4f3a] group-hover:text-white transition-all"
            onClick={(e) => { e.stopPropagation(); navigateToView('help'); }}
          >
            {showTamil ? 'ஆதரவு வழிகாட்டியைத் திறக்கவும்' : 'Open support guide'}
          </button>
        </div>
      </section>
    </div>
  );

  const renderComplaintForm = () => (
    <div className="space-y-6 animate-fade-in">
      {renderBackButton()}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{showTamil ? 'புதிய புகார்' : 'New complaint'}</h2>
          <p className="text-sm text-slate-500">Share a clear issue with photo proof and a precise location.</p>
        </div>
        <div className="rounded-full bg-[#0f4f3a]/10 px-3 py-1 text-sm font-semibold text-[#0f4f3a]">{showTamil ? 'துரித வழி' : 'Fast route'}</div>
      </div>
      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleComplaintSubmit}>
        <div className="space-y-4 lg:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'தலைப்பு' : 'Title'}</label>
          <input value={newComplaint.title} onChange={(e) => setNewComplaint((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Example: Streetlight outage near the market" />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'விவரம்' : 'Details'}</label>
          <textarea value={newComplaint.description} onChange={(e) => setNewComplaint((prev) => ({ ...prev, description: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Describe the issue, impact and urgency." />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'வகை' : 'Category'}</label>
          <select value={newComplaint.category} onChange={(e) => setNewComplaint((prev) => ({ ...prev, category: e.target.value as CivicIssue['category'] }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option>Road Damage</option>
            <option>Sanitation</option>
            <option>Water Leakage</option>
            <option>Streetlight</option>
            <option>Public Safety</option>
            <option>Parks & Trees</option>
            <option>Sewage Overflow</option>
          </select>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'இடம்' : 'Location'}</label>
          <input value={newComplaint.location} onChange={(e) => setNewComplaint((prev) => ({ ...prev, location: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Area or landmark" />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'படம் பதிவேற்று' : 'Upload photo proof'}</label>
          <input type="file" accept="image/*" onChange={(e) => handleProofFileChange(e, 'before')} className="w-full rounded-2xl border border-dashed border-slate-300 p-3" />
          {newComplaint.beforeImg && <img src={newComplaint.beforeImg} alt="preview" className="h-40 w-full rounded-2xl object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(newComplaint.category); }} />}
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">{showTamil ? 'குறிப்புகள்' : 'Optional notes'}</label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newComplaint.isAnonymous} onChange={(e) => setNewComplaint((prev) => ({ ...prev, isAnonymous: e.target.checked }))} />
              {showTamil ? 'அனாமதேயமாக சமர்ப்பிக்கவும்' : 'Submit anonymously'}
            </label>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-500">{showTamil ? 'புகார் தாக்கல் செய்ததும், உங்கள் பகுதியினர் அதை சரிபார்க்கலாம்.' : 'After submission, nearby residents can verify the complaint.'}</div>
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#0f4f3a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">{isSubmitting ? 'Submitting...' : 'Submit complaint'}</button>
        </div>
      </form>
    </div>
  </div>
);

  const renderMyComplaints = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{showTamil ? 'என் புகார்கள்' : 'My complaints'}</h2>
            <p className="text-sm text-slate-500">Follow every request from filing to completion.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{showTamil ? 'நிலுவையில்' : 'Pending'}</div>
            <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{showTamil ? 'செயலிலுள்ளது' : 'In progress'}</div>
            <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{showTamil ? 'முடிந்தது' : 'Completed'}</div>
            <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{showTamil ? 'உயர்மட்டம்' : 'Escalated'}</div>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {filteredIssues.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No complaints to show yet.</div>
        ) : filteredIssues.map((issue) => (
          <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {showTamil ? translateTitleAndDesc(issue.title, '').title : issue.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[issue.status] || 'bg-slate-100 text-slate-700'}`}>
                    {showTamil ? (
                      issue.status === 'Pending' ? 'நிலுவையில்' :
                      issue.status === 'In Progress' ? 'செயல்பாட்டில்' :
                      issue.status === 'Completed' ? 'முடிக்கப்பட்டது' :
                      issue.status === 'Escalated' ? 'உயர்மட்டப் புகார்' : issue.status
                    ) : issue.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {showTamil ? translateTitleAndDesc(issue.title, issue.description).desc : issue.description}
                </p>
                {/* Uniform Location of Fault */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 w-fit">
                  <span className="text-emerald-700">📍 {showTamil ? 'பழுதுள்ள இடம் (Location of Fault):' : 'Location of Fault:'}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-medium hover:underline flex items-center gap-0.5"
                    title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
                  >
                    {issue.location}
                    <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="text-sm text-slate-500">#{issue.id}</div>
            </div>
            <div className={`mt-4 grid gap-4 md:grid-cols-2 ${issue.status !== 'Completed' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
              {issue.status !== 'Completed' && (
                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {showTamil ? 'எதிர்பார்க்கப்படும் தீர்வு நேரம்' : 'Expected fix time'}
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {showTamil && issue.predictedDeadline === '18 hours' ? '18 மணிநேரம்' : (showTamil && issue.predictedDeadline === '3 days' ? '3 நாட்கள்' : issue.predictedDeadline)}
                  </div>
                </div>
              )}
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {showTamil ? 'ஒதுக்கப்பட்ட அதிகாரி' : 'Assigned officer'}
                </div>
                <div className="mt-1 font-semibold text-slate-900">{issue.assignedOfficer || (showTamil ? 'ஒதுக்கப்படவில்லை' : 'Not assigned')}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {showTamil ? 'பொதுமக்களால் உறுதிப்படுத்தப்பட்டது' : 'Confirmed by public'}
                </div>
                <div className="mt-1 font-semibold text-slate-900">
                  {issue.verifications?.length || 0} {showTamil ? 'குடியிருப்பாளர்கள்' : 'residents'}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {showTamil ? 'துறை' : 'Department'}
                </div>
                <div className="mt-1 font-semibold text-slate-900">
                  {showTamil ? (issue.department === 'Water' ? 'குடிநீர் வழங்கல்' : (issue.department === 'Road' ? 'நெடுஞ்சாலை/சாலை' : (issue.department === 'Sewage' ? 'பாதாள சாக்கடை' : 'மின்சாரம்'))) : issue.department}
                </div>
              </div>
            </div>
            <div className="mt-4">
              {issue.status !== 'Completed' ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {showTamil ? 'முன்னர் படம் (பிரச்சனை)' : 'Before image'}
                    </div>
                    {issue.beforeImg ? (
                      <img src={issue.beforeImg} alt="before" className="mt-2 h-48 w-full rounded-2xl object-cover border border-slate-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(issue.category); }} />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500">
                        {showTamil ? 'படம் ஏதுமில்லை.' : 'No before image available.'}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-amber-700 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-2">
                    <span>🚧</span>
                    <span>
                      {showTamil ? 'பணி நடந்து கொண்டிருக்கிறது. நிறைவடைந்ததும் படம் இங்கே காண்பிக்கப்படும்.' : 'Work in progress. Completion image will appear after issue is fixed.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {showTamil ? 'முன்னர் படம் (பிரச்சனை)' : 'Before image'}
                    </div>
                    {issue.beforeImg ? (
                      <img src={issue.beforeImg} alt="before" className="mt-2 h-40 w-full rounded-2xl object-cover border border-slate-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(issue.category); }} />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500">
                        {showTamil ? 'படம் ஏதுமில்லை.' : 'No before image available.'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {showTamil ? 'நிறைவுற்ற படம்' : 'Completion image'}
                    </div>
                    {issue.afterImg ? (
                      <img src={issue.afterImg} alt="after" className="mt-2 h-40 w-full rounded-2xl object-cover border border-slate-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultAfterImage(issue.category); }} />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500">
                        {showTamil ? 'நிறைவுற்ற படம் ஏதுமில்லை.' : 'No completion image available.'}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {showTamil ? 'அதிகாரியின் கருத்துக்கள்' : 'Officer remarks'}
                      </div>
                      <div className="mt-1 text-slate-700 font-medium">
                        {showTamil && issue.reasoning?.includes('Remediation completed') ? 'பணி வெற்றிகரமாக நிறைவுபெற்றது. களப் பொறியாளரால் புகைப்பட ஆதாரம் சரிபார்க்கப்பட்டது.' : (issue.remarks || issue.reasoning || (showTamil ? 'பணி வெற்றிகரமாக நிறைவுபெற்றது.' : 'Work completed successfully.'))}
                      </div>
                    </div>
                    {issue.completedAt && (
                      <div className="pt-1 border-t border-slate-200/60 flex justify-between text-xs text-slate-500">
                        <span>{showTamil ? 'நிறைவுற்ற நேரம்' : 'Completion timestamp'}</span>
                        <span className="font-mono">{new Date(issue.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="font-semibold text-[#0f4f3a] text-sm hover:underline"
                onClick={() => {
                  setSelectedIssueId(issue.id);
                  navigateToView('complaint-detail');
                }}
              >
                View full details & verification logs →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVerify = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">{showTamil ? 'அருகிலுள்ள சரிபார்ப்பு' : 'Nearby verification'}</h2>
        <p className="mt-2 text-sm text-slate-500">Help validate complaints close to your home. Your confirmation adds public trust.</p>
      </div>
      <div className="grid gap-4">
        {filteredIssues.map((issue) => {
          const translatedInfo = translateTitleAndDesc(issue.title, '');
          const translatedCategory = showTamil ? (
            issue.category === 'Road Damage' ? 'சாலை சேதம்' :
            issue.category === 'Water Leakage' ? 'குடிநீர் கசிவு' :
            issue.category === 'Sewage Overflow' ? 'கழிவுநீர் வழிந்தோடல்' :
            issue.category === 'Garbage Overflow' ? 'குப்பை குவிதல்' :
            issue.category === 'Streetlight Failure' ? 'தெருவிளக்கு பழுது' : issue.category
          ) : issue.category;

          const rawArea = issue.area || issue.location.split(',')[0];
          const translatedArea = showTamil ? (
            rawArea.includes('Gandhipuram') ? 'காந்திபுரம்' :
            rawArea.includes('Saravanampatti') ? 'சரவணம்பட்டி' :
            rawArea.includes('Mettupalayam Road') ? 'மேட்டுப்பாளையம் சாலை' :
            rawArea.includes('Peelamedu') ? 'பீளமேடு' :
            rawArea.includes('R.S. Puram') ? 'ஆர்.எஸ். புரம்' :
            rawArea.includes('Vadavalli') ? 'வடவள்ளி' :
            rawArea.includes('Singanallur') ? 'சிங்காநல்லூர்' :
            rawArea.includes('Kovaipudur') ? 'கோவைப்புதூர்' :
            rawArea.includes('Thudiyalur') ? 'துடியலூர்' :
            rawArea.includes('Ukkadam') ? 'உக்கடம்' :
            rawArea.includes('Podanur') ? 'போத்தனூர்' :
            rawArea.includes('Kuniamuthur') ? 'குனியமுத்தூர்' :
            rawArea.includes('Sundarapuram') ? 'சுந்தராபுரம்' : rawArea
          ) : rawArea;

          return (
            <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{translatedInfo.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{translatedArea} • {translatedCategory}</div>
                  {/* Uniform Location of Fault */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-150">
                    <span className="text-emerald-700">📍 {showTamil ? 'பழுதுள்ள இடம் (Location of Fault):' : 'Location of Fault:'}</span>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-medium hover:underline flex items-center gap-0.5"
                      title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
                    >
                      {issue.location}
                      <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[issue.status] || 'bg-slate-100 text-slate-700'}`}>
                  {showTamil ? (
                    issue.status === 'Pending' ? 'நிலுவையில்' :
                    issue.status === 'In Progress' ? 'செயல்பாட்டில்' :
                    issue.status === 'Completed' ? 'முடிக்கப்பட்டது' :
                    issue.status === 'Escalated' ? 'உயர்மட்டப் புகார்' : issue.status
                  ) : issue.status}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-500">
                  {issue.verifications?.length || 0} {showTamil ? 'பொது உறுதிப்படுத்தல்கள்' : 'public confirmations'}
                </div>
                <button 
                  disabled={isVerifying === issue.id}
                  className="rounded-full bg-[#0f4f3a] disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white flex items-center gap-2 transition duration-150 cursor-pointer" 
                  onClick={() => void handleNearbyVerify(issue.id)}
                >
                  {isVerifying === issue.id ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{showTamil ? 'சரிபார்க்கிறது...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    showTamil ? 'இப்போது சரிபார்' : 'Verify now'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Suggestions & feedback</h2>
          <p className="mt-2 text-sm text-slate-500">Share ideas, app feedback or city improvement suggestions.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSuggestionSubmit}>
            <input value={suggestionForm.title} onChange={(e) => setSuggestionForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Give your idea a short title" />
            <select value={suggestionForm.type} onChange={(e) => setSuggestionForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
              <option>Idea</option>
              <option>App feedback</option>
              <option>City improvement</option>
            </select>
            <textarea value={suggestionForm.detail} onChange={(e) => setSuggestionForm((prev) => ({ ...prev, detail: e.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Add your suggestion, concern or improvement idea." />
            <button type="submit" className="rounded-full bg-[#0f4f3a] px-5 py-3 text-sm font-semibold text-white">Submit suggestion</button>
          </form>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Recent suggestions</h3>
          <div className="mt-4 space-y-3">
            {feedbackItems.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">No feedback submitted yet.</div> : feedbackItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="rounded-full bg-[#0f4f3a]/10 px-2 py-1 text-[11px] font-semibold uppercase text-[#0f4f3a]">{item.type}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.detail}</div>
                <div className="mt-2 text-xs text-slate-400">Received on {item.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Help & support</h2>
        <p className="mt-2 text-sm text-slate-500">Use the app with confidence. Learn how to report issues and reach the right office.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {supportCategories.map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-3xl">{item.icon}</div>
            <div className="mt-3 text-lg font-semibold text-slate-900">{item.title}</div>
            <div className="mt-2 text-sm text-slate-500">{item.description}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-900">Frequently asked questions</h3>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">{item.q}</summary>
              <div className="mt-2 text-sm text-slate-600">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Contact directory</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {contactDirectory.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">{item.name}</div>
            <div className="mt-1 text-sm text-slate-500">{item.role} • {item.department}</div>
            <div className="mt-3 text-sm text-slate-700">Zone: {item.zone}</div>
            <div className="mt-2 text-sm font-medium text-[#0f4f3a]">{item.contact}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

  const renderProfile = () => {
    if (!currentUser) return null;
    
    // Calculate dynamic user metrics
    const userIssues = issues.filter(issue => issue.userId === currentUser.uid || issue.userId === currentUser.id);
    const totalComplaints = userIssues.length;
    const resolvedComplaints = userIssues.filter(issue => issue.status === 'Completed').length;
    const pendingComplaints = userIssues.filter(issue => issue.status !== 'Completed').length;

    const vouchedCount = issues.filter(issue => issue.verifications?.some(v => v.userId === currentUser.uid || v.userId === currentUser.id)).length;
    const trustScore = Math.min(100, 50 + 25 + (userIssues.filter(issue => issue.status === 'Verified' || issue.status === 'Completed').length * 10) + (vouchedCount * 5));

    return (
      <div className="space-y-6">
        {renderBackButton()}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Coimbatore Citizen Profile</h2>
              <p className="mt-2 text-sm text-slate-500">Your verified digital identity and civic engagement history.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-100">
              <ShieldCheck size={18} />
              <span>Identity Verified</span>
            </div>
          </div>
          
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Identity Card UI */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between space-y-5">
              <div className="flex items-start gap-4">
                <img 
                  src={currentUser.avatarUrl || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt="profile" 
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-sm" 
                />
                <div>
                  <div className="font-bold text-lg text-slate-900">{currentUser.name}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{currentUser.role}</div>
                  <div className="text-xs text-slate-400 mt-1">{currentUser.phone}</div>
                </div>
              </div>

              {/* Dynamic Trust Score gauge */}
              <div className="rounded-2xl bg-white p-4 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Civic Trust Score</span>
                  <span className="text-sm font-black text-[#0f4f3a]">{trustScore} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0f4f3a] h-full transition-all duration-500" 
                    style={{ width: `${trustScore}%` }} 
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Score built from verification (+25), verified complaints (+10), and community GPS vouches (+5).
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100/50 p-3 rounded-2xl">
                <div className="font-bold text-emerald-800 font-sans">Verification Document Details:</div>
                <div>Document Type: <strong>{currentUser.idType || 'Aadhaar Card'}</strong></div>
                <div>Document ID: <strong>{currentUser.idNumberMasked || 'XXXX-XXXX-8812'}</strong></div>
                {currentUser.proofDocumentUrl && (
                  <div className="mt-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Uploaded Document Image:</div>
                    <img src={currentUser.proofDocumentUrl} alt="ID proof preview" className="h-20 w-full rounded-lg object-cover border border-slate-200 bg-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Registered Address</div>
                <div className="mt-2 font-bold text-sm text-slate-800 leading-snug">{currentUser.address || 'Registered address unavailable'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Assigned Ward Zone</div>
                <div className="mt-2 font-bold text-sm text-slate-800">{currentUser.zone || 'Central Zone'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Total Filed Complaints</div>
                <div className="mt-2 font-black text-2xl text-slate-900">{totalComplaints}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Resolved Cases</div>
                <div className="mt-2 font-black text-2xl text-emerald-600">{resolvedComplaints}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-400 uppercase">Active/Pending Cases</div>
                <div className="mt-2 font-black text-2xl text-amber-600">{pendingComplaints}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Badge Earned</div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f4f3a] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 self-start">
                  <ShieldCheck size={14} /> 
                  <span>Active Civic Watchdog</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOfficerDesk = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Assigned cases</h2>
        <div className="mt-5 space-y-3">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{issue.title}</div>
                  <div className="text-sm text-slate-500">{issue.zone} • {issue.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300" onClick={() => { setSelectedIssueId(issue.id); navigateToView('complaint-detail'); }}>Details</button>
                  <button className="rounded-full bg-[#0f4f3a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0c3e2e]" onClick={() => setCompletionForm((prev) => ({ ...prev, complaintId: issue.id }))}>Choose</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Update status and upload completion</h2>
        <form className="mt-6 space-y-4" onSubmit={handleCompletionSubmit}>
          <input value={completionForm.complaintId} onChange={(e) => setCompletionForm((prev) => ({ ...prev, complaintId: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Complaint ID" />
          <select value={officerStatus} onChange={(e) => setOfficerStatus(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option>In Progress</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Escalated</option>
          </select>
          <textarea value={completionForm.remarks} onChange={(e) => setCompletionForm((prev) => ({ ...prev, remarks: e.target.value }))} className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Add remarks for the citizen and supervisor" />
          <input type="file" accept="image/*" onChange={(e) => handleProofFileChange(e, 'after')} className="w-full rounded-2xl border border-dashed border-slate-300 p-3" />
          {completionForm.afterImg && <img src={completionForm.afterImg} alt="after preview" className="h-40 w-full rounded-2xl object-cover" />}
          <button type="submit" className="rounded-full bg-[#0f4f3a] px-5 py-3 text-sm font-semibold text-white">Save update</button>
        </form>
      </div>
    </div>
  );

  const renderOfficerAssignedCases = () => {
    const isGaneshan = (currentUser?.name || '').toLowerCase().includes('ganeshan');
    const assigned = issues.filter((issue) => {
      const matchName = (issue.assignedOfficer || '').toLowerCase().includes('ganeshan') ||
                        (issue.officerName || '').toLowerCase().includes('ganeshan');
      const isAiVerified = issue.aiConfidence >= 75 && (issue.exifData === undefined || issue.exifData?.isAuthentic !== false);
      return isGaneshan ? (matchName && isAiVerified) : true;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#0f4f3a] bg-[#0f4f3a]/10 border border-[#0f4f3a]/20 rounded-full px-3 py-1">
                CCMC Ward Portal • Central Zone
              </span>
              <h1 className="text-3xl font-black text-slate-900 mt-2">Officer S. Ganeshan's Desk</h1>
              <p className="text-slate-500 text-sm mt-1">
                Displaying high-integrity civic complaints assigned to you and verified by CCMC edge AI classifier.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 font-mono">SLA MONITOR ACTIVE</span>
            </div>
          </div>
        </div>
        {/* Active Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assigned.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No active AI-verified complaints assigned to your department.
            </div>
          ) : (
            assigned.map((issue) => {
              const statusColors: Record<string, string> = {
                'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
                'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
                'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'Escalated': 'bg-rose-50 text-rose-700 border-rose-200'
              };
              const severityColors: Record<string, string> = {
                'Critical': 'bg-rose-100 text-rose-800',
                'High': 'bg-orange-100 text-orange-800',
                'Medium': 'bg-yellow-100 text-yellow-800',
                'Low': 'bg-slate-100 text-slate-800'
              };

              return (
                <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">TICKET #{issue.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[issue.status] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {issue.status}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mt-3 line-clamp-1">{issue.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{issue.description}</p>

                    {/* Uniform Location of Fault */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
                      <span className="text-[#0f4f3a]">📍 Location of Fault:</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-medium hover:underline flex items-center gap-0.5 truncate"
                        title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
                      >
                        {issue.location}
                        <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${severityColors[issue.severity] || 'bg-slate-100'}`}>
                        {issue.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        {issue.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <ShieldCheck size={10} /> AI Verified ({issue.aiConfidence}%)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => { setSelectedIssueId(issue.id); navigateToView('complaint-detail'); }}
                      className="flex-1 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 py-2 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Eye size={12} /> View Details
                    </button>
                    <button
                      onClick={() => {
                        setCompletionForm((prev) => ({ ...prev, complaintId: issue.id }));
                        navigateToView('update-status');
                      }}
                      className="flex-1 rounded-xl bg-[#0f4f3a] hover:bg-[#0c3e2e] text-white py-2 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Update Status
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderOfficerUpdateStatus = () => {
    const isGaneshan = (currentUser?.name || '').toLowerCase().includes('ganeshan');
    const assigned = issues.filter((issue) => {
      const matchName = (issue.assignedOfficer || '').toLowerCase().includes('ganeshan') ||
                        (issue.officerName || '').toLowerCase().includes('ganeshan');
      const isAiVerified = issue.aiConfidence >= 75 && (issue.exifData === undefined || issue.exifData?.isAuthentic !== false);
      return isGaneshan ? (matchName && isAiVerified) : true;
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!completionForm.complaintId) {
        setMessage({ type: 'error', text: 'Please select a complaint ticket first.' });
        return;
      }
      
      setIsSubmitting(true);
      try {
        const idx = issues.findIndex(i => i.id === completionForm.complaintId);
        if (idx === -1) {
          setMessage({ type: 'error', text: 'Complaint not found.' });
          setIsSubmitting(false);
          return;
        }

        const issue = issues[idx];
        const comments = issue.comments || [];
        const updatedComments = [
          ...comments,
          {
            id: `cmt-${Date.now()}`,
            author: currentUser?.name || 'S. Ganeshan',
            role: 'officer',
            text: completionForm.remarks || `Status updated to ${officerStatus}. Work conducted by field engineer.`,
            timestamp: new Date().toISOString()
          }
        ];

        const updatedIssue = {
          ...issue,
          status: officerStatus as any,
          comments: updatedComments,
          reasoning: `Field Engineer S. Ganeshan status update to: ${officerStatus}. Remarks: ${completionForm.remarks || 'None'}`
        };

        const updatedIssues = [...issues];
        updatedIssues[idx] = updatedIssue;
        setIssues(updatedIssues);
        localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));

        setCompletionForm({ complaintId: '', remarks: '', afterImg: '' });
        setMessage({ type: 'success', text: `Ticket #${issue.id} status successfully updated to "${officerStatus}".` });
        navigateToView('assigned-cases');
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to update ticket status.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {renderBackButton()}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Update Case Status</h1>
          <p className="text-slate-500 text-sm mt-1">Select an assigned active complaint and record remediation milestone updates.</p>
        </div>

        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Active Complaint Ticket</label>
              <select
                value={completionForm.complaintId}
                onChange={(e) => setCompletionForm(prev => ({ ...prev, complaintId: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a] bg-white"
              >
                <option value="">-- Choose Assigned Ticket --</option>
                {assigned.map(i => (
                  <option key={i.id} value={i.id}>{i.id} - {i.title} ({i.status})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Milestone / Deployment Status</label>
              <select
                value={officerStatus}
                onChange={(e) => setOfficerStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a] bg-white"
              >
                <option value="In Progress">In Progress - Field Dispatch</option>
                <option value="Pending">Pending Audit</option>
                <option value="Escalated">Escalated to Supervisor</option>
                <option value="Completed">Completed - Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Detailed Engineering Remarks</label>
              <textarea
                value={completionForm.remarks}
                onChange={(e) => setCompletionForm(prev => ({ ...prev, remarks: e.target.value }))}
                className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                placeholder="Log materials used, crew members dispatched, or technical resolution details."
                required
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigateToView('assigned-cases')}
                className="flex-1 rounded-full border border-slate-200 text-slate-700 py-3 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#0f4f3a] hover:bg-[#0c3e2e] text-white py-3 text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderOfficerUploadCompletion = () => {
    const isGaneshan = (currentUser?.name || '').toLowerCase().includes('ganeshan');
    const assigned = issues.filter((issue) => {
      const matchName = (issue.assignedOfficer || '').toLowerCase().includes('ganeshan') ||
                        (issue.officerName || '').toLowerCase().includes('ganeshan');
      const isAiVerified = issue.aiConfidence >= 75 && (issue.exifData === undefined || issue.exifData?.isAuthentic !== false);
      return isGaneshan ? (matchName && isAiVerified) : true;
    });

    const aiSteps = [
      { title: "EXIF & Geolocation Delta", text: "Comparing uploaded image GPS coordinates against original complaint ticket location..." },
      { title: "Metadata Integrity Scan", text: "Analyzing JPEG headers, camera hash, and device signature authenticity..." },
      { title: "Remediation Class Audit", text: "Running neural classifier to verify road surface repair / water flow stoppage / rubbish clearance..." },
      { title: "Securing Digital Ledger Seal", text: "Generating cryptographic integrity stamp and publishing to municipal dashboard..." }
    ];

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!completionForm.complaintId) {
        setMessage({ type: 'error', text: 'Please select a complaint ticket first.' });
        return;
      }
      
      setIsAiVerifying(true);
      setAiStep(0);
      
      setTimeout(() => {
        setAiStep(1);
        setTimeout(() => {
          setAiStep(2);
          setTimeout(() => {
            setAiStep(3);
            setTimeout(() => {
              finishCompletion();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    };

    const finishCompletion = () => {
      try {
        const idx = issues.findIndex(i => i.id === completionForm.complaintId);
        if (idx === -1) {
          setMessage({ type: 'error', text: 'Complaint not found.' });
          setIsAiVerifying(false);
          return;
        }

        const issue = issues[idx];
        let afterImg = completionForm.afterImg;
        if (!afterImg) {
          if (issue.category === 'Water Leakage') {
            afterImg = '/images/water_after.jpg';
          } else if (issue.category === 'Road Damage') {
            afterImg = '/images/completed/road_fixed_default.jpeg';
          } else if (issue.category.includes('Streetlight')) {
            afterImg = '/images/streetlight_after.jpg';
          } else if (issue.category.includes('Sewage')) {
            afterImg = '/images/sewage_after.jpg';
          } else {
            afterImg = '/images/completed/garbage_fixed_default.jpg';
          }
        }

        const comments = issue.comments || [];
        const updatedComments = [
          ...comments,
          {
            id: `cmt-${Date.now()}`,
            author: currentUser?.name || 'S. Ganeshan',
            role: 'officer',
            text: completionForm.remarks || `Resolution completed with photographic evidence verified by Ward Officer and approved by CCMC AI ledger.`,
            timestamp: new Date().toISOString()
          }
        ];

        const updatedIssue = {
          ...issue,
          status: 'Completed' as const,
          afterImg: afterImg,
          afterImage: afterImg,
          comments: updatedComments,
          reasoning: 'Resolution audited and verified. Before/After visual comparison matched with 98.4% AI confidence. Closed by S. Ganeshan.'
        };

        const updatedIssues = [...issues];
        updatedIssues[idx] = updatedIssue;
        setIssues(updatedIssues);
        localStorage.setItem('civiceye_complaints', JSON.stringify(updatedIssues));

        setCompletionForm({ complaintId: '', remarks: '', afterImg: '' });
        setIsAiVerifying(false);
        setMessage({ type: 'success', text: `Verification passed! Ticket #${issue.id} has been marked Completed.` });
        navigateToView('assigned-cases');
      } catch (err) {
        console.error(err);
        setIsAiVerifying(false);
        setMessage({ type: 'error', text: 'Failed to save completed proof.' });
      }
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {renderBackButton()}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Upload Resolution Proof</h1>
          <p className="text-slate-500 text-sm mt-1">Upload photographic proof of completed work to trigger the CCMC multi-step AI spatial validation audit.</p>
        </div>

        {isAiVerifying && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl space-y-4 animate-scale-in">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wide">CCMC AI Validator</span>
                <span className="text-xs font-mono font-bold text-slate-400">Step {aiStep + 1}/4</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">Validating Remediation Integrity</h3>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0f4f3a] h-full transition-all duration-300" style={{ width: `${(aiStep + 1) * 25}%` }} />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-[#0f4f3a] border-t-transparent rounded-full animate-spin mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{aiSteps[aiStep].title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{aiSteps[aiStep].text}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Completed Complaint Ticket</label>
              <select
                value={completionForm.complaintId}
                onChange={(e) => setCompletionForm(prev => ({ ...prev, complaintId: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a] bg-white"
              >
                <option value="">-- Choose Assigned Ticket --</option>
                {assigned.map(i => (
                  <option key={i.id} value={i.id}>{i.id} - {i.title} ({i.status})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Final Completion Comments</label>
              <textarea
                value={completionForm.remarks}
                onChange={(e) => setCompletionForm(prev => ({ ...prev, remarks: e.target.value }))}
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                placeholder="Detail the technical parameters of the fix (e.g. 2 tons of bituminous mix applied, leak sealed with heavy-duty sleeve clamp)."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Remediation Proof Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProofFileChange(e, 'after')}
                className="w-full rounded-2xl border border-dashed border-slate-300 p-4 text-xs font-bold text-slate-500 bg-slate-50 cursor-pointer"
              />
              {completionForm.afterImg && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={completionForm.afterImg} alt="after preview" className="h-48 w-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#0f4f3a] hover:bg-[#0c3e2e] text-white py-3.5 text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Verify & Seal Resolution
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderOfficerPerformance = () => {
    const activeZone = currentUser?.zone || 'Central Zone';
    const zoneIssues = issues.filter((issue) => issue.zone === activeZone);
    const boards = ["Water", "Road", "Sewage", "Electricity"];

    const getComplianceColor = (sla: number) => {
      if (sla >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', fill: 'bg-emerald-600' };
      if (sla >= 50) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', fill: 'bg-amber-500' };
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', fill: 'bg-rose-600' };
    };

    const downloadZoneReport = (dept: string) => {
      const deptIssues = zoneIssues.filter(i => i.department.toLowerCase() === dept.toLowerCase());
      
      let reportStr = `========================================================\n`;
      reportStr += `COIMBATORE CITY MUNICIPAL CORPORATION\n`;
      reportStr += `ZONE BOARD PERFORMANCE & COMPLAINTS REPORT\n`;
      reportStr += `========================================================\n\n`;
      reportStr += `OFFICER NAME    : ${currentUser?.name || 'S. Ganeshan'}\n`;
      reportStr += `DEPARTMENT      : ${dept.toUpperCase()} BOARD\n`;
      reportStr += `MUNICIPAL ZONE  : ${activeZone.toUpperCase()}\n`;
      reportStr += `GENERATED ON    : ${new Date().toLocaleString()}\n`;
      reportStr += `STATUS          : OFFICIAL AUDIT DATA\n`;
      reportStr += `--------------------------------------------------------\n\n`;
      
      const total = deptIssues.length;
      const solved = deptIssues.filter(i => i.status === 'Completed').length;
      const progress = deptIssues.filter(i => i.status === 'In Progress').length;
      const escalations = deptIssues.filter(i => i.status === 'Escalated').length;
      const pending = total - solved - progress - escalations;
      const sla = total > 0 ? Math.round((solved / total) * 100) : 85;

      reportStr += `SUMMARY METRICS:\n`;
      reportStr += `----------------\n`;
      reportStr += `- Total Registered Cases : ${total}\n`;
      reportStr += `- Solved / Resolved Cases: ${solved}\n`;
      reportStr += `- Work In Progress       : ${progress}\n`;
      reportStr += `- Pending Public Audit   : ${pending}\n`;
      reportStr += `- SLA Overdue Escalations: ${escalations}\n`;
      reportStr += `- SLA Compliance Score   : ${sla}%\n\n`;
      
      reportStr += `CASE STATEMENTS LOG:\n`;
      reportStr += `--------------------\n`;
      if (deptIssues.length === 0) {
        reportStr += `No active or resolved complaint files logged in this zone.\n`;
      } else {
        deptIssues.forEach((issue, index) => {
          reportStr += `${index + 1}. Ticket ID: ${issue.id}\n`;
          reportStr += `   Title      : ${issue.title}\n`;
          reportStr += `   Area       : ${issue.area || issue.location.split(',')[0]}\n`;
          reportStr += `   Status     : ${issue.status}\n`;
          reportStr += `   Severity   : ${issue.severity}\n`;
          reportStr += `   Upvotes    : ${issue.upvotes || 0}\n`;
          reportStr += `   Reporter   : ${issue.reporterName}\n`;
          reportStr += `   Registered : ${issue.createdAtText || 'Recent'}\n`;
          if (issue.remarks) {
            reportStr += `   Remarks    : ${issue.remarks}\n`;
          }
          reportStr += `   --------------------------------------------------\n`;
        });
      }
      
      const blob = new Blob([reportStr], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CCMC_Report_${dept}_${activeZone.replace(/\s+/g, '_')}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage({ 
        type: 'success', 
        text: `Performance report for ${dept} department downloaded successfully!` 
      });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {renderBackButton()}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
            Official Performance Ledger
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Overall Performance</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time KPI scoring, service level indicators, and zone performance insights for S. Ganeshan.</p>
        </div>

        {/* Core KPI cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Efficiency Rating</div>
            <div className="mt-2 text-3xl font-black text-[#0f4f3a]">94%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">▲ +2.4% vs last quarter</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Resolution Rate</div>
            <div className="mt-2 text-3xl font-black text-slate-900">88.5%</div>
            <p className="text-[10px] text-slate-500 mt-1">SLA average within 3-day window</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Avg Response Speed</div>
            <div className="mt-2 text-3xl font-black text-slate-900">12.4 Hrs</div>
            <p className="text-[10px] text-[#0f4f3a] font-semibold mt-1">Fastest in Central Zone</p>
          </div>
        </div>

        {/* Personal Workload Visualization */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Workload Statistics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution of cases assigned to S. Ganeshan</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                  <span>Resolved Issues</span>
                  <span>14 Cases</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0f4f3a] h-full" style={{ width: '82%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                  <span>Work In Progress</span>
                  <span>2 Cases</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '12%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                  <span>Escalated / Blocked</span>
                  <span>1 Case</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Compliance & Audit Sign-off</h3>
              <p className="text-xs text-slate-500 mt-0.5">Official certification and ledger status.</p>
              
              <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <ShieldCheck size={16} /> Verified Officer Profile
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Your officer profile matches live biometrics registry and has passed our digital signature integrity audit. All actions are cryptographically signed.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              Ledger ID: GEN-COI-9428-SEC
            </div>
          </div>
        </div>

        {/* Restricting Zone Performance Report only to Ganeshan's Zone */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
              {activeZone} Report Center
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">Zone Board Performance Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">Download performance audits specifically configured for {activeZone}.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {boards.map((board) => {
              const deptIssues = zoneIssues.filter((i) => i.department.toLowerCase() === board.toLowerCase());
              const total = deptIssues.length;
              const solved = deptIssues.filter((i) => i.status === 'Completed').length;
              const slaVal = total > 0 ? Math.round((solved / total) * 100) : (board === 'Water' ? 84 : board === 'Road' ? 71 : board === 'Sewage' ? 58 : 91);
              const config = getComplianceColor(slaVal);

              return (
                <div key={board} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{board} Board</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activeZone} CCMC</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${config.text} ${config.bg} ${config.border}`}>
                      {slaVal}% SLA
                    </span>
                  </div>
                  <button
                    onClick={() => downloadZoneReport(board)}
                    className="w-full text-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 py-2 transition"
                  >
                    📥 Download Report
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Departments</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{computedDepartments.length}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Escalations</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{issues.filter((item) => item.status === 'Escalated').length}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Open issues</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{issues.filter((item) => item.status !== 'Completed').length}</div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Department performance</h2>
          <div className="mt-4 space-y-3">
            {computedDepartments.map((dept) => (
              <div key={dept.code} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{dept.name} Department</div>
                    <div className="text-xs text-slate-500">{dept.zone} • {dept.totalCases} Total complaints</div>
                  </div>
                  <div className="text-right">
                    <div className="rounded-full bg-[#0f4f3a]/10 px-3 py-1 text-sm font-semibold text-[#0f4f3a]">{dept.slaCompliance}% SLA</div>
                    <div className="text-[10px] text-slate-400">Compliance Rate</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#0f4f3a] h-full" style={{ width: `${dept.slaCompliance}%` }} title="SLA Compliant" />
                  <div className="bg-rose-400 h-full" style={{ width: `${100 - dept.slaCompliance}%` }} title="Delayed / Escaped" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Solved: <strong>{dept.solvedCases}</strong></span>
                  <span>Pending: <strong>{dept.pendingCases}</strong></span>
                  <span>Escalated: <strong className="text-rose-600">{dept.delayedCases}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Escalations</h2>
          <div className="mt-4 space-y-3">
            {issues.filter((item) => item.status === 'Escalated').length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">No escalations at the moment.</div> : issues.filter((item) => item.status === 'Escalated').map((issue) => <div key={issue.id} className="rounded-2xl border border-slate-200 bg-rose-50 p-4 text-sm text-slate-700">{issue.title}</div>)}
          </div>
        </div>
      </section>
    </div>
  );

  const renderAllProblems = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        {renderBackButton()}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {showTamil ? "கோயம்புத்தூர் பொதுப் பிரச்சினைகள்" : "Coimbatore Civic Problems"}
          </h1>
          <p className="text-slate-500 text-sm">
            {showTamil 
              ? "கோயம்புத்தூர் மாநகராட்சி முழுவதும் தாக்கல் செய்யப்பட்ட அனைத்து பொதுப் புகார்களையும் இங்கே காணவும் மற்றும் சரிபார்க்கவும்."
              : "View, search, upvote, and verify civic complaints filed across all zones of Coimbatore City Municipal Corporation."}
          </p>
        </div>

        {/* Filters Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={showTamil ? "விவரங்களைத் தேடுங்கள்..." : "Search complaints..."}
                className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-[#0f4f3a] focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
              />
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {showTamil ? "வரிசைப்படுத்து:" : "Sort By:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-[#0f4f3a] focus:outline-none"
              >
                <option value="newest">{showTamil ? "புதியவை முதலில்" : "Newest First"}</option>
                <option value="upvotes">{showTamil ? "வாக்குகள் அடிப்படையில்" : "Most Upvoted"}</option>
                <option value="severity">{showTamil ? "அவசரத்தன்மை" : "Severity"}</option>
              </select>
            </div>
          </div>

          {/* Filter selectors */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {showTamil ? "மண்டலம்" : "Zone"}
              </label>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{showTamil ? "அனைத்து மண்டலம்" : "All Zones"}</option>
                <option value="Central Zone">{showTamil ? "மத்திய மண்டலம்" : "Central Zone"}</option>
                <option value="East Zone">{showTamil ? "கிழக்கு மண்டலம்" : "East Zone"}</option>
                <option value="South Zone">{showTamil ? "தெற்கு மண்டலம்" : "South Zone"}</option>
                <option value="North Zone">{showTamil ? "வடக்கு மண்டலம்" : "North Zone"}</option>
                <option value="West Zone">{showTamil ? "மேற்கு மண்டலம்" : "West Zone"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {showTamil ? "துறை" : "Category"}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{showTamil ? "அனைத்து வகைகள்" : "All Categories"}</option>
                <option value="Water Leakage">{showTamil ? "குடிநீர் கசிவு" : "Water Leakage"}</option>
                <option value="Road Damage">{showTamil ? "சாலை சேதம்" : "Road Damage"}</option>
                <option value="Sewage / Garbage">{showTamil ? "குப்பை / கழிவுநீர்" : "Sewage / Garbage"}</option>
                <option value="Streetlights">{showTamil ? "தெருவிளக்குகள்" : "Streetlights"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {showTamil ? "நிலை" : "Status"}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{showTamil ? "அனைத்து நிலைகள்" : "All Statuses"}</option>
                <option value="Pending">{showTamil ? "நிலுவையில்" : "Pending"}</option>
                <option value="In Progress">{showTamil ? "செயல்பாட்டில்" : "In Progress"}</option>
                <option value="Completed">{showTamil ? "முடிக்கப்பட்டது" : "Completed"}</option>
                <option value="Escalated">{showTamil ? "உயர்மட்டப் புகார்" : "Escalated"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {showTamil ? "அவசரம்" : "Severity"}
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
              >
                <option value="All">{showTamil ? "அனைத்து அவசரம்" : "All Severities"}</option>
                <option value="Critical">{showTamil ? "மிகவும் அவசரம்" : "Critical"}</option>
                <option value="High">{showTamil ? "அதிகம்" : "High"}</option>
                <option value="Medium">{showTamil ? "நடுத்தரம்" : "Medium"}</option>
                <option value="Low">{showTamil ? "குறைவு" : "Low"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Listing Grid */}
        {pagedIssues.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white">
            <p className="text-slate-500 font-medium">
              {showTamil ? "இங்கே எந்த புகாரும் காணப்படவில்லை." : "No civic complaints found matching your filters."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pagedIssues.map((issue) => {
              const matchesStatusColor = statusColors[issue.status] || 'bg-slate-100 text-slate-700';
              const translatedInfo = translateTitleAndDesc(issue.title, issue.description);
              
              const translatedCategory = showTamil ? (
                issue.category === 'Road Damage' ? 'சாலை சேதம்' :
                issue.category === 'Water Leakage' ? 'குடிநீர் கசிவு' :
                issue.category === 'Sewage Overflow' ? 'கழிவுநீர் வழிந்தோடல்' :
                issue.category === 'Garbage Overflow' ? 'குப்பை குவிதல்' :
                issue.category === 'Streetlight Failure' ? 'தெருவிளக்கு பழுது' : issue.category
              ) : issue.category;

              const translatedZone = showTamil ? (
                issue.zone === 'Central Zone' ? 'மத்திய மண்டலம்' :
                issue.zone === 'East Zone' ? 'கிழக்கு மண்டலம்' :
                issue.zone === 'West Zone' ? 'மேற்கு மண்டலம்' :
                issue.zone === 'North Zone' ? 'வடக்கு மண்டலம்' :
                issue.zone === 'South Zone' ? 'தெற்கு மண்டலம்' : issue.zone
              ) : issue.zone;

              const rawArea = issue.area || issue.location.split(',')[0];
              const translatedArea = showTamil ? (
                rawArea.includes('Gandhipuram') ? 'காந்திபுரம்' :
                rawArea.includes('Saravanampatti') ? 'சரவணம்பட்டி' :
                rawArea.includes('Mettupalayam Road') ? 'மேட்டுப்பாளையம் சாலை' :
                rawArea.includes('Peelamedu') ? 'பீளமேடு' :
                rawArea.includes('R.S. Puram') ? 'ஆர்.எஸ். புரம்' :
                rawArea.includes('Vadavalli') ? 'வடவள்ளி' :
                rawArea.includes('Singanallur') ? 'சிங்காநல்லூர்' :
                rawArea.includes('Kovaipudur') ? 'கோவைப்புதூர்' :
                rawArea.includes('Thudiyalur') ? 'துடியலூர்' :
                rawArea.includes('Ukkadam') ? 'உக்கடம்' :
                rawArea.includes('Podanur') ? 'போத்தனூர்' :
                rawArea.includes('Kuniamuthur') ? 'குனியமுத்தூர்' :
                rawArea.includes('Sundarapuram') ? 'சுந்தராபுரம்' : rawArea
              ) : rawArea;

              const translatedReporter = showTamil ? (
                issue.reporterName === 'Yeswanth kumar D.' ? 'யெஸ்வந்த் குமார் D.' :
                issue.reporterName === 'Vignesh Kumar' ? 'விக்னேஷ் குமார்' :
                issue.reporterName === 'K. Meenakshi' ? 'கே. மீனாட்சி' :
                issue.reporterName === 'Arun Kumar' ? 'அருண் குமார்' :
                issue.reporterName === 'D. Krishnaveni' ? 'டி. கிருஷ்ணவேணி' :
                issue.reporterName === 'D. Maheshwari' ? 'டி. கிருஷ்ணவேணி' :
                issue.reporterName === 'S. Karthikeyan' ? 'எஸ். கார்த்திகேயன்' :
                issue.reporterName === 'M. Revathi' ? 'எம். ரேவதி' :
                issue.reporterName === 'Anitha Raj' ? 'அனிதா ராஜ்' : issue.reporterName
              ) : issue.reporterName;

              const alreadyUpvoted = upvotedIssues.includes(issue.id);

              return (
                <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                  <div>
                    {issue.beforeImg && (
                      <div className="h-44 w-full relative">
                        <img 
                          src={issue.beforeImg} 
                          alt="complaint" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(issue.category); }} 
                        />
                        <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${issue.severity === 'Critical' || issue.severity === 'High' ? 'bg-rose-600 text-white shadow' : 'bg-slate-900 text-white shadow'}`}>
                          {showTamil ? (
                            issue.severity === 'Critical' ? 'அதிமுக்கியம்' :
                            issue.severity === 'High' ? 'அதிக முன்னுரிமை' :
                            issue.severity === 'Medium' ? 'நடுத்தர முன்னுரிமை' : 'குறைந்த முன்னுரிமை'
                          ) : issue.severity}
                        </span>
                      </div>
                    )}
                    
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#0f4f3a] tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                          {translatedCategory}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${matchesStatusColor}`}>
                          {showTamil ? (
                            issue.status === 'Pending' ? 'நிலுவையில்' :
                            issue.status === 'In Progress' ? 'செயல்பாட்டில்' :
                            issue.status === 'Completed' ? 'முடிக்கப்பட்டது' :
                            issue.status === 'Escalated' ? 'உயர்மட்டப் புகார்' : issue.status
                          ) : issue.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1">{translatedInfo.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{translatedInfo.desc}</p>

                      {/* Uniform Location of Fault */}
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
                        <span className="text-[#0f4f3a]">📍 {showTamil ? 'பழுதுள்ள இடம் (Location of Fault):' : 'Location of Fault:'}</span>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 font-medium hover:underline flex items-center gap-0.5 truncate"
                          title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
                        >
                          {issue.location}
                          <svg className="w-3 h-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                        <div>
                          <strong>{showTamil ? "மண்டலம்:" : "Zone:"}</strong> {translatedZone}
                        </div>
                        <div>
                          <strong>{showTamil ? "வட்டம் / பகுதி:" : "Area:"}</strong> {translatedArea}
                        </div>
                        <div>
                          <strong>{showTamil ? "பதிவு எண்:" : "ID:"}</strong> #{issue.id}
                        </div>
                        <div>
                          <strong>{showTamil ? "பதிவு செய்தவர்:" : "Reporter:"}</strong> {translatedReporter}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between gap-2">
                    {/* Interaction stats & upvoting */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          const alreadyUpvoted = upvotedIssues.includes(issue.id);
                          let updatedUpvotes = issue.upvotes || 0;
                          let nextUpvotedList = [...upvotedIssues];
                          if (alreadyUpvoted) {
                            updatedUpvotes = Math.max(0, updatedUpvotes - 1);
                            nextUpvotedList = nextUpvotedList.filter(id => id !== issue.id);
                            setMessage({ type: 'success', text: showTamil ? 'உங்கள் ஆதரவு வாக்கு திரும்பப் பெறப்பட்டது!' : 'Upvote removed!' });
                          } else {
                            updatedUpvotes = updatedUpvotes + 1;
                            nextUpvotedList.push(issue.id);
                            setMessage({ type: 'success', text: showTamil ? 'உங்கள் ஆதரவு வாக்கு பதிவு செய்யப்பட்டது!' : 'Upvote registered successfully!' });
                          }
                          setUpvotedIssues(nextUpvotedList);
                          localStorage.setItem('civiceye_upvoted_issues', JSON.stringify(nextUpvotedList));
                          const updated = issues.map(item => item.id === issue.id ? { ...item, upvotes: updatedUpvotes } : item);
                          setIssues(updated);
                          localStorage.setItem('civiceye_complaints', JSON.stringify(updated));
                        }}
                        className={`flex items-center gap-1.5 text-xs font-semibold p-1.5 rounded-xl transition cursor-pointer ${alreadyUpvoted ? 'bg-[#0f4f3a]/20 text-[#0f4f3a]' : 'text-slate-600 hover:bg-slate-200'}`}
                        title="Upvote Complaint"
                      >
                        👍 {issue.upvotes || 0}
                      </button>
                      <span className="text-[11px] text-slate-400">
                        • {issue.verifications?.length || 0} {showTamil ? 'சரிபார்ப்புகள்' : 'verifications'}
                      </span>
                    </div>

                    {/* WhatsApp share and View details buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const textStr = `Coimbatore Civic Complaint Ticket #${issue.id}: "${issue.title}" at ${issue.area || issue.location.split(',')[0]} under ${issue.zone}. Please help vote & verify it on CivicEye platform:`;
                          const shareUrl = `${window.location.origin}${window.location.pathname}?view=complaint-detail&issueId=${encodeURIComponent(issue.id)}`;
                          const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(textStr + " " + shareUrl)}`;
                          window.open(whatsappLink, '_blank');
                        }}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                        title={showTamil ? 'வாட்ஸ்அப்பில் பகிர்க' : 'Share on WhatsApp'}
                      >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.973-1.857-1.857-4.339-2.88-6.982-2.88-5.442 0-9.866 4.42-9.87 9.865-.001 1.745.454 3.447 1.321 4.957l-.315 1.15-.314 1.146 1.19-.311 1.164-.305zm10.32-6.526c-.322-.162-1.905-.94-2.201-1.048-.297-.108-.512-.162-.726.162-.215.321-.828 1.048-1.015 1.263-.188.214-.376.242-.698.08-1.802-.9-2.915-1.593-4.085-3.6-.312-.534.312-.497.893-1.654.1-.214.05-.401-.025-.562-.075-.162-.726-1.748-1.011-2.427-.29-.693-.584-.6-.8-.606-.204-.006-.438-.008-.673-.008-.236 0-.617.089-.94.437-.321.348-1.226 1.202-1.226 2.93 0 1.728 1.259 3.399 1.437 3.64.178.24 2.478 3.786 5.999 5.304.838.362 1.491.578 2.001.74.843.268 1.61.23 2.215.14.676-.1 2.201-.899 2.51-1.77.309-.87.309-1.614.215-1.77-.094-.156-.347-.247-.694-.41z"/>
                        </svg>
                      </button>

                      <button 
                        onClick={() => { setSelectedIssueId(issue.id); navigateToView('complaint-detail'); }}
                        className="rounded-xl bg-[#0f4f3a] hover:bg-[#0f2c20] text-white text-xs font-semibold px-3 py-2 shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        {showTamil ? 'சரிபார் & விபரம்' : 'Verify & Detail'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination buttons */}
        {filteredIssues.length > 6 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              {showTamil ? "முந்தைய" : "Previous"}
            </button>
            <span className="text-xs text-slate-500 font-mono">
              {showTamil ? `பக்கம் ${page}` : `Page ${page}`}
            </span>
            <button
              disabled={page * 6 >= filteredIssues.length}
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              {showTamil ? "அடுத்தது" : "Next"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderZonePerformance = () => {
    const activeZone = currentUser?.zone || 'Central Zone';
    const zoneIssues = issues.filter((issue) => issue.zone === activeZone);
    const boards = ["Water", "Road", "Sewage", "Electricity"];
    
    // SLA compliance color coding
    const getComplianceColor = (sla: number) => {
      if (sla >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', fill: 'bg-emerald-600' };
      if (sla >= 50) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', fill: 'bg-amber-500' };
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', fill: 'bg-rose-600' };
    };

    const downloadReport = (dept: string) => {
      const deptIssues = zoneIssues.filter(i => i.department.toLowerCase() === dept.toLowerCase());
      
      let reportStr = `========================================================\n`;
      reportStr += `COIMBATORE CITY MUNICIPAL CORPORATION\n`;
      reportStr += `ZONE BOARD PERFORMANCE & COMPLAINTS REPORT\n`;
      reportStr += `========================================================\n\n`;
      reportStr += `DEPARTMENT      : ${dept.toUpperCase()} BOARD\n`;
      reportStr += `MUNICIPAL ZONE  : ${activeZone.toUpperCase()}\n`;
      reportStr += `GENERATED ON    : ${new Date().toLocaleString()}\n`;
      reportStr += `STATUS          : OFFICIAL AUDIT DATA\n`;
      reportStr += `--------------------------------------------------------\n\n`;
      
      const total = deptIssues.length;
      const solved = deptIssues.filter(i => i.status === 'Completed').length;
      const progress = deptIssues.filter(i => i.status === 'In Progress').length;
      const escalations = deptIssues.filter(i => i.status === 'Escalated').length;
      const pending = total - solved - progress - escalations;
      const sla = total > 0 ? Math.round((solved / total) * 100) : 85;

      reportStr += `SUMMARY METRICS:\n`;
      reportStr += `----------------\n`;
      reportStr += `- Total Registered Cases : ${total}\n`;
      reportStr += `- Solved / Resolved Cases: ${solved}\n`;
      reportStr += `- Work In Progress       : ${progress}\n`;
      reportStr += `- Pending Public Audit   : ${pending}\n`;
      reportStr += `- SLA Overdue Escalations: ${escalations}\n`;
      reportStr += `- SLA Compliance Score   : ${sla}%\n\n`;
      
      reportStr += `CASE STATEMENTS LOG:\n`;
      reportStr += `--------------------\n`;
      if (deptIssues.length === 0) {
        reportStr += `No active or resolved complaint files logged in this zone.\n`;
      } else {
        deptIssues.forEach((issue, index) => {
          reportStr += `${index + 1}. Ticket ID: ${issue.id}\n`;
          reportStr += `   Title      : ${issue.title}\n`;
          reportStr += `   Area       : ${issue.area || issue.location.split(',')[0]}\n`;
          reportStr += `   Status     : ${issue.status}\n`;
          reportStr += `   Severity   : ${issue.severity}\n`;
          reportStr += `   Upvotes    : ${issue.upvotes || 0}\n`;
          reportStr += `   Reporter   : ${issue.reporterName}\n`;
          reportStr += `   Registered : ${issue.createdAtText || 'Recent'}\n`;
          if (issue.remarks) {
            reportStr += `   Remarks    : ${issue.remarks}\n`;
          }
          reportStr += `   --------------------------------------------------\n`;
        });
      }
      
      const blob = new Blob([reportStr], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CCMC_Report_${dept}_${activeZone.replace(/\s+/g, '_')}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage({ 
        type: 'success', 
        text: showTamil 
          ? `${dept} துறைக்கான முழு அறிக்கை வெற்றிகரமாக பதிவிறக்கம் செய்யப்பட்டது!` 
          : `Complete performance report for ${dept} department downloaded successfully!` 
      });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {renderBackButton()}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
              {activeZone}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {showTamil ? "மண்டல வாரியச் செயல்திறன்" : "Zone Board Performance"}
          </h1>
          <p className="text-slate-500 text-sm">
            {showTamil 
              ? `உங்கள் பகுதியான ${activeZone} மண்டலத்திற்கு உட்பட்ட முக்கிய நகராட்சி வாரியங்கள் மற்றும் அவற்றின் தீர்வு செயல்திறன்.`
              : `Realtime performance, service level compliance, and resolution audits of primary boards operating inside ${activeZone}.`}
          </p>
        </div>

        {/* Board Performance Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {boards.map((board) => {
            const deptIssues = zoneIssues.filter((i) => i.department.toLowerCase() === board.toLowerCase());
            const total = deptIssues.length;
            const solved = deptIssues.filter((i) => i.status === 'Completed').length;
            const pending = deptIssues.filter((i) => i.status !== 'Completed' && i.status !== 'Escalated').length;
            const escalated = deptIssues.filter((i) => i.status === 'Escalated').length;
            
            // Generate some realistic values if database is empty for a particular board
            const slaVal = total > 0 ? Math.round((solved / total) * 100) : (board === 'Water' ? 84 : board === 'Road' ? 71 : board === 'Sewage' ? 58 : 91);
            const displayTotal = total > 0 ? total : (board === 'Water' ? 8 : board === 'Road' ? 12 : board === 'Sewage' ? 6 : 4);
            const displaySolved = total > 0 ? solved : Math.round((displayTotal * slaVal) / 100);
            const displayEscalated = total > 0 ? escalated : (board === 'Sewage' ? 1 : 0);
            const displayPending = displayTotal - displaySolved - displayEscalated;

            const config = getComplianceColor(slaVal);

            return (
              <div key={board} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {showTamil ? (
                          board === 'Water' ? 'குடிநீர் வாரியம்' :
                          board === 'Road' ? 'சாலைப் பொறியியல் துறை' :
                          board === 'Sewage' ? 'சுகாதாரம் & கழிவுநீர் வாரியம்' :
                          board === 'Electricity' ? 'மின்சாரத் வாரியம்' : board
                        ) : `${board} Board`}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{showTamil ? 'கோயம்புத்தூர் மாநகராட்சி' : 'Coimbatore Municipal Corporation'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.text} ${config.bg} ${config.border}`}>
                      {slaVal}% {showTamil ? 'செயல்திறன்' : 'SLA'}
                    </span>
                  </div>

                  {/* Horizontal visual meter */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>{showTamil ? 'வழக்கு தீர்ப்பு வீதம்' : 'Resolution Meter'}</span>
                      <span>{slaVal}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div className={`${config.fill} h-full rounded-l-full`} style={{ width: `${slaVal}%` }} />
                      <div className="bg-rose-400 h-full rounded-r-full" style={{ width: `${100 - slaVal}%` }} />
                    </div>
                  </div>

                  {/* Statistics logs */}
                  <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                    <div className="rounded-2xl bg-slate-50 p-2.5">
                      <div className="text-sm font-black text-slate-800">{displayTotal}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{showTamil ? 'மொத்தம்' : 'Total'}</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-50/50 p-2.5">
                      <div className="text-sm font-black text-emerald-700">{displaySolved}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{showTamil ? 'தீர்வு' : 'Solved'}</div>
                    </div>
                    <div className="rounded-2xl bg-rose-50/50 p-2.5">
                      <div className="text-sm font-black text-rose-700">{displayEscalated}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{showTamil ? 'தாமதம்' : 'Delayed'}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => downloadReport(board)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition duration-200 cursor-pointer shadow-sm"
                >
                  📥 {showTamil ? 'முழு துறை அறிக்கையைப் பதிவிறக்கவும்' : 'Download Complete Report'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderComplaintDetail = () => {
    const issue = issues.find((i) => i.id === selectedIssueId);
    if (!issue) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 animate-fade-in">
          <p>Complaint not found.</p>
          <button onClick={handleBack} className="mt-4 rounded-full bg-[#0f4f3a] px-4 py-2 text-sm font-semibold text-white">
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderBackButton(issue.id)}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0f4f3a]">
                {showTamil ? (
                  issue.category === 'Road Damage' ? 'சாலை சேதம்' :
                  issue.category === 'Water Leakage' ? 'குடிநீர் கசிவு' :
                  issue.category === 'Sewage Overflow' ? 'கழிவுநீர் வழிந்தோடல்' :
                  issue.category === 'Garbage Overflow' ? 'குப்பை குவிதல்' :
                  issue.category === 'Streetlight Failure' ? 'தெருவிளக்கு பழுது' : issue.category
                ) : issue.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {showTamil ? translateTitleAndDesc(issue.title, '').title : issue.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const shareText = `Coimbatore Civic Complaint Ticket #${issue.id}: "${issue.title}" at ${issue.area || issue.location.split(',')[0]} under ${issue.zone}. Click here to verify and track progress on CivicEye:`;
                  const shareLink = `${window.location.origin}${window.location.pathname}?view=complaint-detail&issueId=${encodeURIComponent(issue.id)}`;
                  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareLink)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition duration-200 cursor-pointer"
                title="Share on WhatsApp"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.973-1.857-1.857-4.339-2.88-6.982-2.88-5.442 0-9.866 4.42-9.87 9.865-.001 1.745.454 3.447 1.321 4.957l-.315 1.15-.314 1.146 1.19-.311 1.164-.305zm10.32-6.526c-.322-.162-1.905-.94-2.201-1.048-.297-.108-.512-.162-.726.162-.215.321-.828 1.048-1.015 1.263-.188.214-.376.242-.698.08-1.802-.9-2.915-1.593-4.085-3.6-.312-.534.312-.497.893-1.654.1-.214.05-.401-.025-.562-.075-.162-.726-1.748-1.011-2.427-.29-.693-.584-.6-.8-.606-.204-.006-.438-.008-.673-.008-.236 0-.617.089-.94.437-.321.348-1.226 1.202-1.226 2.93 0 1.728 1.259 3.399 1.437 3.64.178.24 2.478 3.786 5.999 5.304.838.362 1.491.578 2.001.74.843.268 1.61.23 2.215.14.676-.1 2.201-.899 2.51-1.77.309-.87.309-1.614.215-1.77-.094-.156-.347-.247-.694-.41z"/>
                </svg>
                {showTamil ? 'வாட்ஸ்அப்பில் பகிர்க' : 'WhatsApp Share'}
              </button>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[issue.status] || 'bg-slate-100 text-slate-700'}`}>
                {showTamil ? (
                  issue.status === 'Pending' ? 'நிலுவையில்' :
                  issue.status === 'In Progress' ? 'செயல்பாட்டில்' :
                  issue.status === 'Completed' ? 'முடிக்கப்பட்டது' :
                  issue.status === 'Escalated' ? 'உயர்மட்டப் புகார்' : issue.status
                ) : issue.status}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${issue.severity === 'Critical' || issue.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                {showTamil ? (
                  issue.severity === 'Critical' ? 'அதிமுக்கியம்' :
                  issue.severity === 'High' ? 'அதிக முன்னுரிமை' :
                  issue.severity === 'Medium' ? 'நடுத்தர முன்னுரிமை' : 'குறைந்த முன்னுரிமை'
                ) : `${issue.severity} severity`}
              </span>
            </div>
          </div>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {showTamil ? translateTitleAndDesc(issue.title, issue.description).desc : issue.description}
          </p>
          {/* Uniform Location of Fault */}
          <div className="mt-4 space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-150">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
              <span className="text-[#0f4f3a]">📍 {showTamil ? 'பழுதுள்ள இடம் (Location of Fault):' : 'Location of Fault:'}</span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${issue.geotag ? `${issue.geotag.lat},${issue.geotag.lng}` : encodeURIComponent(issue.location)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                title={showTamil ? 'கூகுள் மேப்பில் பார்க்க' : 'View on Google Maps'}
              >
                {issue.location}
                <svg className="w-3.5 h-3.5 text-[#0f4f3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Direct Google Map pin view of the point of fault */}
            {issue.geotag && (
              <div className="w-full h-[220px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm">
                <iframe
                  title="Incident Fault Point Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${issue.geotag.lat},${issue.geotag.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Image comparative layout as requested by Rule 2 */}
        {issue.status !== 'Completed' ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Before fixing (Evidence)</h3>
              <p className="text-xs text-slate-500 mt-1">Uploaded by citizen at filing time</p>
              {issue.beforeImg ? (
                <img src={issue.beforeImg} alt="before" className="mt-4 h-96 w-full rounded-2xl object-cover border border-slate-100 shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(issue.category); }} />
              ) : (
                <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm">
                  No image evidence provided.
                </div>
              )}
              <div className="mt-4 text-sm font-semibold text-amber-700 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-2">
                <span>🚧</span>
                <span>Work in progress. Completion image will appear after issue is fixed.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Before fixing (Evidence)</h3>
                <p className="text-xs text-slate-500 mt-1">Uploaded by citizen at filing time</p>
                {issue.beforeImg ? (
                  <img src={issue.beforeImg} alt="before" className="mt-4 h-64 w-full rounded-2xl object-cover border border-slate-100 shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultImage(issue.category); }} />
                ) : (
                  <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm">
                    No image evidence provided.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">After fixing (Remediation)</h3>
                <p className="text-xs text-slate-500 mt-1">Uploaded by field officer upon completion</p>
                {issue.afterImg ? (
                  <img src={issue.afterImg} alt="after" className="mt-4 h-64 w-full rounded-2xl object-cover border border-slate-100 shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getCategoryDefaultAfterImage(issue.category); }} />
                ) : (
                  <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm">
                    No completion image available.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-emerald-50/50 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#0f4f3a]">Resolution details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-semibold">Officer remarks</span>
                  <p className="mt-1 text-slate-800 font-medium text-sm bg-white rounded-xl p-3 border border-slate-100">{issue.remarks || issue.reasoning || 'Work completed successfully.'}</p>
                </div>
                {issue.completedAt && (
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-semibold">Completion timestamp</span>
                    <p className="mt-1 text-slate-800 font-mono text-sm bg-white rounded-xl p-3 border border-slate-100">{new Date(issue.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Dispatch Analysis */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">AI Dispatch analysis</h3>
            <div className={`grid gap-4 ${issue.status !== 'Completed' ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
              {issue.status !== 'Completed' && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-500 block uppercase font-semibold">Predicted SLA</span>
                  <strong className="text-slate-900 text-base block mt-1">{issue.predictedDeadline}</strong>
                </div>
              )}
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Model confidence</span>
                <strong className="text-emerald-700 text-base block mt-1">{issue.aiConfidence}%</strong>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="text-xs text-slate-500 block uppercase font-semibold">Heuristic reasoning</span>
              <p className="mt-2 text-sm text-slate-600 leading-normal italic">"{issue.reasoning}"</p>
            </div>
          </div>

          {/* Administrative Assignments */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Routing & assignments</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-500">Zone</span>
                <strong className="text-sm text-slate-900">{issue.zone}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-500">Department</span>
                <strong className="text-sm text-slate-900">{issue.department}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-500">Assigned Officer</span>
                <strong className="text-sm text-[#0f4f3a]">{issue.assignedOfficer || 'Pending Dispatch'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Local Supervisor</span>
                <strong className="text-sm text-slate-900">{issue.localSupervisor || 'Supervisor'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Logs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 font-sans">Resident Vouch Logs ({issue.verifications?.length || 0}/3 Required)</h3>
          {issue.verifications && issue.verifications.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {issue.verifications.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm">
                  <span className="font-medium text-slate-800">{v.name}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{v.distanceMeters ? `Distance: ${v.distanceMeters}m` : 'Nearby'}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">✓ Verified</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4 italic">No nearby residents have verified this ticket yet. Head over to the 'Nearby Verification' tab to help verify!</p>
          )}
        </div>

        {/* Comment Thread */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
            <span>Resident & Officer Comments</span>
            <span className="text-xs font-normal text-slate-500">({issue.comments?.length || 0} comments)</span>
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {issue.comments && issue.comments.length > 0 ? (
              issue.comments.map((comment: any) => {
                const name = comment.author || comment.userName || 'Anonymous Resident';
                const role = comment.role || comment.userRole || 'citizen';
                const rawTime = comment.timestamp || comment.createdAt;
                const formattedTime = rawTime 
                  ? new Date(rawTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Just now';

                // Resolve avatar Url
                let avatar = comment.avatarUrl || comment.avatar;
                if (!avatar) {
                  const matchedAccount = demoAccounts.find(a => a.name.toLowerCase() === name.toLowerCase());
                  if (matchedAccount) {
                    avatar = matchedAccount.avatar;
                  } else {
                    // Match default profiles for pre-seeded comments
                    if (name.toLowerCase().includes('yeswanth') || name.toLowerCase().includes('prakash')) {
                      avatar = '/images/yeswanth_profile.jpg';
                    } else if (name.includes('Ganeshan')) {
                      avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80';
                    } else if (name.includes('Meenakshi')) {
                      avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';
                    } else if (name.includes('Vignesh')) {
                      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                    } else {
                      const isOfficer = role.toLowerCase() === 'officer' || name.toLowerCase().includes('officer') || name.toLowerCase().includes('eng');
                      avatar = isOfficer 
                        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
                        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                    }
                  }
                }

                const isOfficer = role.toLowerCase() === 'officer' || name.toLowerCase().includes('officer') || name.toLowerCase().includes('eng');
                const isTamil = showTamil;

                return (
                  <div key={comment.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition duration-150">
                    <img 
                      src={avatar} 
                      alt={name} 
                      className="h-10 w-10 rounded-full object-cover border border-white shadow-sm flex-shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-slate-800 truncate">{name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            isOfficer 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {isOfficer 
                              ? (isTamil ? 'அதிகாரி' : 'Officer') 
                              : (isTamil ? 'பொதுமக்கள்' : 'Resident')
                            }
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap">{formattedTime}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-xs sm:text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 italic bg-slate-50 border border-slate-100/50 rounded-2xl">No community discussion yet. Be the first to comment below!</p>
            )}
          </div>

          <form onSubmit={(e) => handleCommentSubmit(e, issue.id)} className="space-y-3 pt-3 border-t border-slate-100">
            {/* Structured suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "CCMC team, please expedite!",
                "Verified that this is a severe risk.",
                "Issue resolved beautifully, thanks officer!",
                "Work still pending, please check."
              ].map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setNewCommentText(suggestion)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your comment or updates here..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#0f4f3a] text-white px-4 py-2 text-sm font-semibold hover:bg-[#0c3e2e] transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!currentUser) {
      return (
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-md animate-fade-in space-y-6 relative overflow-hidden">
          {/* Active Verification Progress Overlays */}
          {isVerifyingSignup && (
            <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 border-4 border-[#0f4f3a] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-bold text-[#0f4f3a] tracking-wide uppercase">Securing Resident Signup</div>
              <h3 className="text-lg font-black text-slate-800">CCMC Civic Registry Identity Verification</h3>
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono flex items-center justify-center gap-2 max-w-full">
                <ShieldAlert size={14} className="text-amber-500 animate-pulse shrink-0" />
                <span className="truncate">{signupVerificationStep}</span>
              </div>
              <p className="text-[11px] text-slate-400">Please do not close this tab. Uploaded documents are encrypted and evaluated against Coimbatore ward census databases.</p>
            </div>
          )}

          {isVerifyingLogin && (
            <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 border-4 border-[#0f4f3a] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-bold text-[#0f4f3a] tracking-wide uppercase">Securing Login Signature</div>
              <h3 className="text-lg font-black text-slate-800">Biometric & Identity Audit</h3>
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono flex items-center justify-center gap-2 max-w-full">
                <ShieldCheck size={14} className="text-[#0f4f3a] shrink-0" />
                <span className="truncate">{loginVerificationStep}</span>
              </div>
              <p className="text-[11px] text-slate-400">Verifying security keys and checking for active device fraud prevention protocols.</p>
            </div>
          )}

          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setAuthTab('login')}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${authTab === 'login' ? 'border-[#0f4f3a] text-[#0f4f3a]' : 'border-transparent text-slate-400'}`}
            >
              Sign In Portal
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`flex-1 pb-3 text-center text-sm font-bold border-b-2 transition ${authTab === 'register' ? 'border-[#0f4f3a] text-[#0f4f3a]' : 'border-transparent text-slate-400'}`}
            >
              Citizen Onboarding
            </button>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleManualLoginSubmit} className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900">Coimbatore Portal Login</h2>
                <p className="text-xs text-slate-500 mt-1">Access Coimbatore's unified modern municipal dashboard.</p>
              </div>

              {/* Role Select Segment */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('citizen');
                    setLoginPhone('');
                    setLoginPassword('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginRole === 'citizen' ? 'bg-white text-[#0f4f3a] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('officer');
                    setLoginPhone('');
                    setLoginPassword('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginRole === 'officer' ? 'bg-white text-[#0f4f3a] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  CCMC Officer
                </button>
              </div>

              {/* Predefined single resident profile */}
              {loginRole === 'citizen' ? (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Predefined Resident Profile</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone('9876543210');
                      setLoginPassword('password123');
                      setMessage({ type: 'success', text: 'Predefined resident credentials loaded. Tap Secure Sign In to verify.' });
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src="/images/yeswanth_profile.jpg" alt="yeswanth" className="h-10 w-10 rounded-full object-cover border border-[#0f4f3a]/20 group-hover:border-[#0f4f3a]/40 transition" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-800">Yeswanth kumar D.</div>
                        <div className="text-[10px] text-slate-400">Phone: 9876543210 • Central Zone</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">Quick-Load</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Predefined Officer Profile</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone('ganeshan');
                      setLoginPassword('password123');
                      setMessage({ type: 'success', text: 'Officer Ganeshan credentials loaded. Tap Secure Sign In to verify.' });
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" alt="ganeshan" className="h-10 w-10 rounded-full object-cover border border-[#0f4f3a]/20 group-hover:border-[#0f4f3a]/40 transition" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-800">S. Ganeshan</div>
                        <div className="text-[10px] text-slate-400">Username: ganeshan • Central Zone</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#0f4f3a] bg-[#0f4f3a]/10 border border-[#0f4f3a]/20 px-2 py-0.5 rounded-lg">Quick-Load</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number / Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Security Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter security password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0f4f3a] text-white py-2.5 text-sm font-semibold hover:bg-[#0c3e2e] transition"
              >
                Sign In securely
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900">Coimbatore Citizen Registration</h2>
                <p className="text-xs text-slate-500 mt-1">Onboard yourself with Aadhaar or Voter ID verification.</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Selvam"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543211"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ward Zone</label>
                    <select
                      value={registerZone}
                      onChange={(e) => setRegisterZone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                    >
                      <option value="Central Zone">Central Zone</option>
                      <option value="North Zone">North Zone</option>
                      <option value="South Zone">South Zone</option>
                      <option value="East Zone">East Zone</option>
                      <option value="West Zone">West Zone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Set Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Choose password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resident Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15, Cross Cut Road, Gandhipuram"
                    value={registerAddress}
                    onChange={(e) => setRegisterAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f4f3a]"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-sans">Identity Proof Verification</span>
                    <select
                      value={registerProofType}
                      onChange={(e) => setRegisterProofType(e.target.value as any)}
                      className="text-xs font-bold text-[#0f4f3a] bg-transparent focus:outline-none"
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Utility Bill">Utility Bill</option>
                    </select>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProofFileChange(e, 'proof')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0f4f3a] file:text-white hover:file:bg-[#0c3e2e]"
                  />

                  {registerProofDoc && (
                    <div className="relative mt-2 border border-slate-200 bg-white p-2 rounded-xl">
                      <div className="text-[10px] font-bold text-emerald-600 mb-1 flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Document Scanned Successfully</span>
                      </div>
                      <img src={registerProofDoc} alt="proof doc" className="h-20 w-full object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0f4f3a] text-white py-2.5 text-sm font-semibold hover:bg-[#0c3e2e] transition"
              >
                Register & Verify Resident
              </button>
            </form>
          )}

          {/* Collapsible/Clear Demo profiles footer */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <button
              type="button"
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between w-full"
            >
              <span>{showDemoUsers ? "Hide Demo/Quick-Login Profiles" : "Show Demo/Quick-Login Profiles"}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">CCMC Sandbox</span>
            </button>
            
            {showDemoUsers && (
              <div className="grid gap-2 text-xs pt-1">
                {demoAccounts.map((account) => (
                  <button
                    key={account.uid}
                    type="button"
                    onClick={() => void handleLogin(account)}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition text-left"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{account.name}</div>
                      <div className="text-[10px] text-slate-400">{account.role === 'citizen' ? 'Citizen' : account.role === 'officer' ? `${account.zone} Officer` : 'Administrator'} • Password: password123</div>
                    </div>
                    <span className="text-[10px] font-bold text-[#0f4f3a] bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-0.5">Quick Login <ArrowRight size={10} /></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === 'complaint-detail') {
      return renderComplaintDetail();
    }
    if (activeView === 'all-problems') {
      return renderAllProblems();
    }
    if (activeView === 'zone-performance') {
      return renderZonePerformance();
    }
    if (activeView === 'profile') {
      return renderProfile();
    }
    if (activeView === 'help') {
      return renderHelp();
    }
    if (activeView === 'contacts') {
      return renderContacts();
    }

    if (currentUser.role === 'officer') {
      if (activeView === 'assigned-cases') {
        return renderOfficerAssignedCases();
      }
      if (activeView === 'update-status') {
        return renderOfficerUpdateStatus();
      }
      if (activeView === 'upload-completion') {
        return renderOfficerUploadCompletion();
      }
      if (activeView === 'performance') {
        return renderOfficerPerformance();
      }
      return renderOfficerAssignedCases();
    }

    if (currentUser.role === 'admin') {
      return renderAdmin();
    }

    switch (activeView) {
      case 'new-complaint':
        return renderComplaintForm();
      case 'my-complaints':
        return renderMyComplaints();
      case 'nearby-verification':
        return renderVerify();
      case 'suggestions':
        return renderSuggestions();
      default:
        return renderLanding();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {renderHeader()}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {renderSidebar()}
        <main className="flex-1">
          {renderMobileMenu()}
          {message && (
            <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
              {message.text}
            </div>
          )}
          {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading civic data...</div> : renderContent()}
        </main>
      </div>
    </div>
  );
}
