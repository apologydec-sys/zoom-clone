# Zoom Clone - Video Calling App

A modern, real-time video calling application built with Next.js 14+, WebRTC, and Socket.IO. Features HD video/audio, group calls, live chat, and a beautiful dark UI inspired by Zoom and Google Meet.

## ✨ Features

- 🎥 **HD Video & Audio** - High-quality peer-to-peer video streaming via WebRTC
- 👥 **Group Calls** - Support for multiple participants in a single room
- 💬 **Live Chat** - Real-time messaging during calls
- 🔇 **Mute/Unmute** - Audio controls with visual indicators
- 📹 **Camera Toggle** - Enable/disable video with avatar fallback
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌙 **Dark Mode** - Modern dark UI with smooth animations
- 🔒 **Privacy First** - No data stored; everything is peer-to-peer

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.IO (signaling), WebRTC (video/audio)
- **Icons**: Lucide React
- **Utilities**: UUID, clsx, tailwind-merge

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A modern browser with WebRTC support

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development servers**
   
   Run both frontend and backend:
   ```bash
   npm run dev:full
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Socket Server: http://localhost:3001

## 📖 Usage

### Creating a Meeting

1. Enter your name on the home page
2. Click "Create Meeting"
3. Share the room ID with others

### Joining a Meeting

1. Enter your name and the room ID
2. Click "Join Meeting"

### During a Call

- **Mute/Unmute**: Click the microphone button
- **Camera On/Off**: Click the video button
- **Leave**: Click the red phone button
- **Chat**: Click the message icon
- **Participants**: Click the users icon

## 🔧 Architecture

The app uses WebRTC for peer-to-peer video/audio and Socket.IO for signaling:

1. **Signaling**: Users exchange connection info via Socket.IO server
2. **WebRTC**: Direct peer-to-peer connection for video/audio
3. **STUN**: Google's public STUN servers for NAT traversal

## 📝 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── room/[id]/page.tsx    # Video call room
│   └── layout.tsx            # Root layout
├── components/
│   ├── video-player.tsx      # Video display
│   ├── controls.tsx          # Call controls
│   ├── chat-box.tsx          # Chat sidebar
│   └── participants-list.tsx # Participants sidebar
└── lib/
    ├── socket-context.tsx    # Socket.IO context
    └── use-webrtc.ts         # WebRTC hooks
server.js                     # Signaling server
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
```

### Backend (Render/Railway)
Deploy `server.js` to any Node.js hosting.

## 🛣️ Roadmap

- [ ] Screen sharing
- [ ] Recording
- [ ] Authentication
- [ ] Meeting scheduling
- [ ] Raise hand feature
- [ ] Virtual backgrounds

## 📄 License

MIT License

"# zoom-clone" 
