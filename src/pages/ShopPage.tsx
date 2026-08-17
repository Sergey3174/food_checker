import {
  ArrowRight,
  Flower2,
  Heart,
  Leaf,
  PawPrint,
  Search,
  SlidersHorizontal,
  Sprout,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { Header } from "../components/Header";
import FLOW from "../assets/images/zz-plant.png";
import FLOW2 from "../assets/images/peace-lily.png";
import FLOW3 from "../assets/images/snake-plant.png";
import FLOW4 from "../assets/images/pothos.png";

const categories = [
  { icon: Leaf, label: "All Plants" },
  { icon: Flower2, label: "Indoor" },
  { icon: Sprout, label: "Outdoor" },
  { icon: Sun, label: "Low Light" },
  { icon: PawPrint, label: "Pet Friendly" },
];

const plants = [
  { icon: FLOW, name: "ZZ Plant", price: "$23.99" },
  { icon: FLOW2, name: "Peace Lily", price: "$24.99" },
  { icon: FLOW3, name: "Snake Plant", price: "$23.99" },
  { icon: FLOW4, name: "Pothos", price: "$19.99" },
];

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <main className="h-[100dvh] overflow-auto bg-[#0c2a20] text-[#edf4e9]">
      <Header />

      <div className="mt-2 px-4 flex gap-3">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#28473b] px-4 text-sm text-[#c5d0c3]">
          <Search size={21} />
          Search plants, pots...
        </div>
        <button className="grid h-12 w-12 place-items-center rounded-full bg-[#28473b]">
          <SlidersHorizontal />
        </button>
      </div>

      <section className="relative  h-[272px] overflow-hidden p-4 ">
        <div className="home-card relative   rounded-[22px] p-4 w-full h-full ">
          <div className="absolute inset-0 z-2 bg-linear-to-tr from-transparent to-white/30 rounded-[22px]"></div>
          <div className="h-full w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-[29px] leading-8">
              Bring Greenery
              <br />
              to Life
            </h2>
            <p className="mt-3 text-sm leading-5">
              Curated plants for every space and every plant parent.
            </p>
            <button className="mt-4 max-w-32 rounded-full bg-[#deedc9] px-5 py-2 text-xs font-semibold text-[#193126]">
              Shop Now
            </button>
          </div>
          <div className="absolute max-h-[272px] w-3/4 -bottom-3 -right-1/6">
            <img
              src={FLOW}
              alt="Plant"
              className="h-full max-h-[272px] w-full object-contain"
            />
          </div>
        </div>
        <div className="mt-2 flex justify-center gap-2">
          <i className="h-2 w-2 rounded-full bg-[#dcedbb]" />
          <i className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </section>

      <div className="mt-2 px-4 flex justify-between gap-2 overflow-x-auto pb-1">
        {categories.map(({ icon: Icon, label }, index) => {
          return (
            <button
              type="button"
              key={label}
              onClick={() => setActiveCategory(index)}
              className={`min-w-[58px] mt-2 cursor-pointer text-center text-[11px] ${activeCategory === index ? "text-[#edf6de]" : "text-[#c8d6ca]"}`}
            >
              <div
                className={`transition-all home-card relative mx-auto mb-2 grid h-14 w-14 place-items-center rounded-xl text-xl ${activeCategory === index ? "bg-linear-to-b from-[#d2f5b69f] to-transparent text-[#173020] shadow-[0_1px_10px_rgb(190_235_138_/_45%)]" : "bg-linear-to-b from-transparent to-white/10 text-[#dcebc7]"}`}
              >
                <Icon />
              </div>
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 px-4 flex items-center justify-between">
        <h2 className="font-serif text-xl">Best Sellers</h2>
        <button className="flex items-center gap-1 text-md text-[#c5d8bd]">
          View All <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-4 flex pb-2 px-4 gap-3 overflow-x-scroll">
        {plants.map(({ icon: PlantIcon, name, price }) => (
          <article
            key={name}
            className="overflow-hidden w-28 shrink-0 relative home-card rounded-xl bg-linear-to-b from-transparent to-white/10"
          >
            <div className="h-28 border border-[#c5d0c350] rounded-xl bg-cover bg-linear-to-b from-white/10 to-[#0c2a20] bg-center">
              <img
                src={PlantIcon}
                alt={name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-2">
              <div className="flex justify-between text-xs">
                <span>{name}</span>
                <Heart size={14} />
              </div>
              <p className="mt-1 text-xs text-[#d5e5d4]">{price}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="h-22" />
      <BottomNavigation />
    </main>
  );
}
