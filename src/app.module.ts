import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HelloModule } from "./modules/hello/hello.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelloModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "sqlite",
        database: config.get<string>("DATABASE_PATH"),
        autoLoadEntities: true,
        synchronize: true,
        migrations: ["../typeorm/migrations/*.ts"],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
