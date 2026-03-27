'use strict';
const config = require('../../config/config');
const logger = require('../../utils/logger');

/**
 * LLMFactory — selects and returns the configured LLM provider.
 *
 * Providers are loaded lazily (only when first called) to avoid
 * import errors if optional dependencies are not installed.
 *
 * Priority:
 * 1. config.llm.provider (from LLM_PROVIDER env var)
 * 2. Falls back to 'static' if the configured provider has no API key
 * 3. Falls back to 'static' on any init error
 */
class LLMFactory {
  static getProvider() {
    const providerName = config.llm.provider || 'static';

    try {
      switch (providerName) {
        case 'openai': {
          if (!config.llm.openai.apiKey) {
            logger.warn('LLMFactory: OpenAI selected but OPENAI_API_KEY is not set. Falling back to static.');
            return LLMFactory._getStatic();
          }
          const OpenAIProvider = require('./OpenAIProvider');
          logger.debug('LLMFactory: Using OpenAI provider');
          return new OpenAIProvider();
        }

        case 'anthropic': {
          if (!config.llm.anthropic.apiKey) {
            logger.warn('LLMFactory: Anthropic selected but ANTHROPIC_API_KEY is not set. Falling back to static.');
            return LLMFactory._getStatic();
          }
          const AnthropicProvider = require('./AnthropicProvider');
          logger.debug('LLMFactory: Using Anthropic provider');
          return new AnthropicProvider();
        }

        case 'gemini': {
          if (!config.llm.gemini.apiKey) {
            logger.warn('LLMFactory: Gemini selected but GEMINI_API_KEY is not set. Falling back to static.');
            return LLMFactory._getStatic();
          }
          const GeminiProvider = require('./GeminiProvider');
          logger.debug('LLMFactory: Using Gemini provider');
          return new GeminiProvider();
        }

        case 'static':
        default:
          logger.debug('LLMFactory: Using static question bank');
          return LLMFactory._getStatic();
      }
    } catch (err) {
      logger.error('LLMFactory: Failed to load provider, falling back to static', { error: err.message });
      return LLMFactory._getStatic();
    }
  }

  static _getStatic() {
    const StaticProvider = require('./StaticProvider');
    return new StaticProvider();
  }
}

module.exports = LLMFactory;
