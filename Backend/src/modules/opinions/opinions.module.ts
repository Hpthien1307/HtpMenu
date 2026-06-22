import { Module } from "@nestjs/common";
import { OpinionsController } from "@/modules/opinions/opinions.controller";
import { OpinionsService } from "@/modules/opinions/opinions.service";

@Module({
  controllers: [OpinionsController],
  providers: [OpinionsService],
  exports: [OpinionsService]
})
export class OpinionsModule {}
