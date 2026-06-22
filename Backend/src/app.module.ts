import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/modules/products/product.module';
import { SpendingModule } from '@/modules/spending/spending.module';
import { OrderModule } from '@/modules/orders/orders.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { EmployeesModule } from '@/modules/employees/employees.module';
import { OpinionsModule } from '@/modules/opinions/opinions.module';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    SpendingModule,
    OrderModule,
    CategoriesModule,
    EmployeesModule,
    OpinionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
