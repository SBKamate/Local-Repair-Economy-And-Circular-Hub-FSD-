import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Layers,
  Database,
  GitBranch,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Server,
  Activity,
  Workflow,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { systemService } from '../services/api';

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await systemService.getHealth();
        setHealthStatus(res.data);
      } catch (err) {
        setHealthStatus({
          status: 'development-standby',
          database: { connected: false, type: 'In-Memory Development Store' },
          storage: { provider: 'Local Disk (/uploads)' },
        });
      }
    };
    fetchHealth();
  }, []);

  const tabs = [
    { id: 'architecture', label: '1. System Architecture', icon: Layers },
    { id: 'usecase', label: '2. Use Case Diagram', icon: Workflow },
    { id: 'dfd', label: '3. Data Flow Diagram (DFD)', icon: GitBranch },
    { id: 'erd', label: '4. ER Diagram (ERD)', icon: Database },
    { id: 'requirements', label: '5. Functional Specs', icon: CheckCircle2 },
    { id: 'live-status', label: '6. Live System Status', icon: Activity },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>College Mini-Project Examination & Defense Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          FixNear Technical Documentation & Diagrams
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Comprehensive project engineering review artifacts prepared for laboratory evaluation, project guide review, and viva examination.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 text-teal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-8 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>3-Tier MERN Architecture Overview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Decoupled client-server architecture with RESTful communication and cloud persistence.
            </p>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Presentation Tier */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  UI
                </div>
                <span>Client / Presentation Tier</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>React 18 + Vite:</strong> Component-driven SPA</li>
                <li><strong>Tailwind CSS:</strong> Custom UI system</li>
                <li><strong>React Router v6:</strong> Client-side routing & protected guards</li>
                <li><strong>Axios:</strong> Async HTTP requests with JWT injection</li>
                <li><strong>Lucide Icons:</strong> Consistent iconography</li>
              </ul>
            </div>

            {/* Application Tier */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
                <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center">
                  API
                </div>
                <span>Application / Business Tier</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>Node.js & Express:</strong> Non-blocking REST API</li>
                <li><strong>JWT & bcryptjs:</strong> Role-based access control</li>
                <li><strong>Multer:</strong> Multipart damage photo handling</li>
                <li><strong>Modular AI Hooks:</strong> Pluggable CV classification</li>
                <li><strong>Fallback Store:</strong> Zero-crash development reliability</li>
              </ul>
            </div>

            {/* Persistence Tier */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 font-bold text-navy-900 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  DB
                </div>
                <span>Data & Storage Tier</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>MongoDB Atlas:</strong> Scalable NoSQL document store</li>
                <li><strong>Mongoose ODM:</strong> Schema validation & relations</li>
                <li><strong>Cloudinary CDN:</strong> Remote image storage</li>
                <li><strong>Static Local Storage:</strong> Zero-dependency fallback</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Use Case Diagram */}
      {activeTab === 'usecase' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-teal-600" />
              <span>FixNear Use Case Specifications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Actor-to-System interaction model across Customer, Repairer, and Platform Administrator roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                <span>Actor: Customer (Resident)</span>
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>UC-1: Register & Log in with secure credentials</li>
                <li>UC-2: Upload damage photo with drag-and-drop</li>
                <li>UC-3: Categorize item (Furniture, Electronics, Appliance, etc.)</li>
                <li>UC-4: Enter problem description, neighborhood, and time</li>
                <li>UC-5: Search and filter local verified technicians</li>
                <li>UC-6: Track real-time repair lifecycle status</li>
                <li>UC-7: Book service and confirm estimated pricing</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-navy-600"></span>
                <span>Actor: Local Repairer (Technician)</span>
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>UC-8: Register with trade skills, area, & experience</li>
                <li>UC-9: Receive incoming customer damage requests</li>
                <li>UC-10: Inspect uploaded product damage photo</li>
                <li>UC-11: Accept request & issue estimated labor cost</li>
                <li>UC-12: Update status (Pending → In Progress → Restored)</li>
                <li>UC-13: Manage on-site appointment schedule</li>
                <li>UC-14: Toggle real-time availability (Available / Busy)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Flow Diagram */}
      {activeTab === 'dfd' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-teal-600" />
              <span>Data Flow Diagram (Level 0 & Level 1)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step data path from frontend client intake to backend processing and persistence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-4">
            <p className="text-teal-400 font-bold">// DFD Level 0 Context Diagram:</p>
            <div className="whitespace-pre text-[11px] leading-relaxed">
{`[ Customer ] ──── (1. Damage Photo + Problem Details) ────► [ FixNear Platform ]
                                                                 │
[ Repairer ] ◄─── (2. Matched Repair Requests) ──────────────────┤
                                                                 │
[ Repairer ] ──── (3. Labor Quote & Acceptance) ───────────────► ┤
                                                                 │
[ Customer ] ◄─── (4. Confirmation & Booking Updates) ───────────┘`}
            </div>

            <p className="text-teal-400 font-bold pt-4">// DFD Level 1 Detailed Request Processing:</p>
            <div className="whitespace-pre text-[11px] leading-relaxed">
{`1.0 Form Intake ──► Multer Filter (Mime/Size Check) ──► Storage Handler (Cloudinary / Disk)
2.0 Request Validation ──► Category / Location Check ──► Controller (requestController.js)
3.0 Persistence ──► Mongoose Model (ServiceRequest) ──► MongoDB Atlas Collections
4.0 Broadcast ──► Query Filter (Repairers in Radius) ──► Repairer Dashboard Stream
5.0 Status Sync ──► State Machine (pending -> accepted -> in_progress -> completed)`}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Entity Relationship Diagram */}
      {activeTab === 'erd' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              <span>Entity Relationship Diagram (ERD Schema)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Relational references and schema models designed with Mongoose ODM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-navy-900">User Model</h4>
              <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                <li>_id: ObjectId [PK]</li>
                <li>name: String</li>
                <li>email: String [Unique]</li>
                <li>password: String [Hashed]</li>
                <li>phone: String</li>
                <li>role: 'customer' | 'repairer'</li>
                <li>createdAt: Date</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-navy-900">Repairer Model</h4>
              <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                <li>_id: ObjectId [PK]</li>
                <li>userId: ObjectId [FK → User]</li>
                <li>serviceCategories: [String]</li>
                <li>location: String</li>
                <li>experience: String</li>
                <li>availability: String</li>
                <li>rating: Number</li>
                <li>estimatedCharges: String</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-navy-900">ServiceRequest Model</h4>
              <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                <li>_id: ObjectId [PK]</li>
                <li>customerId: ObjectId [FK]</li>
                <li>imageUrl: String</li>
                <li>category: Enum</li>
                <li>description: String</li>
                <li>location: String</li>
                <li>preferredDate: String</li>
                <li>status: Enum</li>
                <li>assignedRepairerId: FK</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-navy-900">Booking Model</h4>
              <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                <li>_id: ObjectId [PK]</li>
                <li>customerId: ObjectId [FK]</li>
                <li>repairerId: ObjectId [FK]</li>
                <li>serviceRequestId: ObjectId [FK]</li>
                <li>agreedPrice: Number</li>
                <li>scheduledDate: String</li>
                <li>status: Enum</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-navy-900">Review Model</h4>
              <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                <li>_id: ObjectId [PK]</li>
                <li>customerId: ObjectId [FK]</li>
                <li>repairerId: ObjectId [FK]</li>
                <li>rating: Number (1-5)</li>
                <li>comment: String</li>
                <li>createdAt: Date</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Functional & Non-Functional Specs */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span>Functional & Non-Functional Requirements</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Compliance against project specification goals.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Functional Requirements:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-1: End-to-end Problem Intake & Image Upload</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-2: Dynamic Category & Location Matching Engine</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-3: Customer Dashboard with Status Lifecycle</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-4: Repairer Hub with Accept / Reject & Quotes</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-5: JWT Authentication & Password Hashing</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>FR-6: Modular Future-ready AI Diagnostic Pipeline</span>
              </div>
            </div>

            <h3 className="font-bold text-navy-900 text-sm pt-4">Non-Functional Requirements:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                <strong>NFR-1 (Usability):</strong> Startup-grade theme (Deep Navy #153B50, Teal #16A085, Inter font).
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                <strong>NFR-2 (Responsiveness):</strong> Mobile, tablet, and widescreen desktop support.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                <strong>NFR-3 (Fault Tolerance):</strong> Zero-crash development fallback when MongoDB Atlas or Cloudinary is pending.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                <strong>NFR-4 (Security):</strong> JWT token verification, route guards, environment-isolated credentials.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Live System Status */}
      {activeTab === 'live-status' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Live System Diagnostic Telemetry</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active status pinged from Express backend at <code>/api/health</code>.
            </p>
          </div>

          {healthStatus ? (
            <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Server Health Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{healthStatus.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Engine:</span>
                <span className="text-teal-300">{healthStatus.database?.type || 'MongoDB / Mongoose'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Connected:</span>
                <span className={healthStatus.database?.connected ? 'text-emerald-400' : 'text-amber-400'}>
                  {healthStatus.database?.connected ? 'Yes (Live MongoDB)' : 'Dev Store Fallback (Seamless)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Image Media Provider:</span>
                <span className="text-teal-300">{healthStatus.storage?.provider || 'Local / Uploads'}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <span>Last Telemetry Sync:</span>
                <span>{healthStatus.timestamp || new Date().toISOString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Pinging backend healthcheck...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentationPage;
