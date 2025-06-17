import { Module } from '@nestjs/common';
import { AttachService } from './attach.service';

@Module({
  providers: [AttachService]
})
export class AttachModule {}
