import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../constants/theme";

export default function HelpSupportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Contact Us</Text>
          <Text style={styles.text}>Email: support@splitsmart.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ FAQ</Text>
          <Text style={styles.question}>How do I add members to a group?</Text>
          <Text style={styles.answer}>
            Open the group, go to the Members tab, and tap "Add Member". Enter
            their email address.
          </Text>

          <Text style={styles.question}>How do split types work?</Text>
          <Text style={styles.answer}>
            Equal: Splits evenly among all selected members{"\n"}
            Unequal: You specify exact amounts for each person{"\n"}
            Percentage: You specify percentages (must add to 100%)
          </Text>

          <Text style={styles.question}>How do I delete an expense?</Text>
          <Text style={styles.answer}>
            Swipe left on any expense in the group to reveal the delete button.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.xxxl,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: SIZES.md,
  },
  text: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  question: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  answer: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});
