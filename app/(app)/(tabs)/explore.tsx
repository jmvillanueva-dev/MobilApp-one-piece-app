import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Fruit } from "../../../src/domain/entities/Fruit.model";
import { useAuthContext } from "../../../src/presentation/contexts/AuthContext";
import { useFruit } from "../../../src/presentation/hooks/useFruit";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

/**
 * Componente para mostrar una tarjeta de fruta del diablo
 */
const FruitCard: React.FC<{ fruit: Fruit }> = React.memo(({ fruit }) => {
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    router.push(`/(app)/fruit/${fruit.id}` as any);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Paramecia":
        return "#FF6B35";
      case "Zoan":
        return "#4CAF50";
      case "Logia":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  return (
    <TouchableOpacity style={styles.fruitCard} onPress={handlePress}>
      <View style={styles.fruitImageContainer}>
        {imageError ? (
          <View style={styles.fruitFallbackContainer}>
            <Text style={styles.fruitFallbackEmoji}>🍎</Text>
          </View>
        ) : (
          <Image
            source={{ uri: fruit.filename }}
            style={styles.fruitImage}
            placeholder="https://via.placeholder.com/120x120/f0f0f0/666666?text=🍎"
            contentFit="cover"
            transition={300}
            onError={() => setImageError(true)}
            cachePolicy="memory-disk"
          />
        )}
      </View>

      <View style={styles.fruitCardContent}>
        <Text style={styles.fruitName} numberOfLines={2}>
          {fruit.name}
        </Text>

        <Text style={styles.fruitRomanName} numberOfLines={1}>
          {fruit.roman_name}
        </Text>

        <View
          style={[
            styles.fruitTypeBadge,
            { backgroundColor: getTypeColor(fruit.type) },
          ]}
        >
          <Text style={styles.fruitTypeText}>{fruit.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

FruitCard.displayName = "FruitCard";

/**
 * Componente de filtros
 */
const FilterSection: React.FC<{
  searchTerm: string;
  selectedType: string;
  onSearch: (term: string) => void;
  onFilterType: (type: any) => void;
  onClearFilters: () => void;
  availableTypes: string[];
}> = ({
  searchTerm,
  selectedType,
  onSearch,
  onFilterType,
  onClearFilters,
  availableTypes,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={styles.filterSection}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar frutas del diablo..."
          value={searchTerm}
          onChangeText={onSearch}
          placeholderTextColor="#666"
        />
        {searchTerm ? (
          <TouchableOpacity onPress={onClearFilters}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Botón de filtros */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="filter" size={20} color="#fff" />
        <Text style={styles.filterButtonText}>Filtros</Text>
      </TouchableOpacity>

      {/* Filtros expandibles */}
      {showFilters && (
        <View style={styles.filterOptions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.typeFilter,
                selectedType === "all" && styles.typeFilterActive,
              ]}
              onPress={() => onFilterType("all")}
            >
              <Text
                style={[
                  styles.typeFilterText,
                  selectedType === "all" && styles.typeFilterTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            {availableTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeFilter,
                  selectedType === type && styles.typeFilterActive,
                ]}
                onPress={() => onFilterType(type)}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    selectedType === type && styles.typeFilterTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

/**
 * Pantalla principal de exploración - Frutas del Diablo
 */
export default function ExploreScreen() {
  const { user, logout } = useAuthContext();
  const {
    fruits,
    loading,
    error,
    refreshing,
    searchTerm,
    selectedType,
    refreshFruits,
    searchFruits,
    filterByType,
    clearFilters,
    clearError,
    totalFruits,
    filteredCount,
    availableTypes,
  } = useFruit();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            const success = await logout();
            if (success) {
              router.replace("/(auth)/login");
            }
          },
        },
      ]
    );
  };

  /**
   * Maneja errores mostrando alertas
   */
  React.useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "Reintentar", onPress: refreshFruits },
        { text: "Cancelar", style: "cancel", onPress: clearError },
      ]);
    }
  }, [error, refreshFruits, clearError]);

  /**
   * Renderiza cada fruta
   */
  const renderFruit = ({ item }: { item: Fruit }) => <FruitCard fruit={item} />;

  /**
   * Renderiza el encabezado de bienvenida
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            ☠️ ¡Hola, {user?.displayName || "Pirata"}!
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Frutas del Diablo</Text>
      <Text style={styles.headerSubtitle}>
        Descubre los poderes místicos del mundo de One Piece
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredCount}</Text>
          <Text style={styles.statLabel}>
            {filteredCount === totalFruits ? "Frutas" : "Filtradas"}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{availableTypes.length}</Text>
          <Text style={styles.statLabel}>Tipos</Text>
        </View>
      </View>
    </View>
  );

  if (loading && fruits.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando frutas del diablo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FilterSection
        searchTerm={searchTerm}
        selectedType={selectedType}
        onSearch={searchFruits}
        onFilterType={filterByType}
        onClearFilters={clearFilters}
        availableTypes={availableTypes}
      />

      <FlatList
        data={fruits}
        renderItem={renderFruit}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshFruits}
            colors={["#FF6B35"]}
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              {searchTerm || selectedType !== "all"
                ? "No se encontraron frutas con estos filtros"
                : "No hay frutas del diablo disponibles"}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
              <Text style={styles.emptyButtonText}>
                {searchTerm || selectedType !== "all"
                  ? "Limpiar Filtros"
                  : "Reintentar"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#FFF5F2",
    borderRadius: 20,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  filterOptions: {
    marginTop: 12,
  },
  typeFilter: {
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  typeFilterActive: {
    backgroundColor: "#FF6B35",
  },
  typeFilterText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  typeFilterTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fruitCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  fruitImageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  fruitImage: {
    width: "100%",
    height: "100%",
  },
  fruitFallbackContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  fruitFallbackEmoji: {
    fontSize: 32,
  },
  fruitCardContent: {
    padding: 12,
  },
  fruitName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
    lineHeight: 18,
  },
  fruitRomanName: {
    fontSize: 11,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 8,
  },
  fruitTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fruitTypeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
