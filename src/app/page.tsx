'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Video } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const stats = [
  { label: 'HD Video', value: 'Smooth calls' },
  { label: 'No downloads', value: 'Instant access' },
  { label: 'Together', value: 'One click join' },
];

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinMode, setJoinMode] = useState<'create' | 'join'>('create');

  const handleCreateMeeting = () => {
    if (!userName.trim()) return;
    const newRoomId = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(userName)}`);
  };

  const handleJoinMeeting = () => {
    if (!userName.trim() || !roomId.trim()) return;
    router.push(`/room/${roomId}?name=${encodeURIComponent(userName)}`);
  };

  const canContinue = userName.trim() && (joinMode === 'create' || roomId.trim());

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_25%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.65),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-[0_20px_120px_rgba(59,130,246,0.08)]">
              <Video className="h-4 w-4 text-cyan-300" />
              <span>Akanni world video calling app</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcom to Akanni world video calling app
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                A modern video calling landing experience built for fast togetherness. Start instantly, invite friends, and share the moment with one click.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#start"
                className="inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#start"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-300 sm:w-auto">
                Together now
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <dt className="text-sm text-slate-400">{item.label}</dt>
                  <dd className="mt-3 text-lg font-semibold text-white">{item.value}</dd>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_25%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live call</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Together now</h2>
                </div>
                <span className="rounded-2xl bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Active</span>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Video call session ready for you.</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-300">High quality streaming</p>
                      <p className="text-xs text-slate-500">No lag, fast connection</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                    <p className="text-sm text-slate-400">Invite friends</p>
                    <p className="mt-3 text-lg font-semibold text-white">Join together</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                    <p className="text-sm text-slate-400">Instant setup</p>
                    <p className="mt-3 text-lg font-semibold text-white">No code needed</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-sm">Room preview</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">Ready</span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Build your call room</p>
                    <p className="text-xs text-slate-500">Choose create or join below</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="start" className="mt-16 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">Ready to connect</span>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Start a meeting in seconds</h2>
              <p className="max-w-xl text-base leading-7 text-slate-400">
                Enter your name and either create a new room or join an existing one to begin the video call experience.
              </p>
            </div>

            <div className="rounded-[2rem] bg-slate-950/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-4">
                  <p className="text-sm text-slate-400">Your Name</p>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </div>
                {joinMode === 'join' && (
                  <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-4">
                    <p className="text-sm text-slate-400">Room ID</p>
                    <input
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter room ID"
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setJoinMode('create')}
                    className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                      joinMode === 'create'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'border border-white/10 text-slate-300 hover:border-cyan-300'
                    }`}
                  >
                    Create room
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinMode('join')}
                    className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                      joinMode === 'join'
                        ? 'bg-fuchsia-500 text-slate-950'
                        : 'border border-white/10 text-slate-300 hover:border-fuchsia-300'
                    }`}
                  >
                    Join room
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={joinMode === 'create' ? handleCreateMeeting : handleJoinMeeting}
                  className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {joinMode === 'create' ? 'Create meeting' : 'Join meeting'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
