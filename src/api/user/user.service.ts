import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getOne(identifier: string) {
    const user = await this.userModel.findOne({
      $or: [
        { _id: identifier },
        { username: identifier },
        { email: identifier },
      ],
    });
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  async delete(user: UserDocument) {
    await user.deleteOne();
    return user;
  }
}
