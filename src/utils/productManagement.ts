import type { ProductRecord } from "@/types/product";

export type ImageFilter = "all" | "with-image" | "without-image";
export type StockFilter = "all" | "out-of-stock" | "low-stock" | "in-stock";
export const LOW_STOCK_THRESHOLD = 10;

export const isValidImageDataUrl = (value: string) => /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
export const applyImageFilter = (products: ProductRecord[], filter: ImageFilter) => filter === "all" ? products : products.filter((product) => filter === "with-image" ? isValidImageDataUrl(product.image) : !isValidImageDataUrl(product.image));
export const applyStockFilter = (products: ProductRecord[], filter: StockFilter) => filter === "all" ? products : products.filter((product) => filter === "out-of-stock" ? product.soluong === 0 : filter === "low-stock" ? product.soluong > 0 && product.soluong < LOW_STOCK_THRESHOLD : product.soluong >= LOW_STOCK_THRESHOLD);
export const toggleSelectedId = (ids: Set<string>, id: string) => { const next = new Set(ids); next.has(id) ? next.delete(id) : next.add(id); return next; };
export const selectPageIds = (ids: Set<string>, pageIds: string[], selected: boolean) => { const next = new Set(ids); pageIds.forEach((id) => selected ? next.add(id) : next.delete(id)); return next; };
export const normalizeProductName = (name: string) => name.trim().replace(/\s+/g, " ");
export const formatVnd = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
