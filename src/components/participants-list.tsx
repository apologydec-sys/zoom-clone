'use client';

import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface Participant {
  socketId: string;
  userName: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  isOpen: boolean;
}

export function ParticipantsList({ participants, isOpen }: ParticipantsListProps) {
  if (!isOpen) return null;

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((participant) => (
          <div
            key={participant.socketId}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {participant.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {participant.userName} {participant.isLocal && '(You)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {participant.audioEnabled ? (
                <Mic className="w-4 h-4 text-gray-400" />
              ) : (
                <MicOff className="w-4 h-4 text-red-400" />
              )}
              {participant.videoEnabled ? (
                <Video className="w-4 h-4 text-gray-400" />
              ) : (
                <VideoOff className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
