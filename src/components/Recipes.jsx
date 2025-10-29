import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import api from '../services/api'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [cookingTime, setCookingTime] = useState('')
  const [rating, setRating] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRecipes()
  }, [search, category, ingredients, cookingTime, rating, page])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (search) params.search = search
      if (category) params.category = category
      if (ingredients) params.ingredients = ingredients
      if (cookingTime) params.cookingTime = cookingTime
      if (rating) params.rating = rating
      const res = await api.get('/api/recipes', { params })
      setRecipes(res.data.recipes)
      setPagination(res.data.pagination)
    } catch (error) {
      console.error('Failed to fetch recipes', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setIngredients('')
    setCookingTime('')
    setRating('')
    setPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Recipes</h1>

      {/* Advanced Filters */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🔍 Filter Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-3 text-gray-400">🔍</span>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">All Categories</option>
            <option value="Breakfast">🥞 Breakfast</option>
            <option value="Lunch">🥗 Lunch</option>
            <option value="Dinner">🍽️ Dinner</option>
            <option value="Dessert">🍰 Dessert</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by ingredients..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-3 text-gray-400">🥕</span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Max cooking time (min)"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-3 text-gray-400">⏱️</span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Min rating (1-5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              step="0.1"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-3 text-gray-400">⭐</span>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            🗑️ Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {recipe.image && (
                  <LazyLoadImage
                    src={recipe.image}
                    alt={recipe.title}
                    effect="blur"
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-bold mb-2 truncate">{recipe.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{recipe.category}</p>
                {recipe.cookingTime > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">⏱️ {recipe.cookingTime} min</p>
                )}
                {recipe.averageRating && (
                  <p className="text-sm text-yellow-500 mb-2">⭐ {recipe.averageRating}</p>
                )}
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  View Recipe →
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-8 space-x-2"
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Next
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default Recipes
