/**
 * LevelManager - Dynamic level loading for Prometheus-exported levels
 * Integrates with existing level system in Ignit Mobile Game
 */

import { LEVEL_REGISTRY, TOTAL_LEVELS, getLevelByOrder, getNextLevel, isLevelUnlocked, getLevelPath } from '../levels';
import { loadLevel } from '../utils/levelLoader';
import type { Level } from '../types';

export interface PlayerProgress {
  completedLevels: number[];
  currentLevel: number;
  totalScore: number;
}

export class LevelManager {
  private playerProgress: PlayerProgress;
  private loadedLevels: Map<number, Level> = new Map();

  constructor() {
    this.playerProgress = this.loadPlayerProgress();
  }

  /**
   * Get available levels for the player based on progress
   */
  getAvailableLevels(): Array<{id: number, displayName: string, description: string, unlocked: boolean}> {
    return LEVEL_REGISTRY.map(levelEntry => ({
      id: levelEntry.id,
      displayName: levelEntry.displayName,
      description: levelEntry.description,
      unlocked: isLevelUnlocked(
        levelEntry.id, 
        this.playerProgress.completedLevels, 
        this.playerProgress.totalScore
      )
    }));
  }

  /**
   * Load a specific level by order
   */
  async loadLevelByOrder(levelOrder: number): Promise<Level | null> {
    console.log(`🔄 LEVELMANAGER: Загрузка уровня ${levelOrder}...`)
    
    // Check if already loaded and cached
    if (this.loadedLevels.has(levelOrder)) {
      console.log(`✅ LEVELMANAGER: Уровень ${levelOrder} найден в кэше`)
      return this.loadedLevels.get(levelOrder)!;
    }

    // Check if level exists in registry
    const levelEntry = getLevelByOrder(levelOrder);
    if (!levelEntry) {
      console.error(`❌ LEVELMANAGER: Уровень ${levelOrder} не найден в registry`);
      return null;
    }
    console.log(`✅ LEVELMANAGER: Уровень ${levelOrder} найден в registry:`, levelEntry)

    // Check if level is unlocked
    if (!isLevelUnlocked(levelOrder, this.playerProgress.completedLevels, this.playerProgress.totalScore)) {
      console.warn(`❌ LEVELMANAGER: Уровень ${levelOrder} заблокирован. Progress:`, this.playerProgress);
      return null;
    }
    console.log(`✅ LEVELMANAGER: Уровень ${levelOrder} разблокирован`)

    try {
      // Get level file path
      const levelPath = getLevelPath(levelOrder);
      if (!levelPath) {
        throw new Error(`No file path found for level ${levelOrder}`);
      }
      console.log(`✅ LEVELMANAGER: Путь к файлу: ${levelPath}`)

      // Fetch and parse level JSON
      console.log(`🔄 LEVELMANAGER: Выполняем fetch(${levelPath})...`)
      const response = await fetch(levelPath);
      console.log(`📡 LEVELMANAGER: Fetch response:`, response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch level: ${response.status} ${response.statusText}`);
      }

      console.log(`🔄 LEVELMANAGER: Парсим JSON...`)
      const levelData = await response.json();
      console.log(`✅ LEVELMANAGER: JSON распарсен. Metadata:`, levelData.metadata)
      
      // Use existing loadLevel utility to convert JSON to Level object
      console.log(`🔄 LEVELMANAGER: Конвертируем через loadLevel()...`)
      const level = await loadLevel(levelData);
      console.log(`✅ LEVELMANAGER: loadLevel() выполнен успешно`)
      
      // Add game-specific metadata
      level.metadata = {
        ...level.metadata,
        display_name: levelEntry.displayName,
        display_description: levelEntry.description,
        game_order: levelOrder
      };

      // Add registry order for UI display
      level.registryOrder = levelOrder;

      // Cache the loaded level
      this.loadedLevels.set(levelOrder, level);
      console.log(`✅ LEVELMANAGER: Уровень ${levelOrder} успешно загружен и кэширован`)
      
      return level;

    } catch (error) {
      console.error(`❌ LEVELMANAGER: Ошибка загрузки уровня ${levelOrder}:`, error);
      console.error(`❌ LEVELMANAGER: Error details:`, error.message, error.stack);
      return null;
    }
  }

  /**
   * Get the next available level
   */
  getNextAvailableLevel(): number | null {
    const currentLevel = this.playerProgress.currentLevel;
    const nextLevel = getNextLevel(currentLevel);
    
    if (nextLevel && isLevelUnlocked(nextLevel.id, this.playerProgress.completedLevels, this.playerProgress.totalScore)) {
      return nextLevel.id;
    }
    
    return null;
  }

  /**
   * Mark a level as completed
   */
  completeLevelWithScore(levelOrder: number, score: number): void {
    // Add to completed levels if not already there
    if (!this.playerProgress.completedLevels.includes(levelOrder)) {
      this.playerProgress.completedLevels.push(levelOrder);
    }

    // Update total score
    this.playerProgress.totalScore += score;

    // Advance current level if this was the current level
    if (levelOrder === this.playerProgress.currentLevel) {
      const nextLevel = this.getNextAvailableLevel();
      if (nextLevel) {
        this.playerProgress.currentLevel = nextLevel;
      }
    }

    // Save progress
    this.savePlayerProgress();
  }

  /**
   * Get current player progress
   */
  getPlayerProgress(): PlayerProgress {
    return { ...this.playerProgress };
  }

  /**
   * Get total number of levels
   */
  getTotalLevels(): number {
    return TOTAL_LEVELS;
  }

  /**
   * Get level completion percentage
   */
  getCompletionPercentage(): number {
    return (this.playerProgress.completedLevels.length / TOTAL_LEVELS) * 100;
  }

  /**
   * Reset all progress (for development/testing)
   */
  resetProgress(): void {
    this.playerProgress = {
      completedLevels: [],
      currentLevel: 1,
      totalScore: 0
    };
    this.savePlayerProgress();
    this.loadedLevels.clear();
  }

  /**
   * Load player progress from localStorage
   */
  private loadPlayerProgress(): PlayerProgress {
    try {
      const saved = localStorage.getItem('ignit_player_progress');
      if (saved) {
        const progress = JSON.parse(saved);
        return {
          completedLevels: progress.completedLevels || [],
          currentLevel: progress.currentLevel || 1,
          totalScore: progress.totalScore || 0
        };
      }
    } catch (error) {
      console.warn('Failed to load player progress:', error);
    }

    // Default progress
    return {
      completedLevels: [],
      currentLevel: 1,
      totalScore: 0
    };
  }

  /**
   * Save player progress to localStorage
   */
  private savePlayerProgress(): void {
    try {
      localStorage.setItem('ignit_player_progress', JSON.stringify(this.playerProgress));
    } catch (error) {
      console.error('Failed to save player progress:', error);
    }
  }
}

// Singleton instance
export const levelManager = new LevelManager();