import LandingPage from '@/components/Home'
import { fetchBrands, fetchModels, fetchProducts, fetchProductVariants, fetchSeries } from '@/lib/api'
import React from 'react'

const page = async () => {
  const brands = await fetchBrands()
  const series = await fetchSeries()
  const models = await fetchModels()
  const products = await fetchProducts()
  const variants = await fetchProductVariants()

  return (
    <LandingPage
      brands={brands}
      series={series}
      models={models}
      products={products}
      variants={variants}
    />
  )
}

export default page
