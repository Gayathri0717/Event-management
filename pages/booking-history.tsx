import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useDispatch } from 'react-redux'
import jsPDF from 'jspdf'
import { useEffect,useState} from 'react'
import { fetchBookings ,BookingState} from '@/store/features/bookingSlice'
import { AppDispatch } from '../store'
import { useSession } from "next-auth/react";
import { CartItem } from '@/store/features/cartSlice'
export default function BookingHistory() {
 const { history, status } = useSelector((state: RootState) => state.booking)
   const dispatch = useDispatch<AppDispatch>()
    const { data: session } = useSession();
useEffect(() => {
  if(session?.user?.email){
 dispatch(fetchBookings(session.user.email))
  }
   
  }, [dispatch,session])
  // const downloadReceipt = (booking: CartItem, index: number) => {
  //   const doc = new jsPDF()
  //   doc.setFontSize(20)
  //   doc.text(`Booking Receipt #${index + 1}`, 10, 20)
  //   doc.setFontSize(12)

  //   let y = 40
  //   booking.forEach(item => {
  //     doc.text(`${item.title} - ₹${item.price} x ${item.quantity}`, 10, y)
  //     y += 10
  //   })

  //   const total = booking.reduce((sum, item) => sum + item.price * item.quantity, 0)
  //   doc.text(`Total: ₹${total}`, 10, y + 10)

  //   doc.save(`BookingReceipt_${index + 1}.pdf`)
  // }
const downloadReceipt = (booking: CartItem, index: number) => {
  const doc = new jsPDF()
  doc.setFontSize(20)
  doc.text(`Booking Receipt #${index + 1}`, 10, 20)
  doc.setFontSize(12)

  const y = 40
  doc.text(`${booking.title} - ₹${booking.price} x ${booking.quantity}`, 10, y)

  const total = booking.price * booking.quantity
  doc.text(`Total: ₹${total}`, 10, y + 10)

  doc.save(`BookingReceipt_${index + 1}.pdf`)
}

  if (history.length === 0) return <p className="text-center mt-10">No past bookings.</p>

  return (
    <div>
      <header className="bg-[rgb(39,66,109)] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold flex flex-col-reverse items-center">EVENT MANAGEMENT</h1>
      </header> 
  
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">BOOKING HISTORY</h1>

      {history.map((booking, i) => (
        <div key={i} className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Booking #{i + 1}</h2>
      
            <p key={booking.id}>
              {booking.title} - ₹{booking.price} x {booking.quantity}
            </p>
      
       
          <button
            onClick={() => downloadReceipt(booking, i)}
            className="mt-2 px-3 py-1 bg-[rgb(39,66,109)] text-white rounded hover:bg-blue-700"
          >
            Download Receipt (PDF)
          </button>
        </div>
  
      ))}
    </div>  </div>
  )
}
