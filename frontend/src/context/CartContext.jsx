import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'brew-umber-cart'

const CartContext = createContext(null)

// Read the saved cart once, safely (handles missing / corrupted data and blocked storage)
const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart)

  // Save every change so the cart survives navigation and page reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      /* storage full or blocked - cart still works for this session */
    }
  }, [cart])

  // Keep multiple open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCart(loadCart())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addToCart = useCallback((drink) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.title === drink.title)
      if (existing) {
        return prev.map((item) =>
          item.title === drink.title ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      // Store only what the cart and checkout need
      const { id, title, image, price, description } = drink
      return [...prev, { id, title, image, price, description, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((title, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.title === title
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    )
  }, [])

  const removeFromCart = useCallback((title) => {
    setCart((prev) => prev.filter((item) => item.title !== title))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0),
    [cart]
  )

  const value = useMemo(
    () => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }),
    [cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
