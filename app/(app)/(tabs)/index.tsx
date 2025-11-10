import { Image } from "expo-image";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Character } from "../../../src/domain/entities/Character.model";
import { useCharacter } from "../../../src/presentation/hooks/useCharacter";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columnas con padding

/**
 * Componente de tarjeta para mostrar un personaje
 */
const CharacterCard: React.FC<{ character: Character }> = React.memo(
  ({ character }) => {
    const [imageError, setImageError] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const handlePress = () => {
      router.push(`/(app)/character/${character.id}` as any);
    };

    // Generar múltiples URLs de imagen como fallback
    const getImageUrls = (id: number) => {
      const baseUrls = [
        `https://picsum.photos/seed/pirate${id}/200/300`,
        `https://picsum.photos/seed/ocean${id}/200/300`,
        `https://picsum.photos/seed/ship${id}/200/300`,
        `https://picsum.photos/seed/adventure${id}/200/300`,
        `https://source.unsplash.com/200x300/?pirate,sea&sig=${id}`,
      ];
      return baseUrls;
    };

    const imageUrls = getImageUrls(character.id);

    // Manejar error de carga de imagen
    const handleImageError = () => {
      if (currentImageIndex < imageUrls.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
        setImageError(false);
      } else {
        setImageError(true);
      }
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.imageContainer}>
          {imageError ? (
            // Fallback local cuando todas las URLs fallan
            <View style={styles.fallbackContainer}>
              <Text style={styles.fallbackEmoji}>🏴‍☠️</Text>
              <Text style={styles.fallbackText}>Pirata</Text>
            </View>
          ) : (
            <Image
              source={{ uri: imageUrls[currentImageIndex] }}
              style={styles.characterImage}
              placeholder="https://via.placeholder.com/200x300/1a1a2e/ffffff?text=Loading..."
              contentFit="cover"
              transition={300}
              onError={handleImageError}
              cachePolicy="memory-disk"
            />
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.characterName} numberOfLines={1}>
            {character.name}
          </Text>

          <Text style={styles.characterJob} numberOfLines={1}>
            {character.job || "Desconocido"}
          </Text>

          {character.bounty && character.bounty !== "unknown" && (
            <Text style={styles.bounty} numberOfLines={1}>
              💰 {character.bounty}
            </Text>
          )}

          {character.crew && (
            <Text style={styles.crew} numberOfLines={1}>
              🏴‍☠️ {character.crew.name}
            </Text>
          )}

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    character.status === "alive" ? "#4CAF50" : "#FF5722",
                },
              ]}
            >
              <View style={styles.statusText}>
                <FontAwesome name="birthday-cake" size={12} />
                <Text style={styles.text}>{character.age}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

CharacterCard.displayName = "CharacterCard";

/**
 * Pantalla principal que muestra la lista de personajes
 */
export default function HomeScreen() {
  const { characters, loading, error, refreshCharacters, clearError } =
    useCharacter();

  /**
   * Maneja el pull-to-refresh
   */
  const handleRefresh = () => {
    clearError();
    refreshCharacters();
  };

  /**
   * Muestra alerta de error
   */
  React.useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "Reintentar", onPress: refreshCharacters },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  }, [error, refreshCharacters]);

  /**
   * Renderiza cada item de la lista
   */
  const renderCharacter = ({ item }: { item: Character }) => (
    <CharacterCard character={item} />
  );

  /**
   * Renderiza el indicador de carga inicial
   */
  if (loading && characters.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>One Piece</Text>
        <Text style={styles.headerSubtitle}>
          {characters.length} personajes encontrados
        </Text>
      </View>

      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + 16, // altura de la tarjeta + margen
          offset: Math.floor(index / 2) * (CARD_WIDTH + 16),
          index,
        })}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={["#FF6B35"]}
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay personajes disponibles</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshCharacters}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
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
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
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
  imageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#F0F0F0",
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    padding: 12,
  },
  characterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  characterJob: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 6,
  },
  bounty: {
    fontSize: 11,
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: 4,
  },
  crew: {
    fontSize: 11,
    color: "#4CAF50",
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
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
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fallbackContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  fallbackEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  fallbackText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
});
