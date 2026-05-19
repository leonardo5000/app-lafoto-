import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { listPhotos, Photo } from "../repositories/photosRepository";

interface MapScreenProps {
  onNavigateBack: () => void;
}

export default function MapScreen({ onNavigateBack }: MapScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const all = listPhotos();
    // Filtra para exibir apenas imagens que contêm coordenadas válidas
    setPhotos(all.filter(p => p.latitude !== null && p.longitude !== null));
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.4222,
          longitude: -51.9361,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{ latitude: photo.latitude!, longitude: photo.longitude! }}
          >
            {/* Callout renderiza o título e a miniatura ao ser tocado */}
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>{photo.title}</Text>
                <Image source={{ uri: photo.image_uri }} style={styles.image} />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
        <Text style={styles.backText}>⬅ Voltar para Galeria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  backButton: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  backText: { color: "#fff", fontWeight: "bold" },
  callout: { backgroundColor: "#fff", padding: 10, borderRadius: 8, width: 150, alignItems: "center", borderWidth: 1, borderColor: "#ccc" },
  title: { fontWeight: "bold", marginBottom: 6, fontSize: 13, textAlign: "center" },
  image: { width: 130, height: 85, borderRadius: 4 }
});