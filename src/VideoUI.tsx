import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
    useCallStateHooks,
    CallParticipantsList,
  } from '@stream-io/video-react-native-sdk';
interface VideoUIProps {}

const VideoUI = (props: VideoUIProps) => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();
  
    return <CallParticipantsList participants={participants} />;
};

export default VideoUI;

const styles = StyleSheet.create({
  container: {},
});
