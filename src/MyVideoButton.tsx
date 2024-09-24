import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

interface MyVideoButtonProps {}

const MyVideoButton = (props: MyVideoButtonProps) => {
    const { useCameraState } = useCallStateHooks();
    const { camera, isMuted } = useCameraState();

    return (
        <View style={styles.container}>
            <Button
                title={isMuted ? 'Turn on camera' : 'Turn off camera'}
                onPress={() => camera.toggle()}
            />
        </View>
    );
};

export default MyVideoButton;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
});
