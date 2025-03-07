import React from "react";
import { View } from "react-native";
import BarcodeScanner from "../components/BarcodeScanner"; 

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <BarcodeScanner />
    </View>
  );
};

export default App;
