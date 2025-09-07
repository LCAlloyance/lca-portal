import React, { useState, useEffect } from "react";
import apiService from "./services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Home,
  Database,
  TrendingUp,
  FileText,
  Settings,
  Menu,
  X,
  Recycle,
  Factory,
  Zap,
  Truck,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Target,
  Shield,
  Award,
  Users,
  Leaf,
  BarChart3,
  Activity,
} from "lucide-react";

const CircularMetalsPlatform = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [processData, setProcessData] = useState({
    material: "",
    production: "",
    rawMaterial: 50,
    recycledContent: 50,
    energyUse: "",
    transport: "",
    endOfLife: "",
  });
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    environmentalImpact: [],
    circularityIndicators: [],
    flowData: [],
    pieData: [],
  });
  const [apiStatus, setApiStatus] = useState("connecting");

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
    loadDashboardData();
  }, []);

  const checkApiHealth = async () => {
    try {
      await apiService.checkHealth();
      setApiStatus("connected");
    } catch (error) {
      console.warn("API not available, using mock data");
      setApiStatus("offline");
    }
  };

  const loadDashboardData = async () => {
    try {
      if (apiStatus === "connected") {
        const [environmental, circularity, flow, pie] = await Promise.all([
          apiService.getEnvironmentalImpact(),
          apiService.getCircularityIndicators(),
          apiService.getFlowData(),
          apiService.getPieData(),
        ]);

        setDashboardData({
          environmentalImpact: environmental.data,
          circularityIndicators: circularity.data,
          flowData: flow.data,
          pieData: pie.data,
        });
      } else {
        // Fallback mock data with more realistic variations
        setDashboardData({
          environmentalImpact: [
            { name: "CO₂ Emissions", conventional: 850, circular: 320 },
            { name: "Energy Use", conventional: 1200, circular: 680 },
            { name: "Water Use", conventional: 400, circular: 180 },
            { name: "Waste Generation", conventional: 200, circular: 45 },
          ],
          circularityIndicators: [
            { name: "Recycled Content", value: 68, target: 80 },
            { name: "Resource Efficiency", value: 74, target: 85 },
            { name: "Product Lifespan", value: 61, target: 75 },
            { name: "Recovery Rate", value: 47, target: 60 },
          ],
          flowData: [
            { stage: "Raw Materials", material: 100, recycled: 0 },
            { stage: "Production", material: 94, recycled: 62 },
            { stage: "Manufacturing", material: 89, recycled: 84 },
            { stage: "Distribution", material: 87, recycled: 82 },
            { stage: "End-of-Life", material: 28, recycled: 72 },
          ],
          pieData: [
            { name: "Recycled Content", value: 42, color: "#059669" },
            { name: "Virgin Materials", value: 38, color: "#3b82f6" },
            { name: "Bio-based", value: 12, color: "#f59e0b" },
            { name: "Other", value: 8, color: "#8b5cf6" },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const navigation = [
    {
      id: "home",
      label: "Overview",
      icon: Home,
      description: "Platform overview",
    },
    {
      id: "dashboard",
      label: "Analytics",
      icon: BarChart3,
      description: "Real-time metrics",
    },
    {
      id: "assessment",
      label: "Assessment",
      icon: Activity,
      description: "LCA evaluation",
    },
    {
      id: "analysis",
      label: "Insights",
      icon: TrendingUp,
      description: "Impact analysis",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      description: "Export data",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configuration",
    },
  ];

  const runAssessment = async () => {
    setLoading(true);
    try {
      if (apiStatus === "connected") {
        const response = await apiService.runAssessment(processData);
        setAssessmentResults(response.data);
      } else {
        // Simulate realistic processing time
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // More sophisticated mock calculation
        const recycledWeight = processData.recycledContent / 100;
        const energyBonus =
          processData.energyUse === "renewable"
            ? 15
            : processData.energyUse === "mixed"
            ? 8
            : 0;
        const transportBonus =
          processData.transport === "rail"
            ? 10
            : processData.transport === "ship"
            ? 8
            : processData.transport === "local"
            ? 12
            : 0;

        const baseScore = Math.round(
          45 + recycledWeight * 35 + energyBonus + transportBonus
        );
        const envScore = Math.round(
          50 + recycledWeight * 30 + energyBonus * 0.8
        );

        const materialSpecificRecs = {
          steel: [
            "Implement electric arc furnace technology",
            "Increase scrap steel utilization",
          ],
          aluminum: [
            "Adopt hydroelectric smelting processes",
            "Optimize alloy composition",
          ],
          copper: [
            "Enhance flotation efficiency",
            "Implement closed-loop water systems",
          ],
          zinc: [
            "Utilize direct leaching processes",
            "Improve dust collection systems",
          ],
        };

        const baseRecs = materialSpecificRecs[processData.material] || [
          "Optimize material composition",
          "Implement energy recovery systems",
        ];

        const results = {
          circularityScore: Math.min(95, Math.max(25, baseScore)),
          environmentalScore: Math.min(90, Math.max(30, envScore)),
          recommendations: [
            ...baseRecs,
            "Develop supplier circularity partnerships",
            "Implement predictive maintenance protocols",
          ],
          missingParams: Object.values(processData).filter(
            (v) => !v || v === ""
          ).length,
          confidence: Math.round(85 + Math.random() * 10),
        };

        setAssessmentResults(results);
      }
    } catch (error) {
      console.error("Assessment failed:", error);
      // Show error state but don't crash
    }
    setLoading(false);
  };

  const exportReport = async () => {
    try {
      if (apiStatus === "connected") {
        await apiService.exportReport();
      } else {
        // Mock export functionality
        const csvContent =
          "data:text/csv;charset=utf-8," +
          "Metric,Conventional,Circular\n" +
          "CO2 Emissions,850,320\n" +
          "Energy Use,1200,680\n" +
          "Water Use,400,180\n" +
          "Waste Generation,200,45";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `alloyance_report_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 shadow-2xl border-r border-slate-700/50`}
    >
      <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="flex items-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-xl blur-sm"></div>
            <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
              <Recycle size={28} className="text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ALLOYANCE
            </h1>
            <p className="text-xs text-white/80 font-medium">
              LCA Platform
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors relative z-10"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-200 shadow-lg shadow-emerald-500/10"
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg mr-3 transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-700/50 group-hover:bg-slate-600/50"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-semibold text-white">
              System Status
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">API Connection</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus === "connected"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              }`}
            >
              {apiStatus === "connected" ? "Online" : "Demo Mode"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {navigation.find((nav) => nav.id === activeTab)?.label}
            </h2>
            {activeTab !== "home" && (
              <div className="ml-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600">
                  Live Data
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-200/50">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                apiStatus === "connected"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-orange-500"
              }`}
            ></div>
            <span className="text-emerald-700 text-sm font-medium">
              {apiStatus === "connected" ? "Connected" : "Demo Mode"}
            </span>
          </div>
          <button
            onClick={exportReport}
            className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-2 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-slate-500/25 transform hover:scale-105 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
                <Leaf size={20} className="text-emerald-400 mr-2" />
                <span className="text-emerald-300 font-medium">
                  Reducing Carbon Footprints
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ALLOYANCE
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Advanced Life Cycle Assessment platform revolutionizing metals
                industry sustainability through intelligent circular economy
                optimization
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={() => setActiveTab("assessment")}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Activity size={20} />
                  <span>Start Assessment</span>
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <BarChart3 size={20} />
                  <span>View Analytics</span>
                </button>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    -
                  </div>
                  <div className="text-slate-300 text-sm">Accuracy Rate</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">
                    -
                  </div>
                  <div className="text-slate-300 text-sm">CO₂ Reduction</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    -
                  </div>
                  <div className="text-slate-300 text-sm">Assessments</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    24/7
                  </div>
                  <div className="text-slate-300 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Feature Cards */}
      <div className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Intelligent Sustainability Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your metals operations with cutting-edge AI technology
              and comprehensive environmental insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* AI Assessment Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-1 hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-emerald-500/25">
              <div className="bg-white rounded-3xl p-10 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl">
                        <Activity size={36} className="text-white" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-slate-900">
                        AI-Powered Assessment
                      </h3>
                      <p className="text-slate-600">Intelligent LCA Analysis</p>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-8 text-lg leading-relaxed">
                    Advanced machine learning algorithms analyze your processes,
                    estimate missing parameters, and provide instant circularity
                    scores with industry-leading precision.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        -
                      </div>
                      <div className="text-xs text-slate-600">
                        Accuracy Rate
                      </div>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-teal-600 mb-1">
                        &lt;3min
                      </div>
                      <div className="text-xs text-slate-600">
                        Processing Time
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("assessment")}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg group flex items-center justify-center space-x-2"
                  >
                    <span>Launch Assessment</span>
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl p-1 hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-slate-500/25">
              <div className="bg-white rounded-3xl p-10 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-600 rounded-2xl blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-br from-slate-600 to-slate-800 p-5 rounded-2xl">
                        <BarChart3 size={36} className="text-white" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-slate-900">
                        Real-time Analytics
                      </h3>
                      <p className="text-slate-600">Comprehensive Dashboards</p>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-8 text-lg leading-relaxed">
                    Unified command center with real-time metrics, circularity
                    indicators, and intelligent insights for data-driven
                    sustainability decisions.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-slate-700 mb-1">
                        50+
                      </div>
                      <div className="text-xs text-slate-600">KPI Metrics</div>
                    </div>
                    <div className="bg-slate-100 rounded-xl p-4">
                      <div className="text-2xl font-bold text-slate-700 mb-1">
                        Real-time
                      </div>
                      <div className="text-xs text-slate-600">Data Updates</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg group flex items-center justify-center space-x-2"
                  >
                    <span>View Analytics</span>
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Benefits Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Why Choose ALLOYANCE
            </h2>
            <p className="text-xl text-slate-300">
              Transforming metal industry sustainability with proven results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-emerald-500/20 backdrop-blur-sm p-8 rounded-full inline-block border border-emerald-500/30">
                  <Globe size={48} className="text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Global Standards</h3>
              <p className="text-slate-300 leading-relaxed">
                ISO 14040/14044 compliant assessments meeting international
                environmental requiremnets and standards 
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-teal-500/20 backdrop-blur-sm p-8 rounded-full inline-block border border-teal-500/30">
                  <Target size={48} className="text-teal-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Precision Analytics</h3>
              <p className="text-slate-300 leading-relaxed">
                Machine learning algorithms delivering - accuracy in
                sustainability impact predictions
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-cyan-500/20 backdrop-blur-sm p-8 rounded-full inline-block border border-cyan-500/30">
                  <Users size={48} className="text-cyan-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Support</h3>
              <p className="text-slate-300 leading-relaxed">
                Dedicated sustainability experts and 24/7 technical support for
                seamless implementation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join industry leaders in sustainable metals production and create
            measurable environmental impact
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setActiveTab("assessment")}
              className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <Activity size={20} />
              <span>Start Free Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="bg-emerald-800 border border-emerald-500 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-emerald-900 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <span>Explore Platform</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="p-6 space-y-8">
      {/* Enhanced Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Recycle className="text-emerald-600" size={24} />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Circularity Score
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">78%</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowRight className="rotate-[-45deg] mr-1" size={14} />
              +12% vs last month
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Factory className="text-blue-600" size={24} />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                CO₂ Reduction
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">-45%</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-blue-600 text-sm font-medium">
              530 tons saved this quarter
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Zap className="text-purple-600" size={24} />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Energy Efficiency
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">82%</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <ArrowRight className="rotate-[-45deg] mr-1" size={14} />
              +8% improvement
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <FileText className="text-orange-600" size={24} />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Active Assessments
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">24</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-orange-600 text-sm font-medium">
              6 pending review
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Environmental Impact Comparison */}
        <div className="xl:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Environmental Impact Analysis
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Circular vs Conventional Pathways
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Conventional</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span>Circular</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={dashboardData.environmentalImpact}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="conventional"
                fill="#ef4444"
                name="Conventional"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="circular"
                fill="#10b981"
                name="Circular"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Material Composition Pie Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Material Composition
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dashboardData.pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {dashboardData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {dashboardData.pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Material Flow and Circularity Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Material Flow */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Material Flow Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dashboardData.flowData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="stage"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="material"
                stackId="1"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="recycled"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Circularity Indicators */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Circularity Performance
          </h3>
          <div className="space-y-6">
            {dashboardData.circularityIndicators.map((indicator, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">
                    {indicator.name}
                  </span>
                  <span className="text-slate-900 font-semibold">
                    {indicator.value}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${indicator.value}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Current: {indicator.value}%</span>
                  <span>Target: {indicator.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle className="text-emerald-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">
                Steel Assessment Completed
              </p>
              <p className="text-sm text-slate-500">
                Circularity score: 78% - Above industry average
              </p>
              <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <RefreshCw className="text-blue-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">AI Model Updated</p>
              <p className="text-sm text-slate-500">
                New algorithm version 2.1.4 deployed
              </p>
              <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle className="text-orange-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Review Required</p>
              <p className="text-sm text-slate-500">
                Aluminum production assessment needs validation
              </p>
              <p className="text-xs text-slate-400 mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AssessmentView = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Input Form */}
        <div className="xl:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Life Cycle Assessment
                </h3>
                <p className="text-slate-600 mt-1">
                  Configure your production parameters for analysis
                </p>
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Step 1 of 1
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Metal Type
                  </label>
                  <select
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    value={processData.material}
                    onChange={(e) =>
                      setProcessData({
                        ...processData,
                        material: e.target.value,
                      })
                    }
                  >
                    <option value="">Select primary metal</option>
                    <option value="steel">Steel (Carbon & Stainless)</option>
                    <option value="aluminum">Aluminum</option>
                    <option value="copper">Copper</option>
                    <option value="zinc">Zinc</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Production Method
                  </label>
                  <select
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    value={processData.production}
                    onChange={(e) =>
                      setProcessData({
                        ...processData,
                        production: e.target.value,
                      })
                    }
                  >
                    <option value="">Select production process</option>
                    <option value="blast-furnace">Blast Furnace (BOF)</option>
                    <option value="electric-arc">Electric Arc Furnace</option>
                    <option value="direct-reduction">Direct Reduction</option>
                    <option value="smelting">Smelting Process</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Material Composition
                </label>
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-700 font-medium">
                      Recycled Content
                    </span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {processData.recycledContent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={processData.recycledContent}
                    onChange={(e) =>
                      setProcessData({
                        ...processData,
                        recycledContent: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>100% Virgin Material</span>
                    <span>100% Recycled Content</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Energy Source
                  </label>
                  <select
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    value={processData.energyUse}
                    onChange={(e) =>
                      setProcessData({
                        ...processData,
                        energyUse: e.target.value,
                      })
                    }
                  >
                    <option value="">Select energy profile</option>
                    <option value="renewable">100% Renewable Energy</option>
                    <option value="mixed">Mixed Energy Portfolio</option>
                    <option value="fossil">Fossil Fuel Based</option>
                    <option value="nuclear">Nuclear Power</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Transport Method
                  </label>
                  <select
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    value={processData.transport}
                    onChange={(e) =>
                      setProcessData({
                        ...processData,
                        transport: e.target.value,
                      })
                    }
                  >
                    <option value="">Select logistics method</option>
                    <option value="local">Local Supply (&lt;50km)</option>
                    <option value="rail">Railway Transport</option>
                    <option value="truck">Road Transport</option>
                    <option value="ship">Maritime Shipping</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  End-of-Life Strategy
                </label>
                <select
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                  value={processData.endOfLife}
                  onChange={(e) =>
                    setProcessData({
                      ...processData,
                      endOfLife: e.target.value,
                    })
                  }
                >
                  <option value="">Select disposal method</option>
                  <option value="recycle">Material Recovery & Recycling</option>
                  <option value="reuse">Direct Component Reuse</option>
                  <option value="recovery">Energy Recovery</option>
                  <option value="landfill">Landfill Disposal</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={runAssessment}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="animate-spin mr-3" size={20} />
                    Processing Assessment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Activity className="mr-3" size={20} />
                    Run AI Assessment
                  </div>
                )}
              </button>

              <button className="sm:w-auto w-full bg-slate-100 text-slate-700 py-4 px-8 rounded-xl hover:bg-slate-200 transition-colors">
                Save as Draft
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced AI Insights Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 rounded-2xl border border-emerald-200/50">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                <Activity className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  AI Assessment Engine
                </h3>
                <p className="text-sm text-slate-600">
                  Powered by machine learning
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-slate-700">
                <CheckCircle
                  className="text-emerald-500 mr-3 flex-shrink-0"
                  size={18}
                />
                <span>Parameter estimation & validation</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <CheckCircle
                  className="text-emerald-500 mr-3 flex-shrink-0"
                  size={18}
                />
                <span>Environmental impact prediction</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <CheckCircle
                  className="text-emerald-500 mr-3 flex-shrink-0"
                  size={18}
                />
                <span>Optimization pathway analysis</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <CheckCircle
                  className="text-emerald-500 mr-3 flex-shrink-0"
                  size={18}
                />
                <span>Compliance verification (ISO 14040/44)</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/70 rounded-xl border border-emerald-200/30">
              <div className="text-sm text-slate-600 mb-2">
                Processing Capability
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                98.5% Accuracy
              </div>
              <div className="text-xs text-slate-500">
                Based on 10,000+ validated assessments
              </div>
            </div>
          </div>

          {assessmentResults && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Assessment Results
              </h3>

              <div className="space-y-6">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium">
                      Circularity Score
                    </span>
                    <span className="text-3xl font-bold text-emerald-600">
                      {assessmentResults.circularityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${assessmentResults.circularityScore}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium">
                      Environmental Score
                    </span>
                    <span className="text-3xl font-bold text-blue-600">
                      {assessmentResults.environmentalScore}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000 delay-300"
                      style={{
                        width: `${assessmentResults.environmentalScore}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">
                      Assessment Confidence
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {assessmentResults.confidence || 92}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {assessmentResults.missingParams > 0
                      ? `AI estimated ${
                          assessmentResults.missingParams
                        } parameter${
                          assessmentResults.missingParams > 1 ? "s" : ""
                        }`
                      : "All parameters provided"}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("analysis")}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 px-6 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>View Detailed Analysis</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Assessment Tips
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Higher recycled content significantly improves circularity
                  scores
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Renewable energy sources reduce environmental impact by 15-25%
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Local supply chains minimize transport-related emissions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalysisView = () => (
    <div className="p-6 space-y-8">
      {/* Impact Comparison Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">
              Impact Analysis
            </h3>
            <p className="text-slate-600 mt-1">
              Comprehensive environmental and circularity assessment
            </p>
          </div>
          <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
            Updated 2 min ago
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Environmental Impact Reduction
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={dashboardData.environmentalImpact}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="conventional"
                  fill="#ef4444"
                  name="Conventional"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="circular"
                  fill="#10b981"
                  name="Circular"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Material Flow Visualization
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={dashboardData.flowData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="stage"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="material"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Virgin Material"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="recycled"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Circular Flow"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl mr-4">
              <Recycle className="text-emerald-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">62%</div>
              <div className="text-sm text-emerald-600">CO₂ Reduction</div>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Circular pathway reduces carbon emissions by 530 tons annually
            compared to conventional methods
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <Zap className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">43%</div>
              <div className="text-sm text-blue-600">Energy Savings</div>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Optimized processes achieve significant energy efficiency
            improvements through smart resource utilization
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-xl mr-4">
              <Trash2 className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">78%</div>
              <div className="text-sm text-purple-600">Waste Reduction</div>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Advanced recovery systems minimize waste generation through
            closed-loop material cycles
          </p>
        </div>
      </div>

      {/* AI-Generated Recommendations */}
      {assessmentResults && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl mr-4">
              <Activity className="text-emerald-600" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                AI-Generated Recommendations
              </h3>
              <p className="text-slate-600">
                Personalized optimization strategies based on your assessment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assessmentResults.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200"
              >
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-xl mr-4 mt-1">
                    <CheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Priority Recommendation {index + 1}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {rec}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-slate-500">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span>Impact: High • Effort: Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Implementation Roadmap
                </h4>
                <p className="text-sm text-slate-600">
                  Get a detailed action plan for your recommendations
                </p>
              </div>
              <button
                onClick={() => setActiveTab("reports")}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Generate Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benchmarking Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6">
          Industry Benchmarking
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-slate-900">
              Performance vs Industry Standards
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">
                    Circularity Score
                  </span>
                  <span className="text-slate-900 font-semibold">
                    78% (Above Average)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full relative"
                    style={{ width: "78%" }}
                  >
                    <div
                      className="absolute right-0 top-0 h-3 w-1 bg-slate-400 rounded-full"
                      style={{ right: "35%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Industry average: 57%
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">
                    Carbon Efficiency
                  </span>
                  <span className="text-slate-900 font-semibold">
                    85% (Excellent)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full relative"
                    style={{ width: "85%" }}
                  >
                    <div
                      className="absolute right-0 top-0 h-3 w-1 bg-slate-400 rounded-full"
                      style={{ right: "30%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Industry average: 64%
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">
                    Resource Efficiency
                  </span>
                  <span className="text-slate-900 font-semibold">
                    72% (Good)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full relative"
                    style={{ width: "72%" }}
                  >
                    <div
                      className="absolute right-0 top-0 h-3 w-1 bg-slate-400 rounded-full"
                      style={{ right: "39%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Industry average: 61%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              Key Insights
            </h4>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Your circularity performance exceeds industry benchmarks by
                  37%
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Carbon efficiency ranks in the top 15% of assessed facilities
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Additional 13% resource efficiency improvement potential
                  identified
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  Implementing top 3 recommendations could achieve 91% overall
                  score
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="p-6 space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">
              Report Generation
            </h3>
            <p className="text-slate-600 mt-1">
              Export comprehensive sustainability assessments and insights
            </p>
          </div>
          <button
            onClick={exportReport}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Export All Reports</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl mr-4 group-hover:bg-emerald-200 transition-colors">
                <Activity className="text-emerald-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  LCA Assessment Report
                </h4>
                <p className="text-xs text-slate-500">ISO 14040/44 Compliant</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-6 leading-relaxed">
              Comprehensive life cycle assessment with circularity indicators,
              environmental impact analysis, and optimization pathways
            </p>
            <div className="space-y-2 mb-6 text-xs text-slate-600">
              <div className="flex items-center">
                <CheckCircle className="text-emerald-500 mr-2" size={14} />
                <span>Executive summary & methodology</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-emerald-500 mr-2" size={14} />
                <span>Detailed impact calculations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-emerald-500 mr-2" size={14} />
                <span>Benchmarking & recommendations</span>
              </div>
            </div>
            <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Environmental Impact
                </h4>
                <p className="text-xs text-slate-500">Detailed Analysis</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-6 leading-relaxed">
              In-depth environmental footprint analysis comparing circular vs
              conventional pathways with quantified benefits
            </p>
            <div className="space-y-2 mb-6 text-xs text-slate-600">
              <div className="flex items-center">
                <CheckCircle className="text-blue-500 mr-2" size={14} />
                <span>Carbon footprint breakdown</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-blue-500 mr-2" size={14} />
                <span>Water & energy consumption</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-blue-500 mr-2" size={14} />
                <span>Waste reduction metrics</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                <Target className="text-purple-600" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Action Plan
                </h4>
                <p className="text-xs text-slate-500">Implementation Guide</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-6 leading-relaxed">
              AI-powered strategic recommendations with implementation roadmap
              and expected ROI calculations
            </p>
            <div className="space-y-2 mb-6 text-xs text-slate-600">
              <div className="flex items-center">
                <CheckCircle className="text-purple-500 mr-2" size={14} />
                <span>Prioritized action items</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-purple-500 mr-2" size={14} />
                <span>Timeline & resource requirements</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-purple-500 mr-2" size={14} />
                <span>Expected impact & savings</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Recent Reports
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-2 rounded-lg mr-4">
                <FileText className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  Steel Production LCA - Q4 2024
                </p>
                <p className="text-sm text-slate-500">
                  Generated on Dec 15, 2024
                </p>
              </div>
            </div>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Download size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <BarChart3 className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  Environmental Impact Analysis
                </p>
                <p className="text-sm text-slate-500">
                  Generated on Dec 12, 2024
                </p>
              </div>
            </div>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Download size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <Target className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  Optimization Recommendations
                </p>
                <p className="text-sm text-slate-500">
                  Generated on Dec 10, 2024
                </p>
              </div>
            </div>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="p-6 space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-semibold text-slate-900 mb-8">
          Platform Configuration
        </h3>

        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              AI Assessment Engine
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Model Precision
                </label>
                <select className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                  <option>Maximum Precision (Recommended)</option>
                  <option>Balanced Performance</option>
                  <option>Fast Processing</option>
                </select>
                <p className="text-xs text-slate-500">
                  Higher precision provides more accurate results but requires
                  more processing time
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Update Frequency
                </label>
                <select className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                  <option>Real-time Updates</option>
                  <option>Hourly Refresh</option>
                  <option>Daily Refresh</option>
                </select>
                <p className="text-xs text-slate-500">
                  How often the system updates calculations and recommendations
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Data & Privacy
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">
                    Data Retention Period
                  </p>
                  <p className="text-sm text-slate-500">
                    How long assessment data is stored
                  </p>
                </div>
                <select className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
                  <option>12 months</option>
                  <option>24 months</option>
                  <option>Indefinite</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">
                    Anonymous Analytics
                  </p>
                  <p className="text-sm text-slate-500">
                    Help improve AI models with anonymized data
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Notifications & Alerts
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">
                    Assessment Completion
                  </p>
                  <p className="text-sm text-slate-500">
                    Notify when AI assessments are complete
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">
                    Weekly Performance Summary
                  </p>
                  <p className="text-sm text-slate-500">
                    Receive weekly circularity performance reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <div className="flex space-x-4">
              <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                Save Changes
              </button>
              <button className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView />;
      case "dashboard":
        return <DashboardView />;
      case "assessment":
        return <AssessmentView />;
      case "analysis":
        return <AnalysisView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeView />; // Fallback to HomeView
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CircularMetalsPlatform;
