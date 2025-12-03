import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import comingsoon from "../../assets/images/animatin/comingsoon.json";


const Weight = () => {
  return (
    <View className="items-center mt-6 mb-4">
        {/* <BirdMascot /> */}
        <LottieView
          source={comingsoon}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
  )
}

export default Weight