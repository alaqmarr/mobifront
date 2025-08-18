import axios from 'axios';
import { Brand, Series, Model, Product, ProductVariant } from '@/types';

const API_BASE = 'https://mobilinxbd.vercel.app/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await api.get('/brands');
  return response.data;
};

export const fetchBrand = async (id: string): Promise<Brand> => {
  const response = await api.get(`/brands/${id}`);
  return response.data;
};

export const fetchSeries = async (): Promise<Series[]> => {
  const response = await api.get('/series');
  return response.data;
};

export const fetchSeriesByBrand = async (brandId: string): Promise<Series[]> => {
  const response = await api.get(`/series?brandId=${brandId}`);
  return response.data;
};

export const fetchSingleSeries = async (id: string): Promise<Series> => {
  const response = await api.get(`/series/${id}`);
  return response.data;
};

export const fetchModels = async (): Promise<Model[]> => {
  const response = await api.get('/models');
  return response.data;
};

export const fetchModelsBySeries = async (seriesId: string): Promise<Model[]> => {
  const response = await api.get(`/models?seriesId=${seriesId}`);
  return response.data;
};

export const fetchSingleModel = async (id: string): Promise<Model> => {
  const response = await api.get(`/models/${id}`);
  return response.data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchProductVariants = async (): Promise<ProductVariant[]> => {
  const response = await api.get('/product-variants');
  return response.data;
};

export const fetchProductVariantsByModel = async (modelId: string): Promise<ProductVariant[]> => {
  const response = await api.get(`/product-variants?modelId=${modelId}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<{
  brands: Brand[];
  series: Series[];
  models: Model[];
  products: Product[];
  variants: ProductVariant[];
}> => {
  const [brands, series, models, products, variants] = await Promise.all([
    fetchBrands(),
    fetchSeries(),
    fetchModels(),
    fetchProducts(),
    fetchProductVariants(),
  ]);

  const searchTerm = query.toLowerCase();

  return {
    brands: brands.filter(item => item.name.toLowerCase().includes(searchTerm)),
    series: series.filter(item => item.name.toLowerCase().includes(searchTerm)),
    models: models.filter(item => item.name.toLowerCase().includes(searchTerm)),
    products: products.filter(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.sku.toLowerCase().includes(searchTerm)
    ),
    variants: variants.filter(item => item.name.toLowerCase().includes(searchTerm)),
  };
};