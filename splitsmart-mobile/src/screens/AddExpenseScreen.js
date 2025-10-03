import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { COLORS, SIZES } from "../constants/theme";
import { expenseService } from "../services/expenseService";

const CATEGORIES = [
  "General",
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Rent",
  "Other",
];
const SPLIT_TYPES = ["Equal", "Unequal", "Percentage"];

export default function AddExpenseScreen({ navigation, route }) {
  const { groupId, members } = route.params;
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [paidById, setPaidById] = useState(user?.id);
  const [splitType, setSplitType] = useState("Equal");
  const [selectedMembers, setSelectedMembers] = useState(
    members.map((m) => m.userId)
  );
  const [customAmounts, setCustomAmounts] = useState({});
  const [customPercentages, setCustomPercentages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateExpense = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert("Error", "Please select at least one member to split with");
      return;
    }

    // Prepare splits
    let splits = [];

    if (splitType === "Equal") {
      splits = selectedMembers.map((userId) => ({
        userId,
        amount: null,
        percentage: null,
      }));
    } else if (splitType === "Unequal") {
      splits = selectedMembers.map((userId) => ({
        userId,
        amount: parseFloat(customAmounts[userId]) || 0,
        percentage: null,
      }));

      const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
      if (Math.abs(totalSplit - parsedAmount) > 0.01) {
        Alert.alert(
          "Error",
          `Split amounts must equal ${parsedAmount.toFixed(2)}`
        );
        return;
      }
    } else if (splitType === "Percentage") {
      splits = selectedMembers.map((userId) => ({
        userId,
        amount: null,
        percentage: parseFloat(customPercentages[userId]) || 0,
      }));

      const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        Alert.alert("Error", "Percentages must add up to 100%");
        return;
      }
    }

    const expenseData = {
      groupId,
      description: description.trim(),
      amount: parsedAmount,
      category,
      paidById,
      splitType,
      expenseDate: new Date().toISOString(),
      splits,
    };

    setIsLoading(true);
    try {
      await expenseService.createExpense(expenseData);
      Alert.alert("Success", "Expense added successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSplitInputs = () => {
    if (splitType === "Equal") {
      const splitAmount = (parseFloat(amount) || 0) / selectedMembers.length;
      return (
        <View style={styles.splitPreview}>
          <Text style={styles.splitPreviewText}>
            Each person pays: ${splitAmount.toFixed(2)}
          </Text>
        </View>
      );
    }

    if (splitType === "Unequal") {
      return selectedMembers.map((userId) => {
        const member = members.find((m) => m.userId === userId);
        return (
          <View key={userId} style={styles.splitInputRow}>
            <Text style={styles.splitInputLabel}>{member?.userName}</Text>
            <TextInput
              style={styles.splitInput}
              placeholder="0.00"
              value={customAmounts[userId]?.toString() || ""}
              onChangeText={(text) =>
                setCustomAmounts({ ...customAmounts, [userId]: text })
              }
              keyboardType="decimal-pad"
            />
          </View>
        );
      });
    }

    if (splitType === "Percentage") {
      return selectedMembers.map((userId) => {
        const member = members.find((m) => m.userId === userId);
        return (
          <View key={userId} style={styles.splitInputRow}>
            <Text style={styles.splitInputLabel}>{member?.userName}</Text>
            <View style={styles.percentageInputContainer}>
              <TextInput
                style={styles.splitInput}
                placeholder="0"
                value={customPercentages[userId]?.toString() || ""}
                onChangeText={(text) =>
                  setCustomPercentages({ ...customPercentages, [userId]: text })
                }
                keyboardType="decimal-pad"
              />
              <Text style={styles.percentageSymbol}>%</Text>
            </View>
          </View>
        );
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Groceries, Dinner, Rent"
            value={description}
            onChangeText={setDescription}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Paid By</Text>
          <View style={styles.memberContainer}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.userId}
                style={[
                  styles.memberChip,
                  paidById === member.userId && styles.memberChipActive,
                ]}
                onPress={() => setPaidById(member.userId)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.memberChipText,
                    paidById === member.userId && styles.memberChipTextActive,
                  ]}
                >
                  {member.userName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Split Type</Text>
          <View style={styles.splitTypeContainer}>
            {SPLIT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.splitTypeButton,
                  splitType === type && styles.splitTypeButtonActive,
                ]}
                onPress={() => setSplitType(type)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.splitTypeText,
                    splitType === type && styles.splitTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Split Between</Text>
          <View style={styles.memberContainer}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.userId}
                style={[
                  styles.memberChip,
                  selectedMembers.includes(member.userId) &&
                    styles.memberChipActive,
                ]}
                onPress={() => toggleMember(member.userId)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.memberChipText,
                    selectedMembers.includes(member.userId) &&
                      styles.memberChipTextActive,
                  ]}
                >
                  {member.userName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedMembers.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Split Details</Text>
            {renderSplitInputs()}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreateExpense}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Add Expense</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: SIZES.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
