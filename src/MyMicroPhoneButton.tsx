import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

interface MyMicroPhoneButtonProps {}

const MyMicroPhoneButton = (props: MyMicroPhoneButtonProps) => {
    const { useMicrophoneState } = useCallStateHooks();
    const { microphone, isMuted } = useMicrophoneState();

    return (
        <View style={styles.container}>
            <Button
                title={isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                onPress={() => microphone.toggle()}
            />
        </View>
    );
};

export default MyMicroPhoneButton;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
});
