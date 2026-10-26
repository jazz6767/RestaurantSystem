import { Ingredient, ComboDish, DishIngredient } from '../../infrastructure/models';

export const getInventory = async () => {
  const ingredients = await Ingredient.find().sort({ name: 1 }).lean();
  return ingredients.map(i => ({
    id: i._id.toString(),
    name: i.name,
    quantity: i.quantity,
    unit: i.unit,
    threshold: i.threshold
  }));
};

export const updateInventoryQuantity = async (name: string, quantity: number) => {
  const ingredient = await Ingredient.findOneAndUpdate(
    { name },
    { quantity },
    { new: true }
  ).lean();
  if (!ingredient) return null;
  return {
    id: ingredient._id.toString(),
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    threshold: ingredient.threshold
  };
};

export const getIngredientsForCombo = async (comboId: string, quantityMultiplier: number) => {
  const comboDishes = await ComboDish.find({ combo_id: comboId }).lean();
  const dishIds = comboDishes.map(cd => cd.dish_id).filter(Boolean) as any[];
  
  const dishIngredients = await DishIngredient.find({ dish_id: { $in: dishIds } }).lean();
  
  const results = [];
  for (const di of dishIngredients) {
    const ingredient = await Ingredient.findOne({ name: di.ingredient_name }).lean();
    if (ingredient) {
      results.push({
        name: ingredient.name,
        currentQuantity: ingredient.quantity,
        threshold: ingredient.threshold,
        deductAmount: di.qty_needed * quantityMultiplier
      });
    }
  }
  return results;
};

export const deductIngredient = async (name: string, deductAmount: number) => {
  const ingredient = await Ingredient.findOne({ name });
  if (ingredient) {
    ingredient.quantity = Math.max(ingredient.quantity - deductAmount, 0);
    await ingredient.save();
    return {
      name: ingredient.name,
      quantity: ingredient.quantity,
      threshold: ingredient.threshold
    };
  }
  return null;
};
