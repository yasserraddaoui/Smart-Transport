from datetime import datetime, timezone
import random
from typing import Dict, Tuple, List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="GPS Service Tunisia", version="1.0.0")

CITY_COORDS: Dict[str, Tuple[float, float]] = {
    "Tunis": (36.8065, 10.1815),
    "Sfax": (34.7406, 10.7603),
    "Sousse": (35.8256, 10.6084),
    "Bizerte": (37.2744, 9.8739),
    "Nabeul": (36.4510, 10.7350),
    "Monastir": (35.7770, 10.8260),
    "Kairouan": (35.6781, 10.0963),
    "Gabes": (33.8815, 10.0982),
    "Gafsa": (34.4250, 8.7842),
}

BUS_ROUTES: Dict[int, Tuple[str, str]] = {
    1: ("Tunis", "La Marsa"),
    2: ("Tunis", "Ariana"),
    3: ("Sfax", "Mahdia"),
    4: ("Sousse", "Monastir"),
    5: ("Bizerte", "Nabeul"),
}

KNOWN_BUS_IDS = list(BUS_ROUTES.keys())

stats = {"totalLocations": 0, "tracked": set()}
last_locations: Dict[int, "GpsLocation"] = {}


class GpsLocation(BaseModel):
    busId: int
    city: str
    latitude: float
    longitude: float
    speedKph: float
    heading: float
    recordedAt: str


class GpsMetrics(BaseModel):
    trackedBuses: int
    totalLocations: int


def jitter(value: float) -> float:
    return value + random.uniform(-0.008, 0.008)


def simulate_location(bus_id: int) -> GpsLocation:
    route = BUS_ROUTES.get(bus_id)
    if not route:
        raise HTTPException(status_code=404, detail="Bus not found")

    departure_city = route[0]
    if departure_city not in CITY_COORDS:
        raise HTTPException(status_code=500, detail="City coordinates missing")

    base_lat, base_lon = CITY_COORDS[departure_city]
    latitude = jitter(base_lat)
    longitude = jitter(base_lon)
    speed = round(random.uniform(18, 48), 1)
    heading = round(random.uniform(0, 359), 1)
    timestamp = datetime.now(timezone.utc).isoformat()

    location = GpsLocation(
        busId=bus_id,
        city=departure_city,
        latitude=latitude,
        longitude=longitude,
        speedKph=speed,
        heading=heading,
        recordedAt=timestamp,
    )
    last_locations[bus_id] = location
    stats["totalLocations"] += 1
    stats["tracked"].add(bus_id)
    return location


@app.get("/gps/bus/{bus_id}", response_model=GpsLocation)
def get_bus_location(bus_id: int):
    return simulate_location(bus_id)


@app.get("/gps/locations", response_model=List[GpsLocation])
def list_locations():
    locations = []
    for bus_id in KNOWN_BUS_IDS:
        if bus_id in last_locations:
            locations.append(last_locations[bus_id])
        else:
            locations.append(simulate_location(bus_id))
    return locations


@app.get("/gps/metrics", response_model=GpsMetrics)
def metrics():
    return GpsMetrics(trackedBuses=len(stats["tracked"]), totalLocations=stats["totalLocations"])


@app.get("/gps/hello")
def hello():
    return "GPS service Tunisia is running"
