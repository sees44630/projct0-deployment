import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { GamificationModule } from './gamification/gamification.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    // Configuration (loads .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // GraphQL with Apollo (code-first)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),

    // Database
    PrismaModule,

    // Domain modules
    CatalogModule,
    AuthModule,
    CartModule,
    GamificationModule,
    AiModule,
  ],
})
export class AppModule {}
