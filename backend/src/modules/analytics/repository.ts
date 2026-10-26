import { Revenue, User } from '../../infrastructure/models';

export const getRevenueByDate = async (date: string) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const revenues = await Revenue.find({
    date: { $gte: startOfDay, $lte: endOfDay }
  }).lean();
  
  return revenues.reduce((sum, rev) => sum + rev.amount, 0);
};

export const insertRevenue = async (billId: string, amount: number) => {
  const revenue = new Revenue({ bill_id: billId, amount, date: new Date() });
  await revenue.save();
  return { ...revenue.toObject(), id: revenue._id.toString() };
};

export const getAllUsers = async () => {
  const users = await User.find().lean();
  return users.map(u => ({
    id: u._id.toString(),
    username: u.username,
    role: u.role,
    created_at: u.created_at
  }));
};

export const createUser = async (username: string, passwordHash: string, role: string) => {
  const user = new User({ username, password: passwordHash, role });
  await user.save();
  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
    created_at: user.created_at
  };
};
