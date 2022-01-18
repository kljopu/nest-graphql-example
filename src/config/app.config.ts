import { InternalServerErrorException } from '@nestjs/common';

export default {
  PORT: process.env.PORT,
  OS_TYPE: process.env.OS_TYPE,
  verify() {
    if (this.has('app.PORT') === false) {
      throw new InternalServerErrorException(
        'app config의 PORT가 설정되지 않았습니다.',
      );
    }
    if (process.env.NODE_ENV !== 'dev') {
      if (this.has('app.OS_TYPE') === false) {
        throw new InternalServerErrorException(
          'app config의 OS_TYPE이 설정되지 않았습니다.',
        );
      }
    }
  },
};
