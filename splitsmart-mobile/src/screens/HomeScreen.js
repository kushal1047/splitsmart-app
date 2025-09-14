import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { COLORS, SIZES } from "../constants/theme";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUPS);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate("GroupDetail", { groupId: item.id })}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberCount}>{item.memberCount} members</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.groupDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.groupFooter}>
        <Text style={styles.totalExpenses}>
          Total: ${item.totalExpenses.toFixed(2)}
        </Text>
        <Text style={styles.createdBy}>by {item.createdByName}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <Text style={styles.subtitle}>Your expense groups</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first group to get started
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateGroup")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SIZES.lg,
    paddingTop: SIZES.xxxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: SIZES.md,
  },
  groupCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    flex: 1,
  },
  memberBadge: {
    backgroundColor: COLORS.light,
    paddingVertical: 4,
    paddingHorizontal: SIZES.sm,
    borderRadius: 12,
  },
  memberCount: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  groupDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.sm,
  },
  groupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.xs,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalExpenses: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  createdBy: {
    fontSize: 12,
    color: COLORS.gray,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.xxxl * 2,
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
});
