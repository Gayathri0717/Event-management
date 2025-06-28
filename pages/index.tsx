import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { fetchEvents, EventType } from '../store/features/eventSlice'
import { setCategory, setLocation, clearFilters } from '../store/features/filterSlice'
import { useEffect, useState } from 'react'
import AddToWishlist from './AddToWishlist'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useSession, signOut } from "next-auth/react";

export default function Home() {

  const dispatch = useDispatch<AppDispatch>()
  const { list, status } = useSelector((state: RootState) => state.events)
  const { category, location } = useSelector((state: RootState) => state.filter)
  const router = useRouter()
  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])
  const [menuOpen, setMenuOpen] = useState(false)
  // Filter events based on category/location filter
  const filteredEvents = list.filter(event => {
    return (
      (category ? event.category === category : true) &&
      (location ? event.location === location : true)
    )
  })
  const { data: session } = useSession();

  // Unique categories and locations for dropdowns
  const categories = Array.from(new Set(list.map(e => e.category)))
  const locations = Array.from(new Set(list.map(e => e.location)))

  return (
    <div>
      <header className="bg-[rgb(39,66,109)]  text-white py-4 px-6 shadow-md relative flex justify-center items-center">
        {/* Centered Title */}
        <h1 className="text-2xl font-bold">EVENT MANAGEMENT</h1>

        {/* Hamburger Icon on Right */}
        <div className="absolute right-6">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-50">
              {!session?.user ? (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Signup
                  </Link></>) : (
                <button onClick={() => {
                  signOut({ callbackUrl: "/" }); // logs out and redirects
                  setMenuOpen(false);
                }} className='block px-4 py-2 hover:bg-gray-100'>Logout</button>
              )}
              <Link
                href="/favorites"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Wishlist 
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Cart 🛒
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="min-h-screen bg-gray-100 p-6">



        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <select
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            value={location}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            className="p-2 border rounded"
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <button
            onClick={() => dispatch(clearFilters())}
            className="px-3 py-1 bg-[rgb(39,66,109)] text-white rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>




        {status === 'loading' && <p>Loading...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event: EventType) => (
            <div key={event.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <AddToWishlist event={event} />
              </div>
              <p className="text-gray-600">{event.location} • {event.category}</p>
              <p className="text-lg  mt-2">₹{event.price}</p>
              <div onClick={() => router.push(`/event/${event.id}`)}>
                <button className="mt-4 px-4 py-2 bg-[rgb(39,66,109)] text-white rounded hover:bg-[rgb(87 133 207)]">
                  View More
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>    </div>
  )
}
