// import React, { useState } from 'react';
// import AgoraUIKit, { RtcPropsInterface } from 'agora-react-uikit';
// import { Button, Text, View } from 'react-native';

// const App: React.FC = () => {
//   const [videoCallActive, setVideoCallActive] = useState(false);
//   // Define the type for rtcProps
//   const rtcProps: RtcPropsInterface = {
//     appId: 'c5a9bf59105b4b56bfced5e56bbe9636',
//     channel: 'testVideoApp',
//     token: '007eJxTYGjm6QzLSTJ9IzAlMu1hR/JW/eDVl5jyV36Zekhj37P6k7MVGJJNEy2T0kwtDQ1Mk0ySTM2S0pJTU0xTgYykVEszY7NrLVfTGgIZGfbKHmNghEIQn4ehJLW4JCwzJTXfsaCAgQEAwU8ksQ==', // Enter your channel token as a string if required
//   };

//   return (
//     <View style={{ flex: 1 }}>
//     {videoCallActive ? (
//       <AgoraUIKit rtcProps={rtcProps} />
//     ) : (
//       <Button title="Start Video Call" onPress={() => setVideoCallActive(true)} />
//     )}
//   </View>
//   );
// };

// export default App;
