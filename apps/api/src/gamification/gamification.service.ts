import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// XP thresholds per level
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

// Titles per level
const TITLES: Record<number, string> = {
  1: 'Newbie Shopper',
  2: 'Apprentice Collector',
  3: 'Rising Otaku',
  4: 'Seasoned Buyer',
  5: 'Elite Collector',
  6: 'Master Otaku',
  7: 'Grandmaster',
  8: 'Legendary Collector',
  9: 'Mythical Shopper',
  10: 'God of Loot',
};

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Award XP to a user and handle level-ups
   */
  async awardXP(userId: string, amount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean; newTitle: string }> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const newXP = profile.xp + amount;
    let newLevel = profile.level;
    let leveledUp = false;

    // Check for level up
    while (newLevel < LEVEL_THRESHOLDS.length && newXP >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
    }

    const newTitle = TITLES[newLevel] || profile.currentTitle;

    await this.prisma.profile.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
        currentTitle: newTitle,
      },
    });

    return { newXP, newLevel, leveledUp, newTitle };
  }

  /**
   * Get XP needed for next level
   */
  async getProgress(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const currentThreshold = LEVEL_THRESHOLDS[profile.level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[profile.level] || currentThreshold;
    const progress = nextThreshold > currentThreshold
      ? ((profile.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
      : 100;

    return {
      level: profile.level,
      xp: profile.xp,
      xpForNextLevel: nextThreshold,
      xpFromCurrentLevel: profile.xp - currentThreshold,
      xpNeeded: nextThreshold - currentThreshold,
      progress: Math.min(progress, 100),
      currentTitle: profile.currentTitle,
    };
  }
}
