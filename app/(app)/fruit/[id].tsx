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
import { FruitService } from "../../../src/data/services/fruit.service";
import { Fruit } from "../../../src/domain/entities/Fruit.model";

/**
 * Pantalla de detalle de una fruta del diablo
 */
export default function FruitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fruit, setFruit] = useState<Fruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  /**
   * Carga los datos de la fruta del diablo
   */
  const fetchFruit = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const fruitData = await FruitService.getFruitById(parseInt(id));
      setFruit(fruitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFruit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Muestra alerta de error
   */
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "Reintentar", onPress: fetchFruit },
        { text: "Volver", onPress: () => router.back() },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /**
   * Obtiene el color del tipo de fruta
   */
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

  /**
   * Obtiene el emoji del tipo de fruta
   */
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "Paramecia":
        return "🔧";
      case "Zoan":
        return "🐾";
      case "Logia":
        return "🌪️";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando fruta del diablo...</Text>
      </View>
    );
  }

  if (!fruit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Fruta del diablo no encontrada</Text>
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

        <View style={styles.imageContainer}>
          {imageError ? (
            <View style={styles.fallbackImageContainer}>
              <Text style={styles.fallbackImageEmoji}>🍎</Text>
              <Text style={styles.fallbackImageText}>{fruit.name}</Text>
            </View>
          ) : (
            <Image
              source={{ uri: fruit.filename }}
              style={styles.fruitImage}
              placeholder="https://via.placeholder.com/250x250/f0f0f0/666666?text=🍎"
              contentFit="contain"
              transition={300}
              onError={() => setImageError(true)}
              cachePolicy="memory-disk"
            />
          )}
        </View>

        <View style={styles.headerOverlay}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(fruit.type) },
            ]}
          >
            <Text style={styles.typeEmoji}>{getTypeEmoji(fruit.type)}</Text>
            <Text style={styles.typeText}>{fruit.type}</Text>
          </View>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.fruitName}>{fruit.name}</Text>
          <Text style={styles.fruitRomanName}>{fruit.roman_name}</Text>
        </View>

        {/* Tipo y características */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Fruta</Text>
          <View style={styles.typeInfoContainer}>
            <Text style={styles.typeEmoji}>{getTypeEmoji(fruit.type)}</Text>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{fruit.type}</Text>
              <Text style={styles.typeDescription}>
                {fruit.type === "Paramecia" &&
                  "Otorga habilidades sobrehumanas al cuerpo del usuario"}
                {fruit.type === "Zoan" &&
                  "Permite al usuario transformarse en un animal"}
                {fruit.type === "Logia" &&
                  "Permite al usuario crear, controlar y transformarse en un elemento natural"}
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{fruit.description}</Text>
        </View>

        {/* Información adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>

          <View style={styles.infoRow}>
            <Ionicons name="id-card" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>{fruit.id}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="language" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre Japonés</Text>
              <Text style={styles.infoValue}>{fruit.roman_name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="library" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Clasificación</Text>
              <Text
                style={[styles.infoValue, { color: getTypeColor(fruit.type) }]}
              >
                {fruit.type}-type Devil Fruit
              </Text>
            </View>
          </View>
        </View>
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
    backgroundColor: "#FFFFFF",
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
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  fruitImage: {
    width: 200,
    height: 200,
  },
  fallbackImageContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 100,
  },
  fallbackImageEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  fallbackImageText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
    textAlign: "center",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
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
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fruitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  fruitRomanName: {
    fontSize: 16,
    color: "#666666",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  typeInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  typeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  typeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 22,
    textAlign: "justify",
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
    color: "#999999",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
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
    textAlign: "center",
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
});
