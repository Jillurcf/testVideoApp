import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
} from 'react-native-agora';
import io from 'socket.io-client'; // Import socket.io-client

import getPermission from './src/components/Permission';

const token = '007eJxTYJhhXc6nyHqQcb3tu3t7j87pWCMsoNFmWXZ0a3Xw/PPTfvxUYEg1MTc2Tk6ySDYwSTRJtkyyME+xsEyxNElNNk5NNkk001W+kdYQyMjQVXaFkZEBAkF8YYaS1OKSsMyU1HznxJyczLx0x4ICBgYAes8mKA==';
const appId = 'e4733cb8c04a4c9b87d89d94ec3ec4a6';
const channelName = 'testVideoCallingApp';
const uid = 0;
const socket = io('http://your-server-ip:5000'); // Initialize socket connection

const App = () => {
  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [isHost, setIsHost] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const eventHandler = useRef<IRtcEngineEventHandler>();
  const [callingUserId, setCallingUserId] = useState('');
  const currentUserId = 'user1';  // Static userId for this instance

  useEffect(() => {
    if (Platform.OS === 'android') {
      getPermission();
    }

    const initialize = async () => {
      try {
        // Initialize Agora engine
        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
        agoraEngine.initialize({ appId });

        // Register event handlers
        eventHandler.current = {
          onJoinChannelSuccess: () => {
            console.log('Successfully joined channel:', channelName);
            setCallStarted(true);
          },
          onUserJoined: (_connection: RtcConnection, uid: number) => {
            console.log('Remote user', uid, 'has joined');
            setPeerIds((prevPeerIds) => [...prevPeerIds, uid]);
          },
          onUserOffline: (_connection: RtcConnection, uid: number) => {
            console.log('Remote user', uid, 'has left the channel');
            setPeerIds((prevPeerIds) => prevPeerIds.filter((id) => id !== uid));
          },
        };

        agoraEngine.registerEventHandler(eventHandler.current);
        setInitializationComplete(true);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();

    // Register the user with the server
    socket.emit('register', currentUserId);

    // Listen for incoming calls
    socket.on('receive-call', ({ from }) => {
      console.log('Incoming call from', from);
      setCallingUserId(from);
      // Here, show an alert or modal to the user to accept/reject the call
    });

    // Listen for call acceptance
    socket.on('call-accepted', () => {
      startCall();  // Start the Agora call
    });

    return () => {
      socket.disconnect();  // Clean up when the component unmounts
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.unregisterEventHandler(eventHandler.current);
        agoraEngineRef.current.release();
        setPeerIds([]);
        setCallStarted(false);
        setInitializationComplete(false);
      }
    };
  }, []);

  const startCall = () => {
    if (agoraEngineRef.current && initializationComplete) {
      const agoraEngine = agoraEngineRef.current;

      if (isHost) {
        agoraEngine.enableVideo();
        agoraEngine.startPreview();
        agoraEngine.joinChannel(token, channelName, uid, {
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          publishCameraTrack: true,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      } else {
        agoraEngine.joinChannel(token, channelName, uid, {
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          clientRoleType: ClientRoleType.ClientRoleAudience,
          publishMicrophoneTrack: false,
          publishCameraTrack: false,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      }
    }
  };

  const endCall = () => {
    if (agoraEngineRef.current && callStarted) {
      agoraEngineRef.current.leaveChannel();
      setCallStarted(false);
      setPeerIds([]);
    }
  };

  const callUser = (userIdToCall) => {
    socket.emit('call-user', { userToCall: userIdToCall, from: currentUserId });
  };

  const answerCall = () => {
    socket.emit('answer-call', { to: callingUserId, from: currentUserId });
    startCall();
  };

  return (
    <View style={styles.container}>
      {callStarted && (
        <View style={styles.videoContainer}>
          <RtcSurfaceView
            style={styles.localVideo}
            canvas={{ uid: 0 }}
            zOrderMediaOverlay={true}
          />
          {peerIds.map((peerId) => (
            <RtcSurfaceView
              key={peerId}
              style={styles.remoteVideo}
              canvas={{ uid: peerId }}
            />
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => callUser('user2')} style={styles.button}>
        <Text style={styles.buttonText}>Call User 2</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={answerCall} style={styles.button}>
        <Text style={styles.buttonText}>Answer Call</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={endCall} style={styles.button}>
        <Text style={styles.buttonText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
