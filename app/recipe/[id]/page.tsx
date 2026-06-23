import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import recipes from '@/data/recipes.json'
import RecipeClient from './RecipeClient'

type Recipe = {
  id: number
  name: string
  sub: string
  genre: string
  ingredients: string[]
  time: number
  easy: boolean
  img?: string
  fallback: string
  ing: string[]
  steps: string[]
}

const RECIPES: Recipe[] = recipes as Recipe[]

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ id: String(r.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const recipe = RECIPES.find((r) => r.id === Number(id))
  if (!recipe) return {}

  const mainIngs = recipe.ing.filter(i => !i.startsWith('──')).slice(0, 3).map(i => i.split(' ')[0]).join('・')
  const description = `基本的な${recipe.name}の作り方を紹介。料理しながら片手でサクサク確認できるMyRyouriで、${mainIngs}を使った定番レシピを${recipe.sub}でご覧いただけます。`

  return {
    title: `${recipe.name} のレシピ・作り方 | MyRyouri`,
    description,
    openGraph: {
      title: `${recipe.name} のレシピ・作り方 | MyRyouri`,
      description,
      type: 'article',
      siteName: 'MyRyouri',
      locale: 'ja_JP',
      ...(recipe.img ? { images: [`https://myryouri.com/${recipe.img}`] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.name} のレシピ | MyRyouri`,
      description,
    },
  }
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params
  const recipe = RECIPES.find((r) => r.id === Number(id))
  if (!recipe) notFound()

  const timeParts = recipe.sub.match(/(\d+)分/)
  const cookMins = timeParts ? parseInt(timeParts[1]) : 30
  const servings = recipe.sub.match(/(\d+)人分/)?.[1] ?? '2'

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.name,
    image: recipe.img ? [`https://myryouri.com/${recipe.img}`] : [],
    author: { '@type': 'Organization', name: 'MyRyouri' },
    datePublished: '2026-05-15',
    description: `${recipe.name}の作り方。${recipe.sub}`,
    prepTime: 'PT10M',
    cookTime: `PT${cookMins}M`,
    totalTime: `PT${cookMins + 10}M`,
    recipeYield: `${servings}人前`,
    recipeCategory: '主菜',
    recipeCuisine: recipe.genre,
    recipeIngredient: recipe.ing.filter((i) => !i.startsWith('──')),
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      text: s,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeClient recipe={recipe} allRecipes={RECIPES} />
    </>
  )
}
