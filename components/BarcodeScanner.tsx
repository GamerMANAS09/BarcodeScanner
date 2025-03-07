import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { db } from "../firebaseConfig"; // Import Firestore
import { doc, getDoc } from "firebase/firestore";
import { Button, Card } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const BarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(true); // ✅ Camera starts full-screen

  // ✅ Define proper type for scannedData
  const [scannedData, setScannedData] = useState<{
    product_id: string;
    name: string;
    manufacturer: string;
    expiry_date: string;
    batch_number: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      if (!permission || permission.status !== "granted") {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setFullScreen(false); // ✅ Minimize camera after scan
    setLoading(true);
    console.log("📡 Scanned Product ID:", data);

    try {
      // 🔹 Fetch medicine details from Firestore using product_id
      const docRef = doc(db, "medicines", data);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScannedData(docSnap.data() as {
          product_id: string;
          name: string;
          manufacturer: string;
          expiry_date: string;
          batch_number: string;
          price: string;
        });
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
      {/* Camera Scanner (Full-Screen or Minimized) */}
      <View
        style={[
          styles.cameraContainer,
          fullScreen ? styles.fullCamera : styles.miniCamera, // ✅ Dynamic size
        ]}
      >
        <CameraView
          style={styles.scanner}
          barcodeScannerSettings={{ barcodeTypes: ["code128"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      {/* Scan Again Button */}
      {scanned && (
        <Button
          mode="contained"
          onPress={() => {
            setScanned(false);
            setScannedData(null);
            setFullScreen(true); // ✅ Reset to full-screen when scanning again
          }}
          style={styles.scanAgainButton}
        >
          Scan Again
        </Button>
      )}

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#6200EE" style={styles.loading} />}

      {/* Medicine Details */}
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
    elevation: 5, // Shadow effect
    backgroundColor: "#000",
  },
  fullCamera: {
    width: width * 0.9, // ✅ 90% of screen width (adds side gaps)
    height: height * 0.8, // ✅ 80% of screen height (lifts from bottom)
    alignSelf: "center", // ✅ Centers horizontally
    borderRadius: 20, // ✅ Adds rounded corners for a modern UI
    marginVertical: height * 0.05, // ✅ Adjusts vertical centering (lifts from bottom)
  },
  miniCamera: {
    width: "90%", // ✅ Minimized width
    height: 200, // ✅ Minimized height
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
    elevation: 3, // Shadow effect
  },
  dataText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
});

export default BarcodeScanner;
