'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Plus, ArrowRight, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
           <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Kay_X video call </h1>
          <p className="text-gray-400">BLESSING AKANNI</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setJoinMode('create')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                joinMode === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create
            </button>
            <button
              onClick={() => setJoinMode('join')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                joinMode === 'join'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Join
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter UR ROOM NAME"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {joinMode === 'join' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room ND
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            <button
              onClick={joinMode === 'create' ? handleCreateMeeting : handleJoinMeeting}
              disabled={!userName.trim() || (joinMode === 'join' && !roomId.trim())}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {joinMode === 'create' ? (
                <>
                  <Plus className="w-5 h-5" />
                  Create Meeting
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Join Meeting
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <Video className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">KAY HD VIDEO</p>
          </div>
          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Group Calls</p>
          </div>
          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <svg className="w-6 h-6 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-400">CHAT MODE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
