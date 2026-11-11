import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { PRODUCT_COLLECTION, type ProductRecord } from "@/types/product";

type ProductsState = { products: ProductRecord[]; loading: boolean; error: string | null };
const emptyState: ProductsState = { products: [], loading: true, error: null };

export function useProducts() {
  const [state, setState] = useState<ProductsState>(emptyState);
  useEffect(() => {
    if (!db) { setState({ products: [], loading: false, error: "Firebase chưa được cấu hình." }); return undefined; }
    return onSnapshot(collection(db, PRODUCT_COLLECTION), (snapshot) => {
      const products = snapshot.docs.map((document) => {
        const data = document.data();
        return { id: document.id, name: String(data.name ?? ""), price: typeof data.price === "number" ? data.price : 0, soluong: typeof data.soluong === "number" ? data.soluong : 0, image: String(data.image ?? "") } satisfies ProductRecord;
      });
      setState({ products, loading: false, error: null });
    }, (error) => setState({ products: [], loading: false, error: error.code === "permission-denied" ? "Bạn chưa có quyền đọc sản phẩm." : "Không thể tải sản phẩm. Vui lòng kiểm tra mạng." }));
  }, []);
  return state;
}
