from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from io import StringIO, BytesIO
import csv
import random
import datetime
import os

# ---------------------------
# Create FastAPI app
# ---------------------------
app = FastAPI(title="Circular Metals API")

# Allow CORS (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with ["http://localhost:3000"] in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# API Endpoints
# ---------------------------
@app.get("/api")
async def api_index():
    return {
        "message": "API root",
        "endpoints": [
            "GET /api/health",
            "POST /api/assessment",
            "GET /api/environmental-impact",
            "GET /api/circularity-indicators",
            "GET /api/flow-data",
            "GET /api/pie-data",
            "POST /api/reports/export",
        ],
    }

@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat() + "Z"}

@app.post("/api/assessment")
async def run_assessment(request: Request):
    payload = await request.json()
    process_data = payload.get("processData", {})

    expected_fields = [
        "material",
        "production",
        "rawMaterial",
        "recycledContent",
        "energyUse",
        "transport",
        "endOfLife",
    ]
    missing_fields = [f for f in expected_fields if f not in process_data]

    recycled = float(process_data.get("recycledContent", 50) or 0)
    raw_material = float(process_data.get("rawMaterial", 50) or 0)
    energy_use = process_data.get("energyUse", "") or "medium"
    transport = process_data.get("transport", "") or "road"

    base_circularity = 50 + (recycled - raw_material) * 0.3
    if energy_use.lower() in ("low", "renewable"):
        base_circularity += 10
    if transport.lower() in ("rail", "sea"):
        base_circularity += 5
    base_circularity = max(0, min(100, round(base_circularity)))

    environmental_score = 60 + int((recycled * 0.2) - (raw_material * 0.1))
    environmental_score = max(0, min(100, environmental_score))

    random.seed((process_data.get("material") or "") + (process_data.get("production") or ""))
    recommendations = [
        "Increase recycled content to reduce virgin input dependency",
        "Optimize transport routes and prefer rail/sea logistics",
        "Adopt closed-loop water systems in processing",
        "Redesign product for easier disassembly and reuse",
    ]
    random.shuffle(recommendations)

    return {
        "circularityScore": base_circularity,
        "environmentalScore": environmental_score,
        "recommendations": recommendations[:4],
        "missingParams": max(0, len(missing_fields)),
        "debug": {"missingFields": missing_fields},
    }

@app.get("/api/environmental-impact")
async def get_environmental_impact():
    return [
        {"name": "CO2 Emissions", "conventional": 850, "circular": 320},
        {"name": "Energy Use", "conventional": 1200, "circular": 680},
        {"name": "Water Use", "conventional": 400, "circular": 180},
        {"name": "Waste Gen.", "conventional": 200, "circular": 45},
    ]

@app.get("/api/circularity-indicators")
async def get_circularity_indicators():
    return [
        {"name": "Recycled Content", "value": 65, "target": 80},
        {"name": "Resource Efficiency", "value": 72, "target": 85},
        {"name": "Product Life Ext.", "value": 58, "target": 75},
        {"name": "Reuse Potential", "value": 43, "target": 60},
    ]

@app.get("/api/flow-data")
async def get_flow_data():
    return [
        {"stage": "Extraction", "material": 100, "recycled": 0},
        {"stage": "Processing", "material": 95, "recycled": 60},
        {"stage": "Manufacturing", "material": 90, "recycled": 85},
        {"stage": "Use", "material": 88, "recycled": 83},
        {"stage": "End-of-Life", "material": 25, "recycled": 75},
    ]

@app.get("/api/pie-data")
async def get_pie_data():
    return [
        {"name": "Recycled", "value": 45, "color": "#10b981"},
        {"name": "Virgin", "value": 35, "color": "#6366f1"},
        {"name": "Recovered", "value": 20, "color": "#f59e0b"},
    ]

@app.post("/api/reports/export")
async def export_report_csv():
    rows = [
        ["Metric", "Conventional", "Circular"],
        ["CO2 Emissions", 850, 320],
        ["Energy Use", 1200, 680],
        ["Water Use", 400, 180],
        ["Waste Gen.", 200, 45],
    ]

    string_buffer = StringIO()
    writer = csv.writer(string_buffer)
    writer.writerows(rows)
    string_buffer.seek(0)

    byte_buffer = BytesIO(string_buffer.getvalue().encode("utf-8"))
    filename = f"circularmetals_report_{datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.csv"
    return FileResponse(
        path_or_file=byte_buffer,
        media_type="text/csv",
        filename=filename,
    )

# ---------------------------
# Frontend Serving (React build)
# ---------------------------
frontend_path = os.path.join(os.path.dirname(__file__), "my-app/build")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

# ---------------------------
# Custom 404 handler
# ---------------------------
@app.exception_handler(404)
async def not_found(request: Request, exc: HTTPException):
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "Not found"}, status_code=404)
    # Serve React index.html for unknown routes
    index_file = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(f.read())
    return JSONResponse({"error": "Not found"}, status_code=404)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
