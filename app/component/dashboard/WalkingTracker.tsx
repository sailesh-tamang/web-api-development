"use client";

import { useEffect, useRef, useState } from "react";

type Position = {
  lat: number;
  lon: number;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function haversineKm(a: Position, b: Position) {
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function WalkingTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [lastPos, setLastPos] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [records, setRecords] = useState<number[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toDateString()
  );

  useEffect(() => {
    const storedDate = localStorage.getItem("walkDate");
    const storedDistance = localStorage.getItem("walkDistanceKm");
    const storedRecords = localStorage.getItem("walkRecords");

    if (storedDate) {
      setCurrentDate(storedDate);
    }
    if (storedDistance) {
      setDistanceKm(Number(storedDistance));
    }
    if (storedRecords) {
      try {
        setRecords(JSON.parse(storedRecords));
      } catch {
        setRecords([]);
      }
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stopTracking();
      } else {
        startTracking();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    startTracking();

    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== currentDate) {
        resetDaily(today);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("walkDistanceKm", String(distanceKm));
  }, [distanceKm]);

  useEffect(() => {
    localStorage.setItem("walkRecords", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("walkDate", currentDate);
  }, [currentDate]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    if (watchIdRef.current !== null) {
      return;
    }
    setError(null);
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLastPos((prev) => {
          if (prev) {
            const delta = haversineKm(prev, next);
            setDistanceKm((d) => d + delta);
          }
          return next;
        });
      },
      (err) => {
        setError(err.message);
        setIsTracking(false);
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const resetTracking = () => {
    setDistanceKm(0);
    setLastPos(null);
  };

  const resetDaily = (dateString: string) => {
    setDistanceKm(0);
    setLastPos(null);
    setRecords([]);
    setCurrentDate(dateString);
  };

  const saveRecord = () => {
    if (distanceKm > 0) {
      setRecords((prev) => [Number(distanceKm.toFixed(2)), ...prev]);
    }
  };

  const deleteRecord = (index: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-black px-6 pb-16">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-lg shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Walking Tracker</h2>
            <p className="text-sm text-slate-300">
              Auto tracking is on. Resets every 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={stopTracking}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Pause
            </button>
            <button
              onClick={startTracking}
              className="rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black"
            >
              Resume
            </button>
            <button
              onClick={saveRecord}
              className="rounded-full border border-lime-400/50 px-4 py-2 text-sm font-semibold text-lime-300"
            >
              Save
            </button>
            <button
              onClick={resetTracking}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs uppercase text-slate-400">Distance</p>
            <p className="mt-2 text-2xl font-semibold text-lime-300">
              {distanceKm.toFixed(2)} km
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {(distanceKm * 1000).toFixed(0)} m
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold">
              {isTracking ? "Tracking" : "Paused"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs uppercase text-slate-400">Last Record</p>
            <p className="mt-2 text-lg font-semibold">
              {records[0] ? `${records[0]} km` : "-"}
            </p>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {records.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Saved Records</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {records.map((r, idx) => (
                <li key={`${r}-${idx}`} className="flex items-center justify-between gap-3">
                  <span>• {r} km</span>
                  <button
                    onClick={() => deleteRecord(idx)}
                    className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
