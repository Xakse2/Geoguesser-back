import fs from "fs";
import { ImageItem } from "../util/imageType";

const images = "./images-belarus-random.json";

function loadJSON<T>(path: string, fallback: T): T {
  if (!fs.existsSync(path)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

export function getRandomImage(): ImageItem | null {
  const data = loadJSON<{ region: string; images: ImageItem[] }>(images, {
    region: "Belarus",
    images: [],
  });

  if (data.images.length === 0) {
    return null;
  }

  const random = Math.floor(Math.random() * data.images.length);
  return data.images[random];
}
