import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

const MAX_IMAGE_CHARACTERS = 900_000;
const MAX_IMAGE_EDGE = 200;
const SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

export class ProfileImageError extends Error {}

/** Selects, resizes and compresses an image locally. No file is uploaded. */
export async function pickAndPrepareProfileImage(): Promise<string | null> {
  try {
    if (Platform.OS !== "web") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        throw new ProfileImageError("Cần quyền truy cập thư viện ảnh để chọn ảnh đại diện.");
      }
    }

    const selection = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    if (selection.canceled) return null;
    const asset = selection.assets[0];
    if (!asset) {
      throw new ProfileImageError("Không nhận được tệp ảnh đã chọn.");
    }
    if (asset.mimeType && !SUPPORTED_MIME_TYPES.has(asset.mimeType.toLowerCase())) {
      throw new ProfileImageError("Chỉ hỗ trợ ảnh JPG hoặc PNG.");
    }

    const resize = asset.width >= asset.height
      ? { width: MAX_IMAGE_EDGE }
      : { height: MAX_IMAGE_EDGE };
    const processed = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize }],
      { base64: true, compress: 0.72, format: ImageManipulator.SaveFormat.JPEG },
    );

    if (!processed.base64) {
      throw new ProfileImageError("Không thể chuyển đổi ảnh sang Base64.");
    }

    const dataUrl = `data:image/jpeg;base64,${processed.base64}`;
    if (dataUrl.length > MAX_IMAGE_CHARACTERS) {
      throw new ProfileImageError("Ảnh sau khi nén vẫn quá lớn. Hãy chọn ảnh khác nhỏ hơn.");
    }
    return dataUrl;
  } catch (error) {
    if (error instanceof ProfileImageError) throw error;
    throw new ProfileImageError("Không thể xử lý ảnh đã chọn. Hãy thử một ảnh JPG hoặc PNG khác.");
  }
}

export const PROFILE_IMAGE_MAX_CHARACTERS = MAX_IMAGE_CHARACTERS;
export const PROFILE_IMAGE_MAX_EDGE = MAX_IMAGE_EDGE;
