import { MenuItem, Order, ComboDish, DishIngredient } from '../../infrastructure/models';

export const getMenu = async () => {
  const items = await MenuItem.find().sort({ name: 1 }).lean();
  return items.map(i => ({
    id: i._id.toString(),
    name: i.name,
    price: i.price,
    isAvailable: i.is_available,
    image: i.image
  }));
};

export const updateMenuAvailability = async (id: string, isAvailable: boolean) => {
  const item = await MenuItem.findByIdAndUpdate(
    id,
    { is_available: isAvailable },
    { new: true }
  ).lean();
  return item ? { ...item, id: item._id.toString() } : null;
};

export const markCombosUnavailableByIngredient = async (ingredientName: string) => {
  const dishIngredients = await DishIngredient.find({ ingredient_name: ingredientName }).lean();
  const dishIds = dishIngredients.map(di => di.dish_id).filter(Boolean) as any[];
  
  const comboDishes = await ComboDish.find({ dish_id: { $in: dishIds } }).lean();
  const comboIds = comboDishes.map(cd => cd.combo_id).filter(Boolean) as any[];
  
  await MenuItem.updateMany(
    { _id: { $in: comboIds } },
    { is_available: false }
  );
  
  const updatedCombos = await MenuItem.find({ _id: { $in: comboIds } }).lean();
  return updatedCombos.map(c => ({ id: c._id.toString(), name: c.name }));
};

export const getComboById = async (comboId: string) => {
  const item = await MenuItem.findById(comboId).lean();
  if (!item) return null;
  return { name: item.name, price: item.price };
};

export const createOrder = async (tableId: string, comboId: string, comboName: string, quantity: number, notes: string, totalPrice: number) => {
  const order = new Order({
    table_id: tableId,
    combo_id: comboId,
    combo_name: comboName,
    quantity,
    notes: notes || '',
    total_price: totalPrice,
    status: 'pending'
  });
  await order.save();
  return {
    id: order._id.toString(),
    tableId: order.table_id,
    comboId: order.combo_id?.toString(),
    comboName: order.combo_name,
    quantity: order.quantity,
    notes: order.notes,
    totalPrice: order.total_price,
    status: order.status,
    createdAt: order.created_at
  };
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  await Order.findByIdAndUpdate(orderId, { status });
};

export const getOrdersByTable = async (tableId: string) => {
  const orders = await Order.find({ table_id: tableId }).sort({ created_at: -1 }).lean();
  return orders.map(o => ({
    id: o._id.toString(),
    tableId: o.table_id,
    comboId: o.combo_id?.toString(),
    comboName: o.combo_name,
    quantity: o.quantity,
    notes: o.notes,
    totalPrice: o.total_price,
    status: o.status,
    createdAt: o.created_at
  }));
};
