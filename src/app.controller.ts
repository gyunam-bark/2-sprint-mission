import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: '헬스체크',
    description: '서버가 정상 동작 중인지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 정상 상태',
    schema: {
      example: { status: 'ok' },
    },
  })
  healthCheck() {
    return { status: 'ok' };
  }
}
