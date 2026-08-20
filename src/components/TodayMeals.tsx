import { Apple, Scale, Utensils, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { type FoodHistoryIngredient, useGetHistoryQuery } from "../api/baseApi";
import { getFoodStats, type FoodStat } from "../utils/foodStats";
import { ProfileSettingCard } from "./ProfileSettingCard";

type MealStat = FoodStat;

export type TodayMeal = {
  description: string;
  icon: LucideIcon;
  id?: string;
  ingredients?: FoodHistoryIngredient[] | null;
  photoUrl?: string | null;
  stats: MealStat[];
  title: string;
  weight: number | string;
};

type TodayMealsProps = { fallbackMeals: TodayMeal[] };

function getFoodPhotoUrl(pathToPhoto: string | null) {
  if (!pathToPhoto) return null;

  return `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api/v3${pathToPhoto}`;
}

function StatsGrid({ stats }: { stats: MealStat[] }) {
  return (
    <div className="grid grid-cols-4 border-t border-[var(--app-border)]/10">
      {stats.map(({ label, value, icon: StatIcon }) => (
        <div
          className="flex min-w-0 flex-col items-center gap-1 px-1 py-2 leading-none"
          key={label}
        >
          <StatIcon className="text-[var(--app-success)]" size={13} />
          <span className="text-[10px] font-bold">{value}</span>
          <span className="block w-full truncate text-center text-[8px] text-[var(--app-text-subtle)]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TodayMeals({ fallbackMeals }: TodayMealsProps) {
  const { data: history } = useGetHistoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(
    null,
  );
  const meals: TodayMeal[] = history
    ? history.data.map((meal) => ({
        description: meal.datetime,
        icon: Apple,
        id: meal.history_id,
        ingredients: meal.ingredients,
        photoUrl: getFoodPhotoUrl(meal.path_to_photo),
        stats: getFoodStats(meal),
        title: meal.dish_name,
        weight: meal.total_weight,
      }))
    : fallbackMeals;

  return (
    <section aria-label="Блюда за сегодня" className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold">Сегодня</h2>
        <span className="text-[11px] text-[var(--app-text-subtle)]">
          {meals.length} блюда
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {meals.map((meal) => {
          const mealId = meal.id ?? meal.title;
          const isExpanded = expandedMeal === mealId;
          const mealContent = (
            <div>
              <StatsGrid stats={meal.stats} />
              {meal.ingredients?.length ? (
                <div className="flex flex-col gap-2 border-t border-[var(--app-border)]/10 p-3">
                  <p className="text-[10px] font-bold text-[var(--app-text-muted)]">
                    Ingredients
                  </p>
                  {meal.ingredients.map((ingredient, index) => {
                    const ingredientId = `${mealId}-${index}`;
                    const isIngredientExpanded =
                      expandedIngredient === ingredientId;
                    return (
                      <ProfileSettingCard
                        contentNode={
                          <StatsGrid stats={getFoodStats(ingredient)} />
                        }
                        description=""
                        header={
                          <>
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--app-surface-raised)] text-[var(--app-success)]">
                              <Utensils size={18} />
                            </span>
                            <span className="flex-1 text-[11px] font-bold">
                              {ingredient.name}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-[var(--app-text-muted)]">
                              <Scale size={12} />
                              {ingredient.total_weight} g
                            </span>
                          </>
                        }
                        isExpanded={isIngredientExpanded}
                        key={ingredientId}
                        onToggle={() =>
                          setExpandedIngredient(
                            isIngredientExpanded ? null : ingredientId,
                          )
                        }
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          );

          return (
            <ProfileSettingCard
              contentNode={mealContent}
              description={meal.description}
              header={
                <>
                  {meal.photoUrl ? (
                    <img
                      alt={meal.title}
                      className="h-12 w-12 shrink-0 rounded-[14px] object-cover"
                      src={meal.photoUrl}
                    />
                  ) : (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--app-surface-raised)] text-[var(--app-success)]">
                      <meal.icon size={23} strokeWidth={1.8} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">
                      {meal.title}
                    </span>
                    <span className="mt-2 block text-[11px] font-normal text-[var(--app-text-subtle)]">
                      {meal.description}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-extrabold">
                    <Scale size={14} />
                    {meal.weight} г
                  </span>
                </>
              }
              isExpanded={isExpanded}
              key={mealId}
              onToggle={() => setExpandedMeal(isExpanded ? null : mealId)}
            />
          );
        })}
      </div>
    </section>
  );
}
