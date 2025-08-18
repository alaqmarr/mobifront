export interface Brand {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  brand?: Brand;
}

export interface Model {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  seriesId: string;
  series?: Series;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  image?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  product?: Product;
  modelId: string;
  model?: Model;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}