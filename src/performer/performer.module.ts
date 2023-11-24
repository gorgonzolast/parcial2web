import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';

@Module({
  providers: [PerformerService]
})
export class PerformerModule {}
