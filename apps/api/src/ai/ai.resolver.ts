import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AiService } from './ai.service';

@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Mutation(() => String)
  async shopkeeperChat(
    @Args('message') message: string,
    @Args('context', { type: () => String, nullable: true }) contextJSON?: string,
  ): Promise<string> {
    const context = contextJSON ? JSON.parse(contextJSON) : {};
    return this.aiService.generateResponse({
      action: 'CHAT',
      message,
      ...context,
    });
  }

  @Mutation(() => String)
  async shopkeeperReact(
    @Args('action') action: string,
    @Args('productName', { nullable: true }) productName?: string,
    @Args('rarity', { nullable: true }) rarity?: string,
    @Args('playerClass', { nullable: true }) playerClass?: string,
  ): Promise<string> {
    return this.aiService.generateResponse({
      action: action as any,
      productName,
      rarity,
      playerClass,
    });
  }
}
