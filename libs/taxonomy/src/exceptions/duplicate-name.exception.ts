import { BadRequestException } from '@nestjs/common';

export class DuplicateNameException extends BadRequestException {
  constructor() {
    super('같은 이름이 존재합니다.');
  }
}
