import { MetadataRoute } from 'next'
import recipes from '@/data/recipes.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myryouri.com'  // ここを変更

  const recipeUrls = recipes.map((recipe: any) => ({
    url: `${baseUrl}/recipe/${recipe.id}`,
    lastModified: new Date('2026-05-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...recipeUrls,
  ]
}