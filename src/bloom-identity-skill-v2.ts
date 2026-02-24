/**
 * Bloom Identity Card Generator - OpenClaw Skill v2
 *
 * Enhanced version with:
 * - Permission handling
 * - Manual Q&A fallback
 * - Focus on Twitter/X integration
 * - Graceful degradation
 */

import { PersonalityAnalyzer } from './analyzers/personality-analyzer';
import { EnhancedDataCollector } from './analyzers/data-collector-enhanced';
import { ManualQAFallback, ManualAnswer } from './analyzers/manual-qa-fallback';
import { CategoryMapper } from './analyzers/category-mapper';
import { PersonalityType } from './types/personality';
import { HiddenPatternInsight, AiPlaybook } from './types/taste-dimensions';
import { refreshRecommendations, SkillRecommendation } from './recommendation-pipeline';
import { syncDiscoveries, DiscoveryEntry } from './discovery-sync';
import { parseUserMd, UserMdSignals } from './parsers/user-md-parser';
import { mergeSignals, MergedSignals, FeedbackData } from './analyzers/signal-merger';

// Re-export for backwards compatibility
export { PersonalityType };
export type { SkillRecommendation, FeedbackData, UserMdSignals };

export interface IdentityData {
  personalityType: PersonalityType;
  customTagline: string;
  customDescription: string;
  mainCategories: string[];
  subCategories: string[];
  dimensions?: {
    conviction: number;
    intuition: number;
    contribution: number;
  };
  tasteSpectrums?: {
    learning: number;
    decision: number;
    novelty: number;
    risk: number;
  };
  strengths?: string[];
  hiddenInsight?: HiddenPatternInsight;
  aiPlaybook?: AiPlaybook;
}

/**
 * Execution mode
 */
export enum ExecutionMode {
  AUTO = 'auto',           // Try data collection, fallback to Q&A if insufficient
  MANUAL = 'manual',       // Skip data collection, go straight to Q&A
  DATA_ONLY = 'data_only', // Only use data collection, fail if insufficient
}

/**
 * Main Bloom Identity Skill v2
 */
export class BloomIdentitySkillV2 {
  private personalityAnalyzer: PersonalityAnalyzer;
  private dataCollector: EnhancedDataCollector;
  private manualQA: ManualQAFallback;
  private categoryMapper: CategoryMapper;

  constructor() {
    this.personalityAnalyzer = new PersonalityAnalyzer();
    this.dataCollector = new EnhancedDataCollector();
    this.manualQA = new ManualQAFallback();
    this.categoryMapper = new CategoryMapper();
  }

  /**
   * Main skill execution with intelligent fallback
   */
  async execute(
    userId: string,
    options?: {
      mode?: ExecutionMode;
      skipShare?: boolean; // Twitter share is optional
      manualAnswers?: ManualAnswer[]; // If already collected
      conversationText?: string; // ⭐ NEW: Direct conversation text from OpenClaw bot
      userMdPath?: string;       // Path to USER.md, default ~/.config/claude/USER.md
      feedback?: FeedbackData;   // Feedback signals from recommendation interactions
    }
  ): Promise<{
    success: boolean;
    mode: 'data' | 'manual' | 'hybrid';
    identityData?: IdentityData;
    recommendations?: SkillRecommendation[];
    discoveries?: DiscoveryEntry[];
    dashboardUrl?: string;
    dataQuality?: number;
    dimensions?: {
      conviction: number;
      intuition: number;
      contribution: number;
    };
    actions?: {
      share?: {
        url: string;
        text: string;
        hashtags: string[];
      };
      save?: {
        prompt: string;
        registerUrl: string;
        loginUrl: string;
      };
    };
    error?: string;
    needsManualInput?: boolean;
    manualQuestions?: string;
  }> {
    try {
      console.log(`🎴 Generating Bloom Identity for user: ${userId}`);

      const mode = options?.mode || ExecutionMode.AUTO;

      // Step 1: Try data collection (unless manual mode)
      let identityData: IdentityData | null = null;
      let dataQuality = 0;
      let usedManualQA = false;
      let dimensions: { conviction: number; intuition: number; contribution: number } | undefined;

      // Step 1.5: Parse USER.md for static profile signals
      console.log('📋 Step 1.5: Parsing USER.md...');
      const userMdSignals = parseUserMd(options?.userMdPath);
      if (userMdSignals) {
        console.log(`✅ USER.md signals: role=${userMdSignals.role || 'none'}, focus=${userMdSignals.currentFocus?.join(', ') || 'none'}, style=${userMdSignals.workingStyle || 'none'}`);
      } else {
        console.log('📋 No USER.md found (graceful degradation)');
      }

      if (mode !== ExecutionMode.MANUAL) {
        console.log('📊 Step 1: Attempting data collection...');

        // ⭐ NEW: If conversationText is provided, use it directly
        let userData;
        if (options?.conversationText) {
          console.log('✅ Using provided conversation text (OpenClaw bot context)');
          userData = await this.dataCollector.collectFromConversationText(
            userId,
            options.conversationText,
            { skipTwitter: options.skipShare }
          );
        } else {
          // Original: Collect from session files
          userData = await this.dataCollector.collect(userId, {
            // Default: Conversation + Twitter only
          });
        }

        dataQuality = this.dataCollector.getDataQualityScore(userData);
        // Data quality is calculated but not displayed (cleaner output)
        console.log(`📊 Available sources: ${userData.sources.join(', ')}`);

        // ⭐ CRITICAL: Check if we have ANY real data (conversation OR Twitter)
        const hasConversation = userData.conversationMemory && userData.conversationMemory.messageCount > 0;
        const hasTwitter = userData.twitter && (userData.twitter.bio || userData.twitter.tweets.length > 0);

        if (!hasConversation && !hasTwitter) {
          console.log('⚠️  No conversation or Twitter data available');

          // In AUTO mode, fallback to manual Q&A
          if (mode === ExecutionMode.AUTO) {
            console.log('🔄 Falling back to manual Q&A (no data available)...');
            usedManualQA = true;
          } else {
            // DATA_ONLY mode - fail explicitly
            throw new Error('No conversation or Twitter data available and manual Q&A not enabled');
          }
        } else {
          // Check if we have sufficient data quality
          const hasSufficientData = this.dataCollector.hasSufficientData(userData);

          if (hasSufficientData) {
            console.log('✅ Sufficient data available, proceeding with AI analysis...');

            // Pre-compute dimension nudges from USER.md + feedback
            const preNudges = (userMdSignals || options?.feedback)
              ? mergeSignals(
                  [], // categories not needed yet, just computing nudges
                  { conviction: 0, intuition: 0, contribution: 0 },
                  userMdSignals,
                  options?.feedback ?? null,
                )
              : null;

            // Inject USER.md raw text as first-class signal source
            if (userMdSignals?.raw) {
              userData.userMdContent = Object.values(userMdSignals.raw).join('\n');
            }

            // Analyze personality from data (with optional dimension nudges)
            const analysis = await this.personalityAnalyzer.analyze(
              userData,
              preNudges?.dimensionNudges,
            );

            // Build identity from conversation analysis
            const conversationCategories = analysis.detectedCategories.length > 0
              ? analysis.detectedCategories
              : this.categoryMapper.getMainCategories(analysis.personalityType);

            // Step 2.5: Merge signals (conversation + USER.md + feedback)
            const merged = mergeSignals(
              conversationCategories,
              analysis.dimensions,
              userMdSignals,
              options?.feedback ?? null,
            );

            identityData = {
              personalityType: analysis.personalityType,
              customTagline: analysis.tagline,
              customDescription: analysis.description,
              mainCategories: merged.mainCategories,
              subCategories: [...analysis.detectedInterests, ...merged.subCategories.filter(
                s => !analysis.detectedInterests.includes(s),
              )],
              dimensions: analysis.dimensions,
              tasteSpectrums: analysis.dimensions.tasteSpectrums,
              strengths: analysis.strengths,
              hiddenInsight: analysis.hiddenInsight,
              aiPlaybook: analysis.aiPlaybook,
            };

            // ⭐ Capture 2x2 metrics
            dimensions = analysis.dimensions;

            if (userMdSignals || options?.feedback) {
              console.log(`✅ Signals merged: categories=${merged.mainCategories.join(', ')}`);
            }

            console.log(`✅ Analysis complete: ${identityData.personalityType}`);
          } else {
            console.log('⚠️  Insufficient data quality for AI analysis');

            // In AUTO mode, fallback to manual Q&A
            if (mode === ExecutionMode.AUTO) {
              console.log('🔄 Falling back to manual Q&A...');
              usedManualQA = true;
            } else {
              // DATA_ONLY mode - fail
              throw new Error('Insufficient data and manual Q&A not enabled');
            }
          }
        }
      } else {
        // MANUAL mode - go straight to Q&A
        console.log('📝 Manual mode enabled, skipping data collection');
        usedManualQA = true;
      }

      // Step 2: Manual Q&A if needed
      if (usedManualQA) {
        // If we don't have answers yet, request them from user
        if (!options?.manualAnswers) {
          console.log('❓ Manual input required from user');
          return {
            success: false,
            mode: 'manual',
            needsManualInput: true,
            manualQuestions: this.manualQA.formatQuestionsForUser(),
          };
        }

        console.log('🤔 Analyzing manual Q&A responses...');
        const manualResult = await this.manualQA.analyze(options.manualAnswers);

        identityData = {
          personalityType: manualResult.personalityType,
          customTagline: manualResult.tagline,
          customDescription: manualResult.description,
          mainCategories: manualResult.mainCategories,
          subCategories: manualResult.subCategories,
          tasteSpectrums: manualResult.tasteSpectrums,
        };

        dataQuality = manualResult.confidence;
        console.log(`✅ Manual analysis complete: ${identityData.personalityType}`);
      }

      // Step 3: Recommend OpenClaw Skills
      console.log('🔍 Step 3: Finding matching skills...');
      const merged = (userMdSignals || options?.feedback)
        ? mergeSignals(
            identityData!.mainCategories,
            identityData!.dimensions || { conviction: 50, intuition: 50, contribution: 50 },
            userMdSignals,
            options?.feedback ?? null,
          )
        : null;
      const recommendations = await this.recommendSkills(identityData!, merged);
      console.log(`✅ Found ${recommendations.length} matching skills`);

      // Step 4: Save identity card with Bloom API
      let dashboardUrl: string | undefined;
      let agentUserId: number | undefined;

      const identityPayload = {
        personalityType: identityData!.personalityType,
        tagline: identityData!.customTagline,
        description: identityData!.customDescription,
        mainCategories: identityData!.mainCategories,
        subCategories: identityData!.subCategories,
        confidence: dataQuality,
        mode: (usedManualQA ? 'manual' : 'data') as 'data' | 'manual',
        dimensions,
        tasteSpectrums: identityData!.tasteSpectrums,
        strengths: identityData!.strengths,
        hiddenInsight: identityData!.hiddenInsight,
        aiPlaybook: identityData!.aiPlaybook,
        recommendations,
      };

      try {
        console.log('📝 Step 4: Saving identity with Bloom...');
        const apiBase = process.env.BLOOM_API_URL || 'https://api.bloomprotocol.ai';
        const response = await fetch(`${apiBase}/x402/agent-save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentName: 'Bloom Discovery Agent',
            userId,
            identityData: identityPayload,
          }),
        });

        const body = await response.json();
        if (response.ok && body.data?.agentUserId) {
          agentUserId = body.data.agentUserId;
          console.log(`✅ Identity saved! User ID: ${agentUserId}`);
        } else {
          console.error(`❌ API save failed: ${response.status}`, body.error || '');
        }
      } catch (saveError) {
        console.error('❌ Identity save failed:', saveError instanceof Error ? saveError.message : saveError);
      }

      // Sync discoveries (with 3s timeout)
      let discoveries: DiscoveryEntry[] = [];

      if (agentUserId) {
        try {
          const syncResult = await Promise.race([
            syncDiscoveries(agentUserId),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 3000),
            ),
          ]);
          discoveries = syncResult.newEntries;
        } catch (err) {
          console.debug('[discovery-sync] failed:', err instanceof Error ? err.message : err);
        }

        const baseUrl = process.env.DASHBOARD_URL || 'https://bloomprotocol.ai';
        dashboardUrl = `${baseUrl}/agents/${agentUserId}`;
        console.log(`✅ Dashboard: ${dashboardUrl}`);
      }

      console.log('🎉 Bloom Identity generation complete!');

      // Prepare share data for frontend buttons
      const shareData = dashboardUrl ? {
        url: dashboardUrl,
        text: `Just discovered my Bloom Identity: ${identityData!.personalityType}! 🌸\n\nCheck out my personalized skill recommendations on @bloomprotocol 🚀`,
        hashtags: ['BloomProtocol', 'BloomDiscovery', 'OpenClaw'],
      } : undefined;

      return {
        success: true,
        mode: usedManualQA ? 'manual' : 'data',
        identityData: identityData!,
        recommendations,
        discoveries,
        dashboardUrl,
        dataQuality,
        dimensions,
        actions: {
          share: shareData,
          save: dashboardUrl ? {
            prompt: 'Save this card to your Bloom collection',
            registerUrl: `${process.env.DASHBOARD_URL || 'https://bloomprotocol.ai'}/register?return=${encodeURIComponent(dashboardUrl)}`,
            loginUrl: `${process.env.DASHBOARD_URL || 'https://bloomprotocol.ai'}/login?return=${encodeURIComponent(dashboardUrl)}`,
          } : undefined,
        },
      };
    } catch (error) {
      console.error('❌ Error generating Bloom Identity:', error);
      return {
        success: false,
        mode: 'data',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Recommend skills grouped by user's main categories
   *
   * Delegates to the extracted recommendation-pipeline module so that
   * the same logic can be reused by the backend Bull queue refresh job.
   */
  private async recommendSkills(
    identity: IdentityData,
    merged?: MergedSignals | null,
  ): Promise<SkillRecommendation[]> {
    return refreshRecommendations({
      mainCategories: identity.mainCategories,
      subCategories: identity.subCategories,
      personalityType: identity.personalityType,
      dimensions: identity.dimensions,
      tasteSpectrums: identity.tasteSpectrums,
      feedback: merged ? {
        categoryWeights: merged.categoryWeights,
        excludeSkillIds: merged.excludedSkillIds,
      } : undefined,
    });
  }
}

/**
 * Skill registration for OpenClaw
 */
export const bloomIdentitySkillV2 = {
  name: 'bloom-identity',
  description: 'Generate your personalized Bloom Identity Card and discover matching projects',
  version: '2.1.0',

  triggers: [
    'generate my bloom identity',
    'create my identity card',
    'analyze my supporter profile',
    'create my bloom card',
    'discover my personality',
  ],

  async execute(context: any) {
    const skill = new BloomIdentitySkillV2();

    // Check if this is a response to manual Q&A
    const manualAnswers = context.manualAnswers;

    const result = await skill.execute(context.userId, {
      mode: ExecutionMode.AUTO,
      skipShare: !context.enableShare, // Only if user enables
      manualAnswers,
    });

    if (!result.success) {
      if (result.needsManualInput) {
        // Return questions to user
        return {
          message: result.manualQuestions,
          data: { awaitingManualInput: true },
        };
      }

      return {
        message: `❌ Failed to generate identity: ${result.error}`,
        data: result,
      };
    }

    return {
      message: formatSuccessMessage(result),
      data: result,
    };
  },
};

/**
 * Format success message for user
 */
function formatSuccessMessage(result: any): string {
  const { identityData, recommendations } = result;
  const emoji = getPersonalityEmoji(identityData.personalityType);

  // Link always first — the most important thing to surface
  let msg = '';
  if (result.dashboardUrl) {
    const suffix = recommendations?.length > 0 ? ' & recommendations' : '';
    msg += `🌸 **Your Bloom Identity Card is ready!**`;
    msg += `\n🔗 ${result.dashboardUrl}`;
    msg += `\n`;
  }

  msg += `\n${emoji} **${identityData.personalityType}** — "${identityData.customTagline}"`;
  msg += `\n\n${identityData.customDescription}`;

  if (identityData.hiddenInsight) {
    msg += `\n\n🔍 *${identityData.hiddenInsight.brief}*`;
  }

  msg += `\n\n🏷️ ${identityData.mainCategories.join(' • ')}`;

  return msg;
}

function getPersonalityEmoji(type: PersonalityType): string {
  const emojiMap = {
    [PersonalityType.THE_VISIONARY]: '💜',
    [PersonalityType.THE_EXPLORER]: '💚',
    [PersonalityType.THE_CULTIVATOR]: '🩵',
    [PersonalityType.THE_OPTIMIZER]: '🧡',
    [PersonalityType.THE_INNOVATOR]: '💙',
  };
  return emojiMap[type] || '🎴';
}

export default bloomIdentitySkillV2;
