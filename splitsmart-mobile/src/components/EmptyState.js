import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants/theme";

export default function EmptyState({ icon, title, message }) {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.xxxl * 2,
  },
  icon: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SIZES.xs,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    paddingHorizontal: SIZES.xl,
  },
});
