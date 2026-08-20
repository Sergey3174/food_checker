import { Menu, ShoppingCart } from "lucide-react";
import { useGetProfileQuery } from "../api/baseApi";

export function Header() {
  const { data: profile } = useGetProfileQuery();
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const displayName = fullName || profile?.tg_username || profile?.email || "Food";

  return (
    <header className="p-4 flex items-center justify-between">
      <Menu />
      <h1 className="font-serif text-2xl">{displayName}</h1>
      <div className="relative">
        <ShoppingCart />
        <b className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#d8ebb8] text-[10px] text-[#173020]">
          2
        </b>
      </div>
    </header>
  );
}
