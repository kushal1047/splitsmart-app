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
