'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from './socket-context';

interface PeerConnection {
  socketId: string;
  userName: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  peers: Map<string, PeerConnection>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  leaveRoom: () => void;
}

export function useWebRTC(roomId: string, userName: string): UseWebRTCReturn {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());

  const createPeerConnection = useCallback((socketId: string, userName: string, stream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: socketId,
          from: socket.id,
        });
      }
    };

    pc.ontrack = (event) => {
      const peerConnection = peersRef.current.get(socketId);
      if (peerConnection) {
        peerConnection.stream = event.streams[0];
        setPeers(new Map(peersRef.current));
      }
    };

    return pc;
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        socket.emit('join-room', { roomId, userName });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initLocalStream();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => {
        peer.connection.close();
      });
    };
  }, [socket, roomId, userName]);

  useEffect(() => {
    if (!socket || !localStream) return;

    socket.on('users-in-room', async (users: Array<{ socketId: string; userName: string }>) => {
      for (const user of users) {
        const pc = createPeerConnection(user.socketId, user.userName, localStream);
        
        const peerConnection: PeerConnection = {
          socketId: user.socketId,
          userName: user.userName,
          connection: pc,
          videoEnabled: true,
          audioEnabled: true,
        };
        
        peersRef.current.set(user.socketId, peerConnection);
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socket.emit('offer', {
          offer,
          to: user.socketId,
          from: socket.id,
        });
      }
      setPeers(new Map(peersRef.current));
    });

    socket.on('user-connected', async ({ socketId, userName }: { socketId: string; userName: string }) => {
      const pc = createPeerConnection(socketId, userName, localStream);
      
      const peerConnection: PeerConnection = {
        socketId,
        userName,
        connection: pc,
        videoEnabled: true,
        audioEnabled: true,
      };
      
      peersRef.current.set(socketId, peerConnection);
      setPeers(new Map(peersRef.current));
    });

    socket.on('offer', async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      const user = Array.from(peersRef.current.values()).find(p => p.socketId === from);
      let pc = user?.connection;
      
      if (!pc) {
        pc = createPeerConnection(from, 'Unknown', localStream);
        const peerConnection: PeerConnection = {
          socketId: from,
          userName: 'Unknown',
          connection: pc,
          videoEnabled: true,
          audioEnabled: true,
        };
        peersRef.current.set(from, peerConnection);
      }

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit('answer', {
        answer,
        to: from,
        from: socket.id,
      });
      
      setPeers(new Map(peersRef.current));
    });

    socket.on('answer', async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      const peer = peersRef.current.get(from);
      if (peer) {
        await peer.connection.setRemoteDescription(answer);
      }
    });

    socket.on('ice-candidate', async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      const peer = peersRef.current.get(from);
      if (peer) {
        await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('user-disconnected', (socketId: string) => {
      const peer = peersRef.current.get(socketId);
      if (peer) {
        peer.connection.close();
        peersRef.current.delete(socketId);
        setPeers(new Map(peersRef.current));
      }
    });

    socket.on('user-toggle-video', ({ socketId, enabled }: { socketId: string; enabled: boolean }) => {
      const peer = peersRef.current.get(socketId);
      if (peer) {
        peer.videoEnabled = enabled;
        setPeers(new Map(peersRef.current));
      }
    });

    socket.on('user-toggle-audio', ({ socketId, enabled }: { socketId: string; enabled: boolean }) => {
      const peer = peersRef.current.get(socketId);
      if (peer) {
        peer.audioEnabled = enabled;
        setPeers(new Map(peersRef.current));
      }
    });

    return () => {
      socket.off('users-in-room');
      socket.off('user-connected');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-disconnected');
      socket.off('user-toggle-video');
      socket.off('user-toggle-audio');
    };
  }, [socket, localStream, createPeerConnection]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
        socket?.emit('toggle-video', {
          roomId,
          socketId: socket.id,
          enabled: !isVideoEnabled,
        });
      }
    }
  }, [localStream, isVideoEnabled, socket, roomId]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
        socket?.emit('toggle-audio', {
          roomId,
          socketId: socket.id,
          enabled: !isAudioEnabled,
        });
      }
    }
  }, [localStream, isAudioEnabled, socket, roomId]);

  const leaveRoom = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    peersRef.current.forEach((peer) => {
      peer.connection.close();
    });
    peersRef.current.clear();
    setPeers(new Map());
    socket?.disconnect();
  }, [localStream, socket]);

  return {
    localStream,
    peers,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    leaveRoom,
  };
}
