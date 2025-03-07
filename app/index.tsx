import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, Card } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter(); // Navigation hook


  
  return (
    
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>📷 Barcode Scanner App</Text>
          <Text style={styles.subtitle}>Scan barcodes to get product details instantly.</Text>
        </Card.Content>
      </Card>

      {/* Navigation Button */}
      <Button
        mode="contained"
        onPress={() => router.push("/barcode")}
        style={styles.scanButton}
        labelStyle={{ fontSize: 18 }}
      >
        Go to Scanner
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  scanButton: {
    width: "80%",
    paddingVertical: 10,
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
});

