import { Resolver, Mutation, Query, Args, Context, Int, ObjectType, Field, Float as GqlFloat } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@ObjectType()
class XPResult {
  @Field(() => Int)
  newXP!: number;

  @Field(() => Int)
  newLevel!: number;

  @Field()
  leveledUp!: boolean;

  @Field()
  newTitle!: string;
}

@ObjectType()
class LevelProgress {
  @Field(() => Int)
  level!: number;

  @Field(() => Int)
  xp!: number;

  @Field(() => Int)
  xpForNextLevel!: number;

  @Field(() => Int)
  xpFromCurrentLevel!: number;

  @Field(() => Int)
  xpNeeded!: number;

  @Field(() => GqlFloat)
  progress!: number;

  @Field()
  currentTitle!: string;
}

@Resolver()
export class GamificationResolver {
  constructor(private gamificationService: GamificationService) {}

  @Query(() => LevelProgress, { name: 'levelProgress' })
  @UseGuards(GqlAuthGuard)
  async getLevelProgress(@Context() ctx: { req: { user: { userId: string } } }) {
    return this.gamificationService.getProgress(ctx.req.user.userId);
  }

  @Mutation(() => XPResult)
  @UseGuards(GqlAuthGuard)
  async awardXP(
    @Context() ctx: { req: { user: { userId: string } } },
    @Args('amount', { type: () => Int }) amount: number,
  ) {
    return this.gamificationService.awardXP(ctx.req.user.userId, amount);
  }
}
