import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { 
  User, MenuItem, Dish, ComboDish, Ingredient, DishIngredient, Table 
} from './models';

dotenv.config();

const paradiseMenu = [
  // BIRYANIS
  { name: 'Chicken Biryani', price: 210, type: 'Chicken', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Mutton Biryani', price: 253, type: 'Mutton', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Chicken Family Pack', price: 552, type: 'Chicken', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Mutton Family Pack', price: 576, type: 'Mutton', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Special Chicken Biryani', price: 337, type: 'Chicken', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Special Mutton Biryani', price: 351, type: 'Mutton', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Lamb_meat_%281%29.jpg/500px-Lamb_meat_%281%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Supreme Chicken Biryani', price: 784, type: 'Chicken', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Supreme Mutton Biryani', price: 819, type: 'Mutton', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Egg Biryani', price: 154, type: 'Egg', img: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg' },
  { name: 'Veg. Biryani', price: 154, type: 'Veg', img: 'https://www.themealdb.com/images/media/meals/3m8yae1763257951.jpg' },
  { name: 'Veg. Family Pack', price: 383, type: 'Veg', img: 'https://www.themealdb.com/images/media/meals/tbj1bs1764118062.jpg' },
  { name: 'Veg. Supreme Pack', price: 574, type: 'Veg', img: 'https://www.themealdb.com/images/media/meals/zub3s91764110535.jpg' },
  // STARTERS
  { name: 'Chilli Chicken', price: 264, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/5jdtie1763289302.jpg' },
  { name: 'Chicken 65', price: 264, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/fg7d641784666908.jpg' },
  { name: 'Pepper Chicken', price: 264, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/x0mreq1784577446.jpg' },
  { name: 'Paneer 65', price: 196, type: 'Veg', img: 'https://www.themealdb.com/images/media/meals/tvvxpv1511191952.jpg' },
  { name: 'Veg. Manchurian', price: 189, type: 'Veg', img: 'https://www.themealdb.com/images/media/meals/rvtvuw1511190488.jpg' },
  // KEBABS
  { name: 'Chicken Tikka Kebab', price: 243, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/8rfd4q1764112993.jpg' },
  { name: 'Tandoori Chicken (Half)', price: 243, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/13fg4j1764441982.jpg' },
  { name: 'Tandoori Chicken (Full)', price: 379, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/zdyurx1783801146.jpg' },
  { name: 'Chicken Reshmi Kebab', price: 243, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/wurrux1468416624.jpg' },
  { name: 'Chicken Garlic Kebab', price: 243, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/jgl9qq1764437635.jpg' },
  // CURRIES
  { name: 'Butter Chicken Boneless', price: 246, type: 'Chicken', img: 'https://www.themealdb.com/images/media/meals/sbx7n71587673021.jpg' },
  { name: 'Nizami Handi', price: 171, type: 'Veg', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Pakistani_Food_Karahi_Beef.jpg/500px-Pakistani_Food_Karahi_Beef.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  // BREADS
  { name: 'Tandoori Roti', price: 40, type: 'Bread', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Annapurna_Naan.jpg/500px-Annapurna_Naan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Rumali Roti', price: 40, type: 'Bread', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Annapurna_Naan.jpg/500px-Annapurna_Naan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  // DESSERTS
  { name: 'Qubani Ka Meetha 250 Gms', price: 107, type: 'Dessert', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Aerial_view_of_Durgam_cheruvu_and_Hitech_CIty.jpg/500px-Aerial_view_of_Durgam_cheruvu_and_Hitech_CIty.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Double Ka Meetha', price: 73, type: 'Dessert', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Double_ka_meetha_with_a_big_spoon.jpg/500px-Double_ka_meetha_with_a_big_spoon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  // BEVERAGES
  { name: 'Diet Coke', price: 50, type: 'Beverage', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg/500px-Coca_Cola_Flasche_-_Original_Taste.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
  { name: 'Thums Up', price: 50, type: 'Beverage', img: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Campa_Cola_logo.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled' },
  { name: 'Mineral Water', price: 20, type: 'Beverage', img: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Drinking_glass_00118.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled' },
  { name: 'Sprite', price: 50, type: 'Beverage', img: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Sprite_Zero_Sugar_1.jpg/500px-Sprite_Zero_Sugar_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' }
];

const seedDB = async () => {
  await connectDB();
  console.log('Seeding database with Paradise menu...');

  // Clear existing data
  await User.deleteMany();
  await MenuItem.deleteMany();
  await Dish.deleteMany();
  await ComboDish.deleteMany();
  await Ingredient.deleteMany();
  await DishIngredient.deleteMany();
  await Table.deleteMany();

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const users = [
    { username: 'admin', password: await bcrypt.hash('admin123', salt), role: 'admin' },
    { username: 'manager', password: await bcrypt.hash('manager123', salt), role: 'manager' },
    { username: 'server', password: await bcrypt.hash('server123', salt), role: 'server' },
    { username: 'chef', password: await bcrypt.hash('chef123', salt), role: 'chef' },
    { username: 'cashier', password: await bcrypt.hash('cashier123', salt), role: 'cashier' }
  ];
  await User.insertMany(users);

  // 2. Tables
  const tables = Array.from({ length: 15 }, (_, i) => ({
    table_number: String(i + 1).padStart(3, '0'),
    status: 'available'
  }));
  await Table.insertMany(tables);

  // 3. Base Ingredients to make sure the inventory logic doesn't crash
  const baseIngredients = [
    { name: 'Chicken', quantity: 10000, unit: 'kg', threshold: 10 },
    { name: 'Mutton', quantity: 10000, unit: 'kg', threshold: 10 },
    { name: 'Egg', quantity: 10000, unit: 'pcs', threshold: 50 },
    { name: 'Veg', quantity: 10000, unit: 'kg', threshold: 10 },
    { name: 'Bread', quantity: 10000, unit: 'pcs', threshold: 100 },
    { name: 'Dessert', quantity: 10000, unit: 'portions', threshold: 10 },
    { name: 'Beverage', quantity: 10000, unit: 'bottles', threshold: 50 }
  ];
  await Ingredient.insertMany(baseIngredients);

  // 4. Menu Items
  const itemsToInsert = paradiseMenu.map(item => ({
    name: item.name,
    price: item.price,
    is_available: true,
    image: item.img
  }));
  const insertedCombos = await MenuItem.insertMany(itemsToInsert);

  // 5. Link everything (Dish -> ComboDish -> DishIngredient)
  const dishData = paradiseMenu.map(item => ({
    name: item.name,
    category: item.type,
    cooking_method: 'prep'
  }));
  const insertedDishes = await Dish.insertMany(dishData);

  const comboDishes = insertedCombos.map((combo, index) => ({
    combo_id: combo._id,
    dish_id: insertedDishes[index]._id
  }));
  await ComboDish.insertMany(comboDishes);

  const dishIngredients = insertedDishes.map((dish, index) => ({
    dish_id: dish._id,
    ingredient_name: paradiseMenu[index].type,
    qty_needed: 1,
    unit: 'portion'
  }));
  await DishIngredient.insertMany(dishIngredients);

  console.log('Database seeded successfully with Paradise menu!');
  process.exit(0);
};

seedDB().catch(err => {
  console.error('Failed to seed DB:', err);
  process.exit(1);
});
