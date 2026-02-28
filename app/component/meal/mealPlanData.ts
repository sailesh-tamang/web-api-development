export interface Meal {
  name: string;
  items: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  calories: number;
  image?: string;
}

export interface DayPlan {
  day: string;
  dayNumber: number;
  theme: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

export const mealPlanData: DayPlan[] = [
  {
    day: "Day 1",
    dayNumber: 1,
    theme: "Balanced Start",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Oats, Berries, Almonds",
        macros: { protein: 12, carbs: 45, fat: 8 },
        calories: 320,
        image: "https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Grilled Chicken, Quinoa, Mixed Veggies",
        macros: { protein: 38, carbs: 52, fat: 12 },
        calories: 580,
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Salmon, Sweet Potato, Broccoli",
        macros: { protein: 35, carbs: 48, fat: 14 },
        calories: 620,
        image: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 2",
    dayNumber: 2,
    theme: "High Protein Focus",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Greek Yogurt, Banana, Chia Seeds",
        macros: { protein: 20, carbs: 40, fat: 10 },
        calories: 350,
        image: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Turkey Wrap (Whole Wheat), Salad",
        macros: { protein: 40, carbs: 45, fat: 12 },
        calories: 550,
        image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Grilled Chicken, Brown Rice, Spinach",
        macros: { protein: 42, carbs: 50, fat: 10 },
        calories: 600,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 3",
    dayNumber: 3,
    theme: "Light & Clean",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Scrambled Eggs (2), Whole Grain Toast, Avocado",
        macros: { protein: 22, carbs: 30, fat: 18 },
        calories: 400,
        image: "https://images.pexels.com/photos/3556428/pexels-photo-3556428.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Tuna Salad, Olive Oil Dressing",
        macros: { protein: 35, carbs: 20, fat: 15 },
        calories: 500,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Stir-Fry Tofu, Veggies, Jasmine Rice",
        macros: { protein: 30, carbs: 55, fat: 14 },
        calories: 620,
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 4",
    dayNumber: 4,
    theme: "Energy Boost",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Smoothie (Protein Powder, Oats, Peanut Butter, Banana)",
        macros: { protein: 30, carbs: 50, fat: 12 },
        calories: 450,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Beef, Sweet Potato, Green Beans",
        macros: { protein: 40, carbs: 45, fat: 15 },
        calories: 650,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Grilled Fish, Couscous, Salad",
        macros: { protein: 35, carbs: 45, fat: 12 },
        calories: 600,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 5",
    dayNumber: 5,
    theme: "Lean Muscle Support",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Omelette (Eggs, Spinach, Mushrooms), Toast",
        macros: { protein: 25, carbs: 35, fat: 15 },
        calories: 420,
        image: "https://images.pexels.com/photos/3556428/pexels-photo-3556428.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Chicken Burrito Bowl (Rice, Beans, Veggies)",
        macros: { protein: 45, carbs: 60, fat: 14 },
        calories: 700,
        image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Baked Salmon, Quinoa, Asparagus",
        macros: { protein: 38, carbs: 45, fat: 16 },
        calories: 650,
        image: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 6",
    dayNumber: 6,
    theme: "Light & Fresh",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Overnight Oats, Almond Butter, Berries",
        macros: { protein: 15, carbs: 50, fat: 12 },
        calories: 380,
        image: "https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Grilled Shrimp, Brown Rice, Veggies",
        macros: { protein: 40, carbs: 50, fat: 10 },
        calories: 600,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Chicken Caesar Salad (Light Dressing)",
        macros: { protein: 35, carbs: 20, fat: 14 },
        calories: 500,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
  {
    day: "Day 7",
    dayNumber: 7,
    theme: "Recovery Day",
    meals: {
      breakfast: {
        name: "Breakfast",
        items: "Greek Yogurt Bowl, Granola, Fruits",
        macros: { protein: 22, carbs: 45, fat: 10 },
        calories: 400,
        image: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      lunch: {
        name: "Lunch",
        items: "Lentil Soup, Whole Grain Bread",
        macros: { protein: 30, carbs: 50, fat: 8 },
        calories: 550,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      dinner: {
        name: "Dinner",
        items: "Grilled Chicken, Roasted Veggies, Potatoes",
        macros: { protein: 40, carbs: 45, fat: 12 },
        calories: 620,
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    },
  },
];
