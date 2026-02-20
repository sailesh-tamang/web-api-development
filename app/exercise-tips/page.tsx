'use client';

import { useState } from "react";
import TopBar from "../component/dashboard/TopBar";

export default function ExerciseTipsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const exerciseImage = "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=900";

  // YouTube video IDs extracted from your links
  const exerciseVideos = {
    generalHealth: {
      title: "General Health",
      subtitle: "2 days/week, 150 mins moderate activity",
      videos: [
        {
          id: "8ef7FhmMcLU",
          title: "General Health Exercises",
        },
        {
          id: "pDfkvsgOTNg",
          title: "General Health Shorts",
        },
      ],
    },
    weightLoss: {
      title: "Weight Loss",
      subtitle: "3 days/week, mix of HIIT & steady state",
      videos: [
        {
          id: "Ammb_7sv_KA",
          title: "Weight Loss Exercises",
        },
        {
          id: "dPIfbnfFITc",
          title: "Weight Loss Shorts",
        },
      ],
    },
    muscleGain: {
      title: "Muscle Gain",
      subtitle: "4-5 days/week, light activity (walking)",
      videos: [
        {
          id: "UIPvIYsjfpo",
          title: "Muscle Gain Exercises",
        },
        {
          id: "QSsTYOU9gyU",
          title: "Muscle Gain Shorts",
        },
      ],
    },
  };

  const handleVideoClick = (videoId: string, title: string, group?: string) => {
    setSelectedVideo(videoId);
    setSelectedTitle(title);
    setSelectedGroup(group ?? null);
  };

  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
              <div className="mx-auto w-fit rounded-full bg-lime-400 px-6 py-2 text-center text-sm font-semibold text-black">
                Exercise Tips
              </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Fitness Goal
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Strength
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Training
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Cardio
              </span>
            </div>

            <p className="mt-5 text-base font-semibold italic text-slate-200">
              According to this, you can plan your workout by knowing your goal
              and what else you can do.
            </p>

            <div className="mt-8 grid gap-4">
              <button 
                onClick={() =>
                  handleVideoClick(
                    exerciseVideos.generalHealth.videos[0].id,
                    exerciseVideos.generalHealth.videos[0].title,
                    "generalHealth"
                  )
                }
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  {exerciseVideos.generalHealth.title}
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {exerciseVideos.generalHealth.subtitle}
                </p>
              </button>
              {selectedGroup === "generalHealth" && selectedVideo && (
                <div className="rounded-xl border border-lime-400/30 bg-black/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-lime-400">{selectedTitle}</h3>
                    <button
                      onClick={() => {
                        setSelectedVideo(null);
                        setSelectedGroup(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}`}
                      title={selectedTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      More General Health Videos
                    </p>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                      {exerciseVideos.generalHealth.videos.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => handleVideoClick(video.id, video.title, "generalHealth")}
                          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                            selectedVideo === video.id
                              ? "border-lime-400/60 text-lime-300"
                              : "border-white/15 text-slate-300 hover:border-lime-400/40 hover:text-lime-200"
                          }`}
                        >
                          {video.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() =>
                  handleVideoClick(
                    exerciseVideos.weightLoss.videos[0].id,
                    exerciseVideos.weightLoss.videos[0].title,
                    "weightLoss"
                  )
                }
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Weight Loss
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {exerciseVideos.weightLoss.subtitle}
                </p>
              </button>
              {selectedGroup === "weightLoss" && selectedVideo && (
                <div className="rounded-xl border border-lime-400/30 bg-black/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-lime-400">{selectedTitle}</h3>
                    <button
                      onClick={() => {
                        setSelectedVideo(null);
                        setSelectedGroup(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}`}
                      title={selectedTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      More Weight Loss Videos
                    </p>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                      {exerciseVideos.weightLoss.videos.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => handleVideoClick(video.id, video.title, "weightLoss")}
                          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                            selectedVideo === video.id
                              ? "border-lime-400/60 text-lime-300"
                              : "border-white/15 text-slate-300 hover:border-lime-400/40 hover:text-lime-200"
                          }`}
                        >
                          {video.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() =>
                  handleVideoClick(
                    exerciseVideos.muscleGain.videos[0].id,
                    exerciseVideos.muscleGain.videos[0].title,
                    "muscleGain"
                  )
                }
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Muscle Gain
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {exerciseVideos.muscleGain.subtitle}
                </p>
              </button>
              {selectedGroup === "muscleGain" && selectedVideo && (
                <div className="rounded-xl border border-lime-400/30 bg-black/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-lime-400">{selectedTitle}</h3>
                    <button
                      onClick={() => {
                        setSelectedVideo(null);
                        setSelectedGroup(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}`}
                      title={selectedTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      More Muscle Gain Videos
                    </p>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                      {exerciseVideos.muscleGain.videos.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => handleVideoClick(video.id, video.title, "muscleGain")}
                          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                            selectedVideo === video.id
                              ? "border-lime-400/60 text-lime-300"
                              : "border-white/15 text-slate-300 hover:border-lime-400/40 hover:text-lime-200"
                          }`}
                        >
                          {video.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-black/40">
                <img
                  src={exerciseImage}
                  alt="Exercise motivation"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
