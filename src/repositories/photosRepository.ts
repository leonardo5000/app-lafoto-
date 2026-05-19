import { db } from "../db/database";

export type Photo = {
  id: number;
  title: string;
  image_uri: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

type NewPhotoInput = {
  title: string;
  imageUri: string;
  latitude: number | null;
  longitude: number | null;
};

export function insertPhoto(input: NewPhotoInput): void {
  if (!input.title.trim() || !input.imageUri) {
    throw new Error("Título e Imagem são obrigatórios.");
  }

  const stmt = db.prepareSync(`
    INSERT INTO photos (title, image_uri, latitude, longitude, created_at)
    VALUES ($title, $image_uri, $latitude, $longitude, $created_at)
  `);

  try {
    stmt.executeSync({
      $title: input.title,
      $image_uri: input.imageUri,
      $latitude: input.latitude,
      $longitude: input.longitude,
      $created_at: new Date().toISOString(),
    });
  } finally {
    stmt.finalizeSync();
  }
}

export function listPhotos(): Photo[] {
  try {
    return db.getAllSync<Photo>(`
      SELECT id, title, image_uri, latitude, longitude, created_at
      FROM photos
      ORDER BY created_at DESC
    `);
  } catch (error) {
    console.error("Erro ao listar fotos:", error);
    return [];
  }
}

export function deletePhoto(id: number): void {
  db.runSync(`DELETE FROM photos WHERE id = ?`, [id]);
}