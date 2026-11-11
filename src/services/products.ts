import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { PRODUCT_COLLECTION, type ProductProfile } from "@/types/product";
import { PROFILE_IMAGE_MAX_CHARACTERS } from "@/utils/profileImage";
import { normalizeProductName } from "@/utils/productManagement";

export type ProductFormValues = { name: string; price: string; soluong: string; image: string };
export class ProductServiceError extends Error {}

function assertAdminSession() {
  if (!auth?.currentUser) throw new ProductServiceError("Phiên đăng nhập Admin đã hết hạn. Vui lòng đăng nhập lại.");
  if (!db) throw new ProductServiceError("Firebase chưa được cấu hình.");
  return db;
}

function toProduct(values: ProductFormValues): ProductProfile {
  const name = normalizeProductName(values.name);
  const rawPrice = values.price.trim();
  const rawQuantity = values.soluong.trim();
  const price = Number(values.price);
  const soluong = Number(values.soluong);
  if (!name) throw new ProductServiceError("Tên sản phẩm là bắt buộc.");
  if (name.length > 160) throw new ProductServiceError("Tên sản phẩm không được vượt quá 160 ký tự.");
  if (!rawPrice || !Number.isFinite(price) || price < 0) throw new ProductServiceError("Giá sản phẩm phải là số lớn hơn hoặc bằng 0.");
  if (!rawQuantity || !Number.isInteger(soluong) || soluong < 0) throw new ProductServiceError("Số lượng phải là số nguyên lớn hơn hoặc bằng 0.");
  if (values.image.length > PROFILE_IMAGE_MAX_CHARACTERS) throw new ProductServiceError("Ảnh sản phẩm vượt quá giới hạn cho phép.");
  return { name, price, soluong, image: values.image };
}

async function assertNameAvailable(name: string, exceptId?: string) {
  const firestore = assertAdminSession();
  const existing = await getDocs(query(collection(firestore, PRODUCT_COLLECTION), where("name", "==", name)));
  if (existing.docs.some((item) => item.id !== exceptId)) throw new ProductServiceError("Tên sản phẩm này đã tồn tại.");
}

export async function checkProductNameAvailability(rawName: string, exceptId?: string) {
  const name = normalizeProductName(rawName);
  if (!name) throw new ProductServiceError("Tên sản phẩm là bắt buộc.");
  await assertNameAvailable(name, exceptId);
  return name;
}

export async function createProduct(values: ProductFormValues) {
  const firestore = assertAdminSession();
  const product = toProduct(values);
  await assertNameAvailable(product.name);
  await addDoc(collection(firestore, PRODUCT_COLLECTION), product);
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const firestore = assertAdminSession();
  const product = toProduct(values);
  await assertNameAvailable(product.name, id);
  await updateDoc(doc(firestore, PRODUCT_COLLECTION, id), product);
}

export async function removeProduct(id: string) { await deleteDoc(doc(assertAdminSession(), PRODUCT_COLLECTION, id)); }
export async function removeProducts(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  const results = await Promise.allSettled(uniqueIds.map(removeProduct));
  return { deletedIds: uniqueIds.filter((_, index) => results[index].status === "fulfilled"), failedIds: uniqueIds.filter((_, index) => results[index].status === "rejected") };
}
