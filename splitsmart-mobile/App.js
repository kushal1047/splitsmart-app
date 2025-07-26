import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SplitSmart</Text>
      <Text style={styles.subtitle}>Smart Expense Splitter</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366F1",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 8,
  },
});
