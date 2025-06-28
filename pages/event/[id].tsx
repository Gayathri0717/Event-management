import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useEffect, useState } from "react";
import { fetchEvents, setbold } from "../../store/features/eventSlice";
import { addToCart } from "../../store/features/cartSlice";
import { useSession } from "next-auth/react";
import { fetchReviews,postReview } from "../../store/features/reviewSlice";
import dynamic from 'next/dynamic';
import Chatbot from '../../components/SimpleChatbot'
const Eventmap = dynamic(() => import('../../components/EventMap'), { ssr: false });

interface Review {
  _id?: string | number | null;
  user: string;
  rating: number;
  comment: string;
  createdAt?: string;
}
type all={
  username:string;
  id:number;
  
}
export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  
  const { data: session } = useSession();

  const { list,boll } = useSelector((state: RootState) => state.events);
  const reviews = useSelector((state: RootState) => state.review.reviews);

  const[bol2,setbol2]=useState(false)
const event = list.find((e) => String(e.id) === String(id));
console.log(event)
const[all,setall]=useState<all[]>([{
  username:"admin",
  id:1
}])

  const [loadingReviews, setLoadingReviews] = useState(false);
console.log(boll,bol2);
  // For review form
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loc, setLoc] = useState(false);
  // Fetch events if not loaded
  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, list]);

useEffect(() => {
  if (id) {
    dispatch(fetchReviews(id as string));
  }
}, [dispatch, id]);

  if (!event) return <p className="text-center mt-10">Loading event...</p>;

  // Handle review form submit
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setbol2(true)
    
        dispatch(setbold(true))
    if (!session?.user) {
      setSubmitError("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Please write a comment");
      return;
    }
if (!event || !event.title) {
  setSubmitError("Event not loaded yet. Please wait a moment and try again.");
  return;
}

  try {
    await dispatch(
      postReview({
        eventId: id,
       EventName: event.title,
        user: session.user.name || "Anonymous",
        rating,
        comment,
      })
    ).unwrap(); // unwrap() to handle errors nicely

    setSubmitSuccess("Review submitted successfully");
    setComment("");
    setRating(2);

    dispatch(fetchReviews(id as string)); // refresh reviews
  } catch (err) {
    setSubmitError("Something went wrong while submitting review");
  }

      
  }
console.log(reviews)
  return (
    <div className=""> <header className="bg-[rgb(39,66,109)] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold flex flex-col-reverse items-center">EVENT MANAGEMENT</h1>
      </header> 
<div className="flex flex-row justify-around">

    <div className="w-[50%] ml-[74px] p-6">
      <div className="flex flex-row justify-between">
      
        <div>
      <h1 className="text-3xl font-bold mb-4 ">{event.title}</h1></div>  <div>
          <button     onClick={() => setShowChat(!showChat)} >CHAT</button>
     
        </div></div>
      <p className="text-gray-600 mb-2">
        {event.location} • {event.category}
      </p>
      <p className="text-xl mb-4">Price: ₹{event.price}</p>
   <p className="text-[18px] mb-4">Description: {event.description}</p>
      <button
        className="bg-[rgb(39,66,109)] text-white px-4 py-2 rounded hover:bg-gray-700 mb-8"
        onClick={() => {
          dispatch(addToCart(event));
          router.push("/cart");
        }}
      >
        Add to Cart & Book
      </button>
 <button onClick={() => setLoc(!loc)}>Locations</button>

{loc && (
  event.latitude && event.longtitude &&
  !isNaN(Number(event.latitude)) &&
  !isNaN(Number(event.longtitude)) ? (
    <Eventmap 
      lat={Number(event.latitude)} 
      lng={Number(event.longtitude)} 
      eventName={event.title} 
    />
  ) : (
    <p className="text-red-500">Map cannot be loaded due to missing coordinates.</p>
  )
)}



  
      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded p-4 mb-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{review.user}</p>
                <p className="text-yellow-500">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </p>
              </div>
              <p className="mt-2">{review.comment}</p>
           
            </div>
          ))
        )}
      </section>
 
      {/* Submit Review Form */}
      {event && session?.user && (
        <section className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              placeholder="Your review"
              className="w-full border rounded p-2 mb-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <select
              className="w-full border rounded p-2 mb-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-[rgb(39,66,109)] text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
            {submitError && (
              <p className="text-red-600 mt-2">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-green-600 mt-2">{submitSuccess}</p>
            )}
          </form>
        </section>
      )}

      {!session?.user && (
        <p className="mt-6 text-gray-600">Login to write a review.</p>
      )}
    </div>  <div>        {showChat && (
  <div className="mt-[32px]">
    <Chatbot />
  </div>
)}</div></div></div>
  );
}
