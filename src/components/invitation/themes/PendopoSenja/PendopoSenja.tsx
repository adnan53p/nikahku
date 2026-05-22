"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Opening from "./Opening";
import Hero from "./Hero";
import Event from "./Event";
import Gallery from "./Gallery";
import RSVP from "./RSVP";
import Footer from "./Footer";
import { AutoScrollControl } from "../../AutoScrollControl";

type PendopoSenjaProps = {
  event?: any;
  guest?: any;
  guestName?: string | null;
}

function getGuestNameFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("to") || "";
}

export default function PendopoSenja({ event, guestName }: PendopoSenjaProps) {
  const displayGuestName = guestName || getGuestNameFromUrl() || "Bapak/Ibu/Saudara/i";
  const activeMusic = event?.event_music?.find?.((music: any) => music.is_active);
  const MUSIC_URL = activeMusic?.audio_url || event?.music_url || "";
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!MUSIC_URL) return;
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.22;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, [MUSIC_URL]);

  const handleOpen = () => {
    setOpened(true);
    if (MUSIC_URL && audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
        setShowMusicHint(true);
        setTimeout(() => setShowMusicHint(false), 3500);
      }).catch(() => {});
    }
    // Smooth scroll to top of content
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  return (
    <>
      {/* Opening overlay */}
      <Opening onOpen={handleOpen} guestName={displayGuestName} event={event} />

      {/* Main content — revealed after opening */}
      <AnimatePresence>
        {opened && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            style={{ background: "#faf7f2" }}
          >
            {/* Global style */}
            <style>{`
              html { scroll-behavior: smooth; }
              * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
              ::selection { background: rgba(201,169,110,0.2); color: #1a1208; }
              ::-webkit-scrollbar { width: 3px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.35); border-radius: 2px; }
            `}</style>

            <AutoScrollControl enabled={true} autoStart={true} startDelay={1000} pausePerSection={0} scrollDuration={2600}
            scrollSpeedPxPerSecond={155} />

            {/* ── CONTENT SECTIONS ── */}
            <div data-scroll-section><Hero event={event} /></div>
            <div data-scroll-section><Event event={event} /></div>
            <div data-scroll-section><Gallery event={event} /></div>
            <div data-scroll-section><RSVP event={event} guestName={displayGuestName} /></div>
            <div data-scroll-section><Footer event={event} guestName={displayGuestName} /></div>

            {/* ── MUSIC TOGGLE ── */}
            {MUSIC_URL && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
              >
                {/* Music hint toast */}
                <AnimatePresence>
                  {showMusicHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.4 }}
                      className="rounded-xl px-4 py-2 text-xs"
                      style={{
                        background: "rgba(10,7,4,0.85)",
                        border: "1px solid rgba(201,169,110,0.2)",
                        color: "#C9A96E",
                        fontFamily: "Georgia, serif",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      ♪ Musik sedang diputar
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={toggleMusic}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(10,7,4,0.92) 0%, rgba(26,18,8,0.92) 100%)",
                    border: "1px solid rgba(201,169,110,0.25)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                  title={musicPlaying ? "Pause musik" : "Play musik"}
                >
                  <motion.div animate={musicPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }} transition={{ duration: 1.5, repeat: Infinity }}>
                    {musicPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E" style={{ marginLeft: "2px" }}>
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </motion.div>
                </motion.button>

                {/* Equalizer dots when playing */}
                {musicPlaying && (
                  <div className="flex gap-0.5 justify-center">
                    {[0, 1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="w-0.5 rounded-full bg-[#C9A96E]"
                        animate={{ height: ["4px", `${8 + i * 3}px`, "4px"] }}
                        transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── BACK TO TOP ── */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
              style={{
                background: "rgba(201,169,110,0.08)",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </motion.button>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
