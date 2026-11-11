export const PRODUCT_COLLECTION = "products";

export interface ProductProfile {
  name: string;
  price: number;
  soluong: number;
  image: string;
}

/** Firestore document ID is metadata and is never stored in the document. */
export interface ProductRecord extends ProductProfile {
  id: string;
}
