// components/AddToWishlist.tsx
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/features/wishlistSlice';
import { RootState } from '../store';
import { EventType } from '../store/features/eventSlice';

export default function AddToWishlist({ event }: { event: EventType }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlist.some(item => item.id === event.id);

  return (
    <button onClick={() => dispatch(toggleWishlist(event))}>
      {isWishlisted ? '❤️' : '🤍'}
    </button>
  );
}
