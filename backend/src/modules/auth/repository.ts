import { User } from '../../infrastructure/models';

export const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username }).lean();
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    password: user.password,
    role: user.role
  };
};
