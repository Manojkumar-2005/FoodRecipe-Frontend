import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({ totalRecipes: 0, userRecipes: 0 })

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const [totalRes, userRes] = await Promise.all([
        api.get('/api/recipes'),
        api.get('/api/recipes', { params: { createdBy: user._id } })
      ])
      setStats({
        totalRecipes: totalRes.data.pagination?.total || 0,
        userRecipes: userRes.data.pagination?.total || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🍳 Welcome to <span className="text-orange-500">Food Recipes</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover, share, and create amazing recipes from around the world
          </p>
        </motion.div>

        {user ? (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
                Hello, {user.name}! 👋
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Ready to explore some delicious recipes?
              </p>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">{stats.totalRecipes}</div>
                <div className="text-gray-600 dark:text-gray-300">Total Recipes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-500 mb-2">{stats.userRecipes}</div>
                <div className="text-gray-600 dark:text-gray-300">Your Recipes</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/recipes"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🍽️ Browse Recipes
              </Link>
              <Link
                to="/add-recipe"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ➕ Add New Recipe
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                Join Our Cooking Community
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Sign in to access thousands of recipes, share your own creations, and connect with fellow food enthusiasts.
              </p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
              >
                🚀 Get Started
              </Link>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Browse Recipes</h3>
                <p className="text-gray-600 dark:text-gray-300">Explore a vast collection of recipes from various cuisines</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Share Your Own</h3>
                <p className="text-gray-600 dark:text-gray-300">Add your favorite recipes and share them with the community</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Rate & Review</h3>
                <p className="text-gray-600 dark:text-gray-300">Rate recipes and leave comments to help others</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Dashboard
