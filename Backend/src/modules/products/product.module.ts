import { Module } from "@nestjs/common";
import { ProductController } from "@/modules/products/product.controller";
import { ProductService } from "@/modules/products/product.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})

export class ProductModule{};