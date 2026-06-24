import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { uuidv7 } from "uuidv7"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly _extendedClient;

  constructor() {
    super()
    this._extendedClient = this.$extends({
      query: {
        $allModels: {
          async create({ args, query }) {
            if (args.data && !args.data.id) {
              args.data.id = uuidv7()
            }
            return query(args)
          },
          async createMany({ args, query }) {
            if (args.data && Array.isArray(args.data)) {
              for (const item of args.data) {
                if (!item.id) {
                  item.id = uuidv7()
                }
              }
            }
            return query(args)
          }
        }
      }
    })

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop === "onModuleInit" || prop === "onModuleDestroy" || prop === "$connect" || prop === "$disconnect") {
          const val = Reflect.get(target, prop, receiver)
          return typeof val === "function" ? val.bind(target) : val
        }
        return Reflect.get(target._extendedClient, prop, receiver)
      }
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

