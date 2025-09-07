import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Health check
  checkHealth: () => api.get("/api/health"),

  // Run LCA assessment
  runAssessment: (processData) => api.post("/api/assessment", { processData }),

  // Get environmental impact data
  getEnvironmentalImpact: () => api.get("/api/environmental-impact"),

  // Get circularity indicators
  getCircularityIndicators: () => api.get("/api/circularity-indicators"),

  // Get flow data
  getFlowData: () => api.get("/api/flow-data"),

  // Get pie chart data
  getPieData: () => api.get("/api/pie-data"),

  // Export report
  exportReport: async () => {
    try {
      const response = await api.post(
        "/api/reports/export",
        {},
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from headers or use default
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `circularmetals_report_${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/:/g, "")}.csv`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  },
};

export default apiService;
