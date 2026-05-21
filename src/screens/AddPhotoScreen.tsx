import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { insertPhoto } from "../repositories/photosRepository";

interface AddPhotoScreenProps {
  onNavigateBack: () => void;
}

export default function AddPhotoScreen({ onNavigateBack }: AddPhotoScreenProps) {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  const handleLaunchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão Negada", "É necessário acesso à câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  
  const handleSelectFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão Negada", "É necessário acesso à galeria de fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Por favor, informe o título.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Erro", "Escolha ou tire uma foto primeiro.");
      return;
    }

    setLoading(true);
    try {

      const locationPerm = await Location.requestForegroundPermissionsAsync();
      let lat = null, lon = null;

      if (locationPerm.granted) {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      } else {
        Alert.alert("Aviso", "Foto salva sem coordenadas porque a localização foi negada.");
      }

     
      insertPhoto({ title, imageUri, latitude: lat, longitude: lon });
      Alert.alert("Sucesso", "Dados persistidos no SQLite!");
      onNavigateBack();
    } catch (err: any) {
      Alert.alert("Erro ao salvar", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>➕ Adicionar Nova Imagem</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Informe o título..." 
        value={title} 
        onChangeText={setTitle} 
      />

      <View style={styles.mediaButtonsContainer}>
        <TouchableOpacity style={[styles.mediaButton, { backgroundColor: "#5856D6" }]} onPress={handleLaunchCamera}>
          <Text style={styles.mediaButtonText}>📸 Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mediaButton, { backgroundColor: "#FF9500" }]} onPress={handleSelectFromLibrary}>
          <Text style={styles.mediaButtonText}>🖼️ Escolher Galeria</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Imagem selecionada:</Text>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>
      )}

      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Salvar no SQLite</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onNavigateBack}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  mediaButtonsContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  mediaButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  mediaButtonText: { color: "#fff", fontWeight: "bold" },
  previewContainer: { alignItems: "center", marginBottom: 20 },
  previewText: { fontSize: 14, color: "#666", marginBottom: 5 },
  previewImage: { width: "100%", height: 180, borderRadius: 8, resizeMode: "cover" },
  actionContainer: { gap: 10, marginTop: "auto", marginBottom: 20 },
  btn: { padding: 15, borderRadius: 8, alignItems: "center" },
  saveBtn: { backgroundColor: "#34C759" },
  cancelBtn: { backgroundColor: "#FF3B30" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});