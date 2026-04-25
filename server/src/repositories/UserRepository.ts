import User from '../models/User';

export class UserRepository {
  async findByUsername(username: string) {
    return await User.findOne({ username });
  }

  async findById(id: string) {
    return await User.findById(id).select('-password');
  }

  async create(userData: any) {
    return await User.create(userData);
  }
}

export const userRepository = new UserRepository();
