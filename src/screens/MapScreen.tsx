import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { listPhotos, Photo } from "../repositories/photosRepository";

interface MapScreenProps {
  onNavigateBack: () => void;
}

export default function MapScreen({ onNavigateBack }: MapScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const all = listPhotos();
    
    if (all && Array.isArray(all)) {
      setPhotos(all.filter(p => p && p.latitude !== null && p.longitude !== null));
    } else {
      setPhotos([]);
    }
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        
        provider={PROVIDER_GOOGLE}
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
            
            <View style={styles.markerContainer}>
              <View style={styles.markerBubble}>
                <Image source={{ uri: photo.image_uri }} style={styles.markerImage} />
              </View>
              <View style={styles.markerArrow} />
            </View>

            {/* Balão de Informações básicas ao tocar na bolinha */}
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>{photo.title}</Text>
                <Text style={styles.date}>
                  📅 {new Date(photo.created_at).toLocaleDateString("pt-BR")}
                </Text>
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
  container: { 
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: { 
    ...StyleSheet.absoluteFillObject, 
  },
  backButton: { 
    position: "absolute", 
    bottom: 30, 
    left: 20, 
    right: 20, 
    backgroundColor: "#007AFF", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backText: { color: "#fff", fontWeight: "bold" },
  
  
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  markerBubble: {
    backgroundColor: "#fff",
    borderRadius: 25, 
    padding: 3,
    borderWidth: 2,
    borderColor: "#007AFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    resizeMode: "cover"
  },
  markerArrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007AFF", 
    borderWidth: 6,
    marginTop: -2,
  },

  callout: { 
    backgroundColor: "#fff", 
    padding: 10, 
    borderRadius: 8, 
    width: 140, 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#ccc" 
  },
  title: { fontWeight: "bold", fontSize: 13, textAlign: "center", color: "#333" },
  date: { fontSize: 11, color: "#666", marginTop: 2 }
});