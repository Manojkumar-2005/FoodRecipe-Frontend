import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Navbar = ({ user }) => {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:scale-105 transition-transform flex items-center space-x-2">
            <span className="text-3xl">🍳</span>
            <span>Food Recipes</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/recipes" className="hover:text-orange-200 transition-colors font-medium">
              Recipes
            </Link>
            {user ? (
              <>
                <Link to="/add-recipe" className="hover:text-orange-200 transition-colors font-medium">
                  Add Recipe
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-100">Welcome, {user.name}!</span>
                  <button
                    onClick={logout}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/recipes"
                className="hover:text-orange-200 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
              {user ? (
                <>
                  <Link
                    to="/add-recipe"
                    className="hover:text-orange-200 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Recipe
                  </Link>
                  <div className="text-orange-100 py-2">Welcome, {user.name}!</div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
