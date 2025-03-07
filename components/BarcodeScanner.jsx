import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { db } from "../firebaseConfig"; // Ensure correct Firestore import
import { doc, getDoc } from "firebase/firestore";
import { Button, Card } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const BarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [scannedData, setScannedData] = useState(null); // ✅ Removed TypeScript types

  useEffect(() => {
    (async () => {
      if (!permission || permission.status !== "granted") {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => { // ✅ Removed TypeScript type
    setScanned(true);
    setFullScreen(false);
    setLoading(true);
    console.log("📡 Scanned Product ID:", data);

    try {
      const docRef = doc(db, "medicines", data);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScannedData(docSnap.data());
      } else {
        setScannedData(null);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (permission.status !== "granted") {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.cameraContainer,
          fullScreen ? styles.fullCamera : styles.miniCamera,
        ]}
      >
        <CameraView
          style={styles.scanner}
          barcodeScannerSettings={{ barcodeTypes: ["code128"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      {scanned && (
        <Button
          mode="contained"
          onPress={() => {
            setScanned(false);
            setScannedData(null);
            setFullScreen(true);
          }}
          style={styles.scanAgainButton}
        >
          Scan Again
        </Button>
      )}

      {loading && <ActivityIndicator size="large" color="#6200EE" style={styles.loading} />}

      {scannedData && (
        <Card style={styles.card}>
          <Card.Title title="Medicine Details" />
          <Card.Content>
            <Text style={styles.dataText}>📦 Product ID: {scannedData.product_id}</Text>
            <Text style={styles.dataText}>💊 Name: {scannedData.name}</Text>
            <Text style={styles.dataText}>🏭 Manufacturer: {scannedData.manufacturer}</Text>
            <Text style={styles.dataText}>🛑 Expiry Date: {scannedData.expiry_date}</Text>
            <Text style={styles.dataText}>🔢 Batch Number: {scannedData.batch_number}</Text>
            <Text style={styles.dataText}>💰 Price: {scannedData.price}</Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  cameraContainer: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#000",
  },
  fullCamera: {
    width: width * 0.9,
    height: height * 0.8,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: height * 0.05,
  },
  miniCamera: {
    width: "90%",
    height: 200,
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  scanAgainButton: {
    marginTop: 20,
    backgroundColor: "#0047AB",
  },
  loading: {
    marginTop: 20,
  },
  card: {
    width: "90%",
    marginTop: 20,
    padding: 10,
    elevation: 3,
  },
  dataText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
});

export default BarcodeScanner;
