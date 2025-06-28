import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { removeFromCart, clearCart } from '../store/features/cartSlice'
import { postBookings } from '../store/features/bookingSlice'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()
  const { items } = useSelector((state: RootState) => state.cart)
  const bookingHistory = useSelector((state: RootState) => state.booking.history)
  const router = useRouter()

  // useEffect(() => {
  //   // Load bookings from localStorage on mount
  //   const saved = localStorage.getItem('bookingHistory')
  //   if (saved) {
  //     dispatch(loadBookings(JSON.parse(saved)))
  //   }
  // }, [dispatch])

  // useEffect(() => {
  //   // Save bookings to localStorage on change
  //   localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))
  // }, [bookingHistory])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [submitError, setSubmitError] = useState("");
  const { data: session } = useSession();
  async function handlesesion(e: React.FormEvent) {
    if (!session?.user) {
      setSubmitError("Please login to submit a review");
      return;
    }
  }
  console.log(postBookings)
  return (
    <div>
      <header className="bg-[rgb(39,66,109)] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold flex flex-col-reverse items-center">EVENT MANAGEMENT</h1>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">YOUR BOOKING CARRT</h1>

        {items.length === 0 ? (
          <p>No events added yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-6">
              <p className="text-xl font-bold">Total: ₹{total}</p>

              {session?.user && (
                <button
                  className="mt-4 bg-[rgb(39,66,109)] text-white px-6 py-2 rounded hover:bg-blue-700"
                  onClick={async () => {
                    if (!session.user.email) {
                      alert("Session error. Please log in again.");
                      return;
                    }
                    handlesesion
                    try {
                      const result = await dispatch(postBookings({
                        items: items,
                        userEmail: session.user.email,
                        userName: session.user.name,
                      })).unwrap();  // unwrap gets the actual response or throws an error

                      console.log(" Booking API response:", result);
                      dispatch(clearCart())
                      // send confirmation email
                      await fetch('/api/send-confirmation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: session.user.email,
                          name: session.user.name,
                          items,
                        }),
                      });

                      alert('Booking Confirmed and Email Sent! 🎉')
                      router.push('/booking-history')
                      router.push('/booking-history')
                    } catch (error) {
                      console.error("Booking failed:", error);
                      alert("Failed to confirm booking.");
                    }
                  }}
                >
                  Confirm Booking
                </button>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
