import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { expenseService } from "../services/expenseService";

export default function SettlementsScreen({ navigation, route }) {
  const { groupId, groupName } = route.params;
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSettlements();
  }, [groupId]);

  const fetchSettlements = async () => {
    try {
      const data = await expenseService.getSettlements(groupId);
      setSettlements(data);
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSettlements();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Settlements
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Settle Up</Text>
          <Text style={styles.infoText}>
            These are the minimum transactions needed to settle all balances in{" "}
            {groupName}.
          </Text>
        </View>

        {settlements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>All Settled Up!</Text>
            <Text style={styles.emptySubtext}>
              Everyone is even. No payments needed.
            </Text>
          </View>
        ) : (
          settlements.map((settlement, index) => (
            <View key={index} style={styles.settlementCard}>
              <View style={styles.settlementHeader}>
                <View style={styles.userCircle}>
                  <Text style={styles.userInitial}>
                    {settlement.fromUserName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
                <View style={styles.userCircle}>
                  <Text style={styles.userInitial}>
                    {settlement.toUserName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.settlementBody}>
                <Text style={styles.settlementText}>
                  <Text style={styles.boldText}>{settlement.fromUserName}</Text>{" "}
                  pays{" "}
                  <Text style={styles.boldText}>{settlement.toUserName}</Text>
                </Text>
                <Text style={styles.settlementAmount}>
                  ${settlement.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: SIZES.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SIZES.xs,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  settlementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settlementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.md,
  },
  userCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  arrowContainer: {
    marginHorizontal: SIZES.md,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.gray,
  },
  settlementBody: {
    alignItems: "center",
  },
  settlementText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "600",
    color: COLORS.dark,
  },
  settlementAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.success,
  },
});
