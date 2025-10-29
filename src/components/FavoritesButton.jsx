import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { toast } from 'react-toastify';

const FavoritesButton = ({ recipeId, initialIsFavorite = false }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/recipes/${recipeId}/favorite`);
      setIsFavorite(response.data.isFavorite);
      toast.success(
        response.data.isFavorite
          ? 'Added to favorites!'
          : 'Removed from favorites'
      );
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        isFavorite
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        className="w-5 h-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
      <span className="hidden sm:inline">
        {loading ? 'Updating...' : isFavorite ? 'Favorited' : 'Add to Favorites'}
      </span>
    </motion.button>
  );
};

export default FavoritesButton;
