import mongoose, { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});
UserSchema.set('toJSON', { virtuals: true });

export const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
  image: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});
MenuItemSchema.set('toJSON', { virtuals: true });

export const DishSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  cooking_method: String
});
DishSchema.set('toJSON', { virtuals: true });

export const ComboDishSchema = new Schema({
  combo_id: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
  dish_id: { type: Schema.Types.ObjectId, ref: 'Dish' }
});

export const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  threshold: { type: Number, required: true, default: 0 }
});
IngredientSchema.set('toJSON', { virtuals: true });

export const DishIngredientSchema = new Schema({
  dish_id: { type: Schema.Types.ObjectId, ref: 'Dish' },
  ingredient_name: { type: String, required: true },
  qty_needed: { type: Number, required: true },
  unit: { type: String, required: true }
});

export const TableSchema = new Schema({
  table_number: { type: String, required: true, unique: true },
  status: { type: String, default: 'available' }
});
TableSchema.set('toJSON', { virtuals: true });

export const OrderSchema = new Schema({
  table_id: { type: String, required: true },
  combo_id: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
  combo_name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  notes: { type: String, default: '' },
  total_price: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});
OrderSchema.set('toJSON', { virtuals: true });

export const KitchenTicketSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  table_id: { type: String, required: true },
  combo_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});
KitchenTicketSchema.set('toJSON', { virtuals: true });

export const BillSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  table_id: { type: String, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});
BillSchema.set('toJSON', { virtuals: true });

export const RevenueSchema = new Schema({
  bill_id: { type: Schema.Types.ObjectId, ref: 'Bill' },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});
RevenueSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model('User', UserSchema);
export const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
export const Dish = mongoose.model('Dish', DishSchema);
export const ComboDish = mongoose.model('ComboDish', ComboDishSchema);
export const Ingredient = mongoose.model('Ingredient', IngredientSchema);
export const DishIngredient = mongoose.model('DishIngredient', DishIngredientSchema);
export const Table = mongoose.model('Table', TableSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const KitchenTicket = mongoose.model('KitchenTicket', KitchenTicketSchema);
export const Bill = mongoose.model('Bill', BillSchema);
export const Revenue = mongoose.model('Revenue', RevenueSchema);
