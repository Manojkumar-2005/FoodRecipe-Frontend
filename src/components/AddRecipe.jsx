import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import api from '../services/api'
import { toast } from 'react-toastify'

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: '',
    cookingTime: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setImage(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!formData.title.trim() || !formData.ingredients.trim() || !formData.instructions.trim() || !formData.category) {
      toast.error('Please fill in all required fields')
      setLoading(false)
      return
    }

    const data = new FormData()
    data.append('title', formData.title.trim())
    data.append('ingredients', formData.ingredients.trim())
    data.append('instructions', formData.instructions.trim())
    data.append('category', formData.category)
    if (formData.cookingTime) data.append('cookingTime', formData.cookingTime)
    if (image) data.append('image', image)

    try {
      const response = await api.post('/api/recipes/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.success) {
        toast.success('Recipe added successfully!')
        navigate('/recipes')
      } else {
        toast.error(response.data.message || 'Failed to add recipe')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add recipe. Please try again.'
      toast.error(errorMessage)
      console.error('Add recipe error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8"
    >
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🍳 Add New Recipe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your culinary masterpiece with the community
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Ingredients</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows="4"
            placeholder="List ingredients, one per line..."
            className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Step-by-step instructions..."
            className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Cooking Time (min)</label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Drag & Drop Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipe Image</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="space-y-2">
                <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click or drag to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  {isDragActive ? 'Drop the image here...' : 'Drag & drop an image, or click to select'}
                </p>
              </div>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-semibold text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Adding Recipe...
            </div>
          ) : (
            '🍳 Add Recipe'
          )}
        </motion.button>
        </motion.form>
      </div>
    </motion.div>
  )
}

export default AddRecipe
