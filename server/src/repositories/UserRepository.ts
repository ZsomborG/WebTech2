import User from '../models/User';

export class UserRepository {
  async findByUsername(username: string, includePassword = false) {
    const query = User.findOne({ username });
    if (!includePassword) {
      query.select('-password');
    }
    return await query;
  }

  async findById(id: string) {
    return await User.findById(id).select('-password');
  }

  async create(userData: any) {
    const user = await User.create(userData);
    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj;
  }
}

export const userRepository = new UserRepository();
