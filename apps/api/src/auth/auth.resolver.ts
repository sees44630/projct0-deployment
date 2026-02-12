import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayload, UserType } from '../graphql/types';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('displayName') displayName: string,
  ) {
    return this.authService.register(email, password, displayName);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Query(() => UserType, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getMe(@Context() ctx: { req: { user: { userId: string } } }) {
    return this.authService.getUser(ctx.req.user.userId);
  }
}
