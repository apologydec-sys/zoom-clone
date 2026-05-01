'use client';

import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare, Users } from 'lucide-react';

interface ControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onLeave: () => void;
  onToggleChat?: () => void;
  onToggleParticipants?: () => void;
  showChat?: boolean;
  showParticipants?: boolean;
}

export function Controls({
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onLeave,
  onToggleChat,
  onToggleParticipants,
  showChat = false,
  showParticipants = false,
}: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/90 backdrop-blur-sm">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full transition-all duration-200 ${
          isAudioEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-all duration-200 ${
          isVideoEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
      </button>

      <button
        onClick={onLeave}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
      >
        <PhoneOff className="w-6 h-6" />
      </button>

      <div className="w-px h-8 bg-gray-600 mx-2" />

      <button
        onClick={onToggleParticipants}
        className={`p-3 rounded-full transition-all duration-200 ${
          showParticipants
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        <Users className="w-6 h-6" />
      </button>

      <button
        onClick={onToggleChat}
        className={`p-3 rounded-full transition-all duration-200 ${
          showChat
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
