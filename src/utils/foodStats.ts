import {
  Apple,
  Candy,
  CircleGauge,
  Drumstick,
  Flame,
  Pizza,
  Salad,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export type FoodStatsSource = {
  calories: string;
  proteins: string;
  proteins_percent: string;
  fats: string;
  fats_percent: string;
  carbohydrates: string;
  carbohydrates_percent: string;
  sugars: string;
  bread_units: string;
  total_weight: string;
  glycemic_index: string;
  protein_bje: string;
  fats_bje: string;
  calories_bje: string;
  bje_units: string;
};

export type FoodStat = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function getFoodStats(food: FoodStatsSource): FoodStat[] {
  return [
    { icon: Flame, label: "Calories", value: `${food.calories} kcal` },
    { icon: Drumstick, label: "Proteins", value: `${food.proteins} g` },
    // {
    //   icon: BicepsFlexed,
    //   label: "Proteins %",
    //   value: `${food.proteins_percent}%`,
    // },
    { icon: Salad, label: "Fats", value: `${food.fats} g` },
    // { icon: BicepsFlexed, label: "Fats %", value: `${food.fats_percent}%` },
    { icon: Pizza, label: "Carbs", value: `${food.carbohydrates} g` },
    // {
    //   icon: BicepsFlexed,
    //   label: "Carbs %",
    //   value: `${food.carbohydrates_percent}%`,
    // },
    { icon: Candy, label: "Sugars", value: `${food.sugars} g` },
    { icon: Wheat, label: "Bread units", value: food.bread_units },
    // { icon: Scale, label: "Weight", value: `${food.total_weight} g` },
    { icon: CircleGauge, label: "Glycemic index", value: food.glycemic_index },
    // { icon: BicepsFlexed, label: "Protein BJE", value: food.protein_bje },
    // { icon: BicepsFlexed, label: "Fats BJE", value: food.fats_bje },
    // { icon: Flame, label: "Calories BJE", value: food.calories_bje },
    { icon: Apple, label: "BJE units", value: food.bje_units },
  ];
}
