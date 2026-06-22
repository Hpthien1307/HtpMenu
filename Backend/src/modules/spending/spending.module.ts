import { Module } from "@nestjs/common";
import { SpendingContollers } from "@/modules/spending/spending.controller";
import { SpendingService } from "@/modules/spending/spending.service";

@Module({
  controllers: [SpendingContollers],
  providers: [SpendingService],
  exports: [SpendingService]
})

export class SpendingModule{};