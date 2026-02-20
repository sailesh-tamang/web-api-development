"use client";

import { useEffect, useRef, useState } from "react";

export default function WalkingTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [calories, setCalories] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<{ steps: number; distance: number; calories: number }[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toDateString()
  );

  // Step detection parameters
  const lastAccelRef = useRef<number>(0);
  const stepTimeRef = useRef<number>(0);
  const isStepRef = useRef<boolean>(false);
  
  // Average step length in meters (adjustable based on user height)
  const STEP_LENGTH_M = 0.762; // ~2.5 feet average
  // Calories burned per step (varies by weight, using average)
  const CALORIES_PER_STEP = 0.04;
  // Threshold for detecting a step (adjust for sensitivity)
  const STEP_THRESHOLD = 1.3;
  // Minimum time between steps (ms) to avoid double counting
  const MIN_STEP_INTERVAL = 200;

  useEffect(() => {
    const storedDate = localStorage.getItem("walkDate");
    const storedSteps = localStorage.getItem("walkSteps");
    const storedDistance = localStorage.getItem("walkDistanceKm");
    const storedCalories = localStorage.getItem("walkCalories");
    const storedRecords = localStorage.getItem("walkRecords");

    if (storedDate) {
      setCurrentDate(storedDate);
    }
    if (storedSteps) {
      setSteps(Number(storedSteps));
    }
    if (storedDistance) {
      setDistanceKm(Number(storedDistance));
    }
    if (storedCalories) {
      setCalories(Number(storedCalories));
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
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("walkSteps", String(steps));
  }, [steps]);

  useEffect(() => {
    localStorage.setItem("walkDistanceKm", String(distanceKm));
  }, [distanceKm]);

  useEffect(() => {
    localStorage.setItem("walkCalories", String(calories));
  }, [calories]);

  useEffect(() => {
    localStorage.setItem("walkRecords", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("walkDate", currentDate);
  }, [currentDate]);

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    // Calculate total acceleration magnitude
    const totalAccel = Math.sqrt(
      acc.x * acc.x + acc.y * acc.y + acc.z * acc.z
    );

    const now = Date.now();
    const timeSinceLastStep = now - stepTimeRef.current;

    // Detect step: look for significant change in acceleration
    // and ensure minimum time between steps
    if (
      Math.abs(totalAccel - lastAccelRef.current) > STEP_THRESHOLD &&
      timeSinceLastStep > MIN_STEP_INTERVAL &&
      !isStepRef.current
    ) {
      isStepRef.current = true;
      stepTimeRef.current = now;

      // Increment step count
      setSteps((prevSteps) => {
        const newSteps = prevSteps + 1;
        
        // Calculate distance (steps × step length)
        const newDistanceM = newSteps * STEP_LENGTH_M;
        const newDistanceKm = newDistanceM / 1000;
        setDistanceKm(newDistanceKm);

        // Calculate calories (steps × calories per step)
        const newCalories = newSteps * CALORIES_PER_STEP;
        setCalories(newCalories);

        return newSteps;
      });

      // Reset step flag after a short delay
      setTimeout(() => {
        isStepRef.current = false;
      }, 100);
    }

    lastAccelRef.current = totalAccel;
  };

  const startTracking = () => {
    if (typeof DeviceMotionEvent === "undefined") {
      setError("Motion sensor is not supported on this device.");
      return;
    }

    // Request permission for iOS 13+
    if (
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("devicemotion", handleMotion);
            setIsTracking(true);
            setError(null);
          } else {
            setError("Permission to access motion sensor was denied.");
          }
        })
        .catch((err: Error) => {
          setError("Error requesting motion permission: " + err.message);
        });
    } else {
      // Non-iOS or older iOS
      window.addEventListener("devicemotion", handleMotion);
      setIsTracking(true);
      setError(null);
    }
  };

  const stopTracking = () => {
    window.removeEventListener("devicemotion", handleMotion);
    setIsTracking(false);
  };

  const resetTracking = () => {
    setSteps(0);
    setDistanceKm(0);
    setCalories(0);
  };

  const resetDaily = (dateString: string) => {
    setSteps(0);
    setDistanceKm(0);
    setCalories(0);
    setRecords([]);
    setCurrentDate(dateString);
  };

  const saveRecord = () => {
    if (steps > 0) {
      setRecords((prev) => [
        { 
          steps, 
          distance: Number(distanceKm.toFixed(2)), 
          calories: Number(calories.toFixed(1)) 
        }, 
        ...prev
      ]);
    }
  };

  const deleteRecord = (index: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-black px-6 pb-16 flex justify-center">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-lg shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Walking Tracker</h2>
            <p className="text-sm text-slate-300">
              Move your device while walking to count steps. Resets every 24 hours.
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs uppercase text-slate-400">Steps</p>
            <p className="mt-2 text-2xl font-semibold text-lime-300">
              {steps.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {isTracking ? "Counting..." : "Paused"}
            </p>
          </div>
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
            <p className="text-xs uppercase text-slate-400">Calories</p>
            <p className="mt-2 text-2xl font-semibold text-lime-300">
              {calories.toFixed(1)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              kcal burned
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold">
              {isTracking ? "🟢 Tracking" : "⏸️ Paused"}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {records.length} saved
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
            <p className="mt-1 text-xs text-slate-400">
              Note: Motion sensors require HTTPS and may need permission on iOS devices.
            </p>
          </div>
        )}

        {records.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Saved Records</p>
            <ul className="mt-2 space-y-2">
              {records.map((r, idx) => (
                <li 
                  key={`${r.steps}-${idx}`} 
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-lime-300">👣 {r.steps.toLocaleString()} steps</span>
                    <span className="text-slate-300">📏 {r.distance} km</span>
                    <span className="text-slate-300">🔥 {r.calories} kcal</span>
                  </div>
                  <button
                    onClick={() => deleteRecord(idx)}
                    className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20"
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
