import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { toast } from 'react-toastify'
import RatingStars from './RatingStars'
import CommentSection from './CommentSection'
import FavoritesButton from './FavoritesButton'

const RecipeDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/api/recipes/${id}`)
      setRecipe(res.data)
      // Check if user has already rated this recipe
      if (user && res.data.ratings) {
        const userRate = res.data.ratings.find(r => r.user._id === user._id)
        if (userRate) setUserRating(userRate.rating)
      }
    } catch (error) {
      console.error('Failed to fetch recipe', error)
      toast.error('Failed to load recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = async (rating) => {
    if (!user) {
      toast.error('Please login to rate recipes')
      return
    }

    try {
      const response = await api.post(`/api/recipes/${id}/rating`, { rating })
      setUserRating(rating)
      setRecipe(prev => ({
        ...prev,
        averageRating: response.data.averageRating
      }))
      toast.success('Rating submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit rating')
      console.error(error)
    }
  }

  const handleCommentAdded = (updatedComments) => {
    setRecipe(prev => ({
      ...prev,
      comments: updatedComments
    }))
  }

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/api/recipes/${id}`)
      toast.success('Recipe deleted successfully!')
      // Redirect to recipes page
      window.location.href = '/recipes'
    } catch (error) {
      toast.error('Failed to delete recipe')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Recipe not found</h1>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
            {recipe.category}
          </span>
          {recipe.cookingTime > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              ⏱️ {recipe.cookingTime} min
            </span>
          )}
          {recipe.averageRating && (
            <div className="flex items-center space-x-2">
              <RatingStars rating={parseFloat(recipe.averageRating)} readonly size="text-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({recipe.ratings?.length || 0} ratings)
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Created by: {recipe.createdBy?.name || 'Anonymous'}
          </p>
          <div className="flex items-center space-x-2">
            {user && recipe.createdBy?._id === user._id && (
              <button
                onClick={handleDeleteRecipe}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
              >
                Delete Recipe
              </button>
            )}
            <FavoritesButton recipeId={recipe._id} />
          </div>
        </div>
      </motion.div>

      {/* Image */}
      {recipe.image && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <LazyLoadImage
            src={recipe.image}
            alt={recipe.title}
            effect="blur"
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ingredients</h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans">
                {recipe.ingredients}
              </pre>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instructions</h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans">
                {recipe.instructions}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rating Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
      >
        <h3 className="text-xl font-bold mb-4">Rate this Recipe</h3>
        <div className="flex items-center space-x-4">
          <RatingStars
            rating={userRating}
            onRatingChange={handleRatingChange}
            readonly={!user}
          />
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userRating ? 'Your rating' : 'Click to rate'}
            </span>
          )}
          {!user && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Login to rate this recipe
            </span>
          )}
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <CommentSection
          recipeId={recipe._id}
          comments={recipe.comments || []}
          onCommentAdded={handleCommentAdded}
        />
      </motion.div>
    </motion.div>
  )
}

export default RecipeDetail
