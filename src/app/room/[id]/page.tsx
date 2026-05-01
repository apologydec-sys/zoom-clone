'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/video-player';
import { Controls } from '@/components/controls';
import { ChatBox } from '@/components/chat-box';
import { ParticipantsList } from '@/components/participants-list';
import { useWebRTC } from '@/lib/use-webrtc';
import { useSocket } from '@/lib/socket-context';

function RoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = params.id as string;
  const userName = searchParams.get('name') || 'Anonymous';
  
  const { socket } = useSocket();
  const {
    localStream,
    peers,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    leaveRoom,
  } = useWebRTC(roomId, userName);

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleLeave = () => {
    leaveRoom();
    router.push('/');
  };

  const participantList = [
    {
      socketId: socket?.id || 'local',
      userName: `${userName} (You)`,
      videoEnabled: isVideoEnabled,
      audioEnabled: isAudioEnabled,
      isLocal: true,
    },
    ...Array.from(peers.values()).map((peer) => ({
      socketId: peer.socketId,
      userName: peer.userName,
      videoEnabled: peer.videoEnabled,
      audioEnabled: peer.audioEnabled,
      isLocal: false,
    })),
  ];

  const participantCount = peers.size + 1;

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div>
              <h1 className="text-white font-semibold">Room: {roomId}</h1>
              <p className="text-sm text-gray-400">{participantCount} participant{participantCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {socket?.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className={`grid gap-4 h-full ${
              participantCount === 1
                ? 'grid-cols-1'
                : participantCount === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : participantCount <= 4
                ? 'grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {localStream && (
                <VideoPlayer
                  stream={localStream}
                  userName={userName}
                  isLocal={true}
                  videoEnabled={isVideoEnabled}
                  audioEnabled={isAudioEnabled}
                  className="min-h-[200px]"
                />
              )}
              
              {Array.from(peers.values()).map((peer) => (
                <VideoPlayer
                  key={peer.socketId}
                  stream={peer.stream || null}
                  userName={peer.userName}
                  isLocal={false}
                  videoEnabled={peer.videoEnabled}
                  audioEnabled={peer.audioEnabled}
                  className="min-h-[200px]"
                />
              ))}
            </div>
          </div>

          <Controls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onLeave={handleLeave}
            onToggleChat={() => setShowChat(!showChat)}
            onToggleParticipants={() => setShowParticipants(!showParticipants)}
            showChat={showChat}
            showParticipants={showParticipants}
          />
        </div>

        <ParticipantsList
          participants={participantList}
          isOpen={showParticipants}
        />

        <ChatBox
          roomId={roomId}
          userName={userName}
          isOpen={showChat}
        />
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading room...</div>
      </div>
    }>
      <RoomContent />
    </Suspense>
  );
}
