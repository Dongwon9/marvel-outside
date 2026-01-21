import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }
  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    done(null, user.id);
  }
  async deserializeUser(payload: any, done: (err: Error | null, user: any) => void): Promise<any> {
    const user = await this.userService.getUserById(payload);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    const { passwordHashed, ...result } = user;
    return done(null, result);
  }
}
