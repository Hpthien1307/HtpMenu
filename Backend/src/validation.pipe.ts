import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Type } from "@nestjs/common"
import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata

    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const object = plainToInstance(metatype, item)
        const errors = await validate(object)
        if (errors.length > 0) {
          throw new BadRequestException("validate error")
        }
      }
    } else {
      const object = plainToInstance(metatype, value)
      const errors = await validate(object)
      if (errors.length > 0) {
        throw new BadRequestException("validate error")
      }
    }
    return value
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Number, Boolean, Array, Object]
    return !types.includes(metatype)
  }
}
