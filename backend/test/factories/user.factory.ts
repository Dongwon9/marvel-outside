import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../../src/user/dto/create-user.dto';

/**
 * User 테스트 데이터 팩토리
 */
export class UserFactory {
  /**
   * 고유한 이메일과 이름 생성 (각 호출마다 고유한 타임스탐프 포함)
   */
  static createUserDto(overrides?: Partial<CreateUserDto>): CreateUserDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const unique = `${timestamp}-${random}`;

    return {
      email: `user${unique}@test.com`,
      name: `testuser${unique}`,
      password: 'Test123456!',
      ...overrides,
    };
  }

  static createUserDtos(count: number, overrides?: Partial<CreateUserDto>) {
    return Array.from({ length: count }, () => this.createUserDto(overrides));
  }

  static createUserDtoWithPassword(
    password: string,
    overrides?: Partial<CreateUserDto>,
  ): CreateUserDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const unique = `${timestamp}-${random}`;

    return {
      email: `user${unique}@test.com`,
      name: `testuser${unique}`,
      password,
      ...overrides,
    };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static createUserDtoWithEmail(email: string, overrides?: Partial<CreateUserDto>): CreateUserDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const unique = `${timestamp}-${random}`;

    return {
      email,
      name: `testuser${unique}`,
      password: 'Test123456!',
      ...overrides,
    };
  }

  static createUserDtoWithEmailAndName(
    email: string,
    name: string,
    overrides?: Partial<CreateUserDto>,
  ): CreateUserDto {
    return {
      email,
      name,
      password: 'Test123456!',
      ...overrides,
    };
  }
}
