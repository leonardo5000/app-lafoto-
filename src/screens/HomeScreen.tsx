import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { listPhotos, deletePhoto, Photo } from "../repositories/photosRepository";

interface HomeScreenProps {
  onNavigateTo: (screen: "home" | "add" | "map") => void;
}

export default function HomeScreen({ onNavigateTo }: HomeScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const loadPhotos = () => {
    setPhotos(listPhotos());
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert("Excluir Item", "Tem certeza que deseja remover esta imagem da galeria?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deletePhoto(id);
          loadPhotos();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📸 Galeria de Fotos</Text>

      {/* Menu de Navegação Superior */}
      <View style={styles.navMenu}>
        <TouchableOpacity style={[styles.navButton, styles.addBtn]} onPress={() => onNavigateTo("add")}>
          <Text style={styles.navButtonText}>➕ Adicionar Imagem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.mapBtn]} onPress={() => onNavigateTo("map")}>
          <Text style={styles.navButtonText}>🗺️ Ver no Mapa</Text>
        </TouchableOpacity>
      </View>

      {/* Listagem */}
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_uri }} style={styles.image} />
            <View style={{ flex: 1, padding: 10, justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>
                  📅 {new Date(item.created_at).toLocaleDateString("pt-BR")} às {new Date(item.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {item.latitude && <Text style={styles.cardCoords}>📍 Geo-localizada</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma imagem salva no SQLite ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  navMenu: { flexDirection: "row", gap: 10, marginBottom: 20 },
  navButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  addBtn: { backgroundColor: "#007AFF" },
  mapBtn: { backgroundColor: "#34C759" },
  navButtonText: { color: "#fff", fontWeight: "bold" },
  card: { flexDirection: "row", marginBottom: 15, backgroundColor: "#f9f9f9", borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#eee" },
  image: { width: 90, height: 90 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardDate: { fontSize: 12, color: "#666", marginTop: 2 },
  cardCoords: { fontSize: 11, color: "#007AFF", fontWeight: "600", marginTop: 4 },
  deleteText: { color: "#FF3B30", fontWeight: "bold", fontSize: 13 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 40 }
});