import { Module } from "@nestjs/common";
import { HelloModule } from "./modules/hello/hello.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    HelloModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./database/database_orm.sqlite",
      autoLoadEntities: true,
      synchronize: true,
      migrations: ["../typeorm/migrations/*.ts"],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
