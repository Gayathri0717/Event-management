import { useSelector } from 'react-redux'
import { RootState } from '../store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function FavoritesPage() {
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true) // Runs only on client after mount
  }, [])

  if (!isMounted) {
    // Render nothing or a loader during SSR and first client render
    return null
  }
  return (
    <div>
      <header className="bg-[rgb(39,66,109)] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold flex flex-col-reverse items-center">EVENT MANAGEMENT</h1>
      </header> 
  
    <div className="min-h-screen p-6 bg-gray-100">

      <h1 className="text-2xl font-semibold text-center mb-6">YOUR WISHLIST</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">No favorites yet. Browse events and tap ❤️ to add.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(event => (
            <div key={event.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{event.location} • {event.category}</p>
              <p className="text-lg mt-2">₹{event.price}</p>
              <Link href={`/event/${event.id}`}>
                <button className="mt-4 px-4 py-2 bg-[rgb(39,66,109)] text-white rounded hover:bg-blue-700">
                  View More
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>  </div>
  )
}
