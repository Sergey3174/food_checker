import { Heart, Home, Leaf, Sun, User } from "lucide-react";

export function BottomNavigation() {
  return (
    <nav className="fixed right-4 bottom-3 left-4 flex justify-around rounded-2xl home-card bg-linear-to-tr from-white/10 to-white/20 py-4 text-[10px]  backdrop-blur-[2px]">
      <span className="flex flex-col items-center gap-1 text-[#dcedbb]">
        <Home size={24} />
        Home
      </span>
      <span className="flex flex-col items-center gap-1">
        <Leaf size={24} />
        Plants
      </span>
      <span className="flex flex-col items-center gap-1">
        <Sun size={24} />
        Care
      </span>
      <span className="flex flex-col items-center gap-1">
        <Heart size={24} />
        Wishlist
      </span>
      <span className="flex flex-col items-center gap-1">
        <User size={24} />
        Profile
      </span>
    </nav>
  );
}
