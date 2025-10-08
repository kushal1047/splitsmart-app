import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { COLORS, SIZES } from "../constants/theme";
import { groupService } from "../services/groupService";
import { expenseService } from "../services/expenseService";

export default function GroupDetailScreen({ navigation, route }) {
  const { groupId } = route.params;
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses"); // expenses, balances, members

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      const [groupData, expensesData, balancesData] = await Promise.all([
        groupService.getGroupById(groupId),
        expenseService.getGroupExpenses(groupId),
        groupService.getGroupBalances(groupId),
      ]);
      setGroup(groupData);
      setExpenses(expensesData);
      setBalances(balancesData);
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupData();
  };

  const handleAddExpense = () => {
    navigation.navigate("AddExpense", {
      groupId,
      members: group?.members || [],
    });
  };

  const handleAddMember = () => {
    Alert.prompt(
      "Add Member",
      "Enter the email address of the person you want to add:",
      async (email) => {
        if (email) {
          try {
            await groupService.addMember(groupId, email);
            Alert.alert("Success", "Member added successfully");
            fetchGroupData();
          } catch (error) {
            Alert.alert("Error", error);
          }
        }
      }
    );
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await expenseService.deleteExpense(expenseId);
              Alert.alert("Success", "Expense deleted");
              fetchGroupData();
            } catch (error) {
              Alert.alert("Error", error);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      {expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first expense to get started
          </Text>
        </View>
      ) : (
        expenses.map((expense) => (
          <TouchableOpacity
            key={expense.id}
            style={styles.expenseCard}
            onLongPress={() => handleDeleteExpense(expense.id)}
          >
            <View style={styles.expenseHeader}>
              <Text style={styles.expenseDescription}>
                {expense.description}
              </Text>
              <Text style={styles.expenseAmount}>
                ${expense.amount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.expenseFooter}>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
              <Text style={styles.expensePaidBy}>
                Paid by {expense.paidByName}
              </Text>
            </View>
            <Text style={styles.expenseDate}>
              {new Date(expense.expenseDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderBalancesTab = () => (
    <View style={styles.tabContent}>
      {balances.map((balance) => (
        <View key={balance.userId} style={styles.balanceCard}>
          <Text style={styles.balanceName}>{balance.userName}</Text>
          <Text
            style={[
              styles.balanceAmount,
              balance.balance > 0 ? styles.positive : styles.negative,
            ]}
          >
            {balance.balance > 0 ? "+" : ""}${balance.balance.toFixed(2)}
          </Text>
        </View>
      ))}

      {balances.some((b) => b.balance !== 0) && (
        <TouchableOpacity
          style={styles.settlementButton}
          onPress={() =>
            navigation.navigate("Settlements", {
              groupId,
              groupName: group?.name,
            })
          }
        >
          <Text style={styles.settlementButtonText}>
            📊 View Settlement Plan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMembersTab = () => (
    <View style={styles.tabContent}>
      {group?.members.map((member) => (
        <View key={member.id} style={styles.memberCard}>
          <View>
            <Text style={styles.memberName}>{member.userName}</Text>
            <Text style={styles.memberEmail}>{member.userEmail}</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{member.role}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addMemberButton}
        onPress={handleAddMember}
      >
        <Text style={styles.addMemberText}>+ Add Member</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {group?.name}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{group?.members.length || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            ${group?.totalExpenses.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "expenses" && styles.activeTab]}
          onPress={() => setActiveTab("expenses")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expenses" && styles.activeTabText,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "balances" && styles.activeTab]}
          onPress={() => setActiveTab("balances")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "balances" && styles.activeTabText,
            ]}
          >
            Balances
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "members" && styles.activeTab]}
          onPress={() => setActiveTab("members")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "members" && styles.activeTabText,
            ]}
          >
            Members
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "expenses" && renderExpensesTab()}
        {activeTab === "balances" && renderBalancesTab()}
        {activeTab === "members" && renderMembersTab()}
      </ScrollView>

      {activeTab === "expenses" && (
        <TouchableOpacity style={styles.fab} onPress={handleAddExpense}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SIZES.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.xxxl * 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
  },
  expenseCard: {
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
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.xs,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    flex: 1,
    marginRight: SIZES.sm,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.xs,
  },
  expenseCategory: {
    fontSize: 12,
    color: COLORS.gray,
    backgroundColor: COLORS.light,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expensePaidBy: {
    fontSize: 12,
    color: COLORS.gray,
  },
  expenseDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  balanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  balanceName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.dark,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.danger,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
  },
  memberEmail: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: COLORS.light,
    paddingVertical: 4,
    paddingHorizontal: SIZES.sm,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  addMemberButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    alignItems: "center",
    marginTop: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  addMemberText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: SIZES.lg,
    bottom: SIZES.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: "300",
  },
  settlementButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: SIZES.md,
    alignItems: "center",
    marginTop: SIZES.md,
  },
  settlementButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
