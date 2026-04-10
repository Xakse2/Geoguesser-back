import fs from "fs";
import { ImageItem } from "./imageType";

const imagesPath = "./images-belarus-random.json";

function loadJSON<T>(path: string, fallback: T): T {
  if (!fs.existsSync(path)) return fallback;
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function calculateKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function checkDistans(
  guess: { lat: number; lng: number },
  startPointId: string
) {
  const data = loadJSON<{ region: string; images: ImageItem[] }>(imagesPath, {
    region: "Belarus",
    images: [],
  });

  const targetImage = data.images.find((img) => img.id === startPointId);

  if (!targetImage) {
    return { points: 0, distance: 0, error: "Image not found" };
  }

  const distance = calculateKm(
    guess.lat,
    guess.lng,
    targetImage.lat,
    targetImage.lng
  );
  let points = 0;
  if (distance <= 10) {
    points = 6000;
  } else if (distance < 6000) {
    points = Math.round(6000 * (1 - (distance - 10) / (6000 - 10)));
  }

  return {
    points: Math.max(0, points),
    distance: Math.round(distance * 100) / 100,
  };
}
