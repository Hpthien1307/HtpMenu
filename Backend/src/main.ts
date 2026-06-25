import "./paths"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "./validation.pipe"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.VERCEL ? process.env.PORT || 3000 : 3000
  await app.listen(port)
}
bootstrap()
