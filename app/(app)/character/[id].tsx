import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CharacterService } from "../../../src/data/services/character.service";
import { Character } from "../../../src/domain/entities/Character.model";

/**
 * Pantalla de detalle del personaje
 */
export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los datos del personaje
   */
  const fetchCharacter = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const characterData = await CharacterService.getCharacterById(
        parseInt(id)
      );
      setCharacter(characterData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Muestra alerta de error
   */
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "Reintentar", onPress: fetchCharacter },
        { text: "Volver", onPress: () => router.back() },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Estados para manejo de imágenes
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Generar múltiples URLs de imagen como fallback
   */
  const getImageUrls = (characterId: number) => {
    const baseUrls = [
      `https://picsum.photos/seed/pirate${characterId}/400/500`,
      `https://picsum.photos/seed/ocean${characterId}/400/500`,
      `https://picsum.photos/seed/ship${characterId}/400/500`,
      `https://picsum.photos/seed/adventure${characterId}/400/500`,
      `https://source.unsplash.com/400x500/?pirate,sea&sig=${characterId}`,
    ];
    return baseUrls;
  };

  // Manejar error de carga de imagen
  const handleImageError = () => {
    if (character) {
      const imageUrls = getImageUrls(character.id);
      if (currentImageIndex < imageUrls.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
        setImageError(false);
      } else {
        setImageError(true);
      }
    }
  };

  /**
   * Renderiza la sección de información básica
   */
  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Información Básica</Text>

      <View style={styles.infoRow}>
        <Ionicons name="person" size={20} color="#666" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{character?.name}</Text>
        </View>
      </View>

      {character?.job && (
        <View style={styles.infoRow}>
          <Ionicons name="briefcase" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Trabajo</Text>
            <Text style={styles.infoValue}>{character.job}</Text>
          </View>
        </View>
      )}

      {character?.age && (
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Edad</Text>
            <Text style={styles.infoValue}>{character.age}</Text>
          </View>
        </View>
      )}

      {character?.birthday && (
        <View style={styles.infoRow}>
          <Ionicons name="gift" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Cumpleaños</Text>
            <Text style={styles.infoValue}>{character.birthday}</Text>
          </View>
        </View>
      )}

      {character?.size && (
        <View style={styles.infoRow}>
          <Ionicons name="resize" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Tamaño</Text>
            <Text style={styles.infoValue}>{character.size}</Text>
          </View>
        </View>
      )}

      <View style={styles.infoRow}>
        <Ionicons
          name={character?.crew?.is_yonko ? "heart" : "skull"}
          size={20}
          color={character?.crew?.is_yonko ? "#4CAF50" : "#FF5722"}
        />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Estado Tripulación</Text>
          <Text
            style={[
              styles.infoValue,
              { color: character?.crew?.is_yonko ? "#4CAF50" : "#FF5722" },
            ]}
          >
            {character?.crew?.is_yonko ? "Yonko" : "Pirata"}
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza la sección de recompensa
   */
  const renderBountyInfo = () => {
    if (!character?.bounty || character.bounty === "unknown") return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recompensa</Text>
        <View style={styles.bountyContainer}>
          <Ionicons name="diamond" size={24} color="#FFD700" />
          <Text style={styles.bountyAmount}>{character.bounty}</Text>
        </View>
      </View>
    );
  };

  /**
   * Renderiza la sección de tripulación
   */
  const renderCrewInfo = () => {
    if (!character?.crew) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tripulación</Text>

        <View style={styles.crewContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="flag" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{character.crew.name}</Text>
            </View>
          </View>

          {character.crew.description && (
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Descripción</Text>
                <Text style={styles.infoValue}>
                  {character.crew.description}
                </Text>
              </View>
            </View>
          )}

          {character.crew.number && (
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Número</Text>
                <Text style={styles.infoValue}>{character.crew.number}</Text>
              </View>
            </View>
          )}

          {character.crew.is_yonko === "true" && (
            <View style={styles.yonkoContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.yonkoText}>Tripulación Yonko</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  /**
   * Renderiza la sección de fruta del diablo
   */
  const renderFruitInfo = () => {
    if (!character?.fruit) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fruta del Diablo</Text>

        <View style={styles.fruitContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="leaf" size={20} color="#8BC34A" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{character.fruit.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="library" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{character.fruit.type}</Text>
            </View>
          </View>

          {character.fruit.description && (
            <View style={styles.infoRow}>
              <Ionicons name="document-text" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Descripción</Text>
                <Text style={styles.infoValue}>
                  {character.fruit.description}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando personaje...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#FF5722" />
        <Text style={styles.errorText}>Personaje no encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con imagen */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {imageError ? (
          // Fallback local cuando todas las URLs fallan
          <View style={styles.fallbackImageContainer}>
            <Text style={styles.fallbackImageEmoji}>🏴‍☠️</Text>
            <Text style={styles.fallbackImageText}>{character.name}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: getImageUrls(character.id)[currentImageIndex] }}
            style={styles.characterImage}
            placeholder="https://via.placeholder.com/400x500/1a1a2e/ffffff?text=Loading..."
            contentFit="cover"
            transition={300}
            onError={handleImageError}
            cachePolicy="memory-disk"
          />
        )}

        <View style={styles.headerOverlay}>
          <Text style={styles.characterName}>{character.name}</Text>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {renderBasicInfo()}
        {renderBountyInfo()}
        {renderCrewInfo()}
        {renderFruitInfo()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 300,
    position: "relative",
  },
  backButtonHeader: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  characterName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666666",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
  bountyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 16,
  },
  bountyAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
    marginLeft: 8,
  },
  crewContainer: {
    // Contenedor específico para tripulación
  },
  yonkoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  yonkoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF8F00",
    marginLeft: 8,
  },
  fruitContainer: {
    // Contenedor específico para fruta del diablo
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666666",
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fallbackImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  fallbackImageEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  fallbackImageText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
});
