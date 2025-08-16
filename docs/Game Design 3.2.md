# Game Design 3.2

**Version:** 3.2.1 (Updated)
**Date:** 15.08.2025
**Owner:** Luminoa

**Latest Update:** Added comprehensive technical implementation specification for energy calculation system, timer mechanics, level progression system, and navigation flow. This update documents the complete energy distribution physics model, Sweet Spot efficiency rules, non-performance-impacting timer system, and free progression mechanics as implemented in the production system.

## **1. Core Philosophy & Player Experience**

### **1.1. Product Vision**

Our goal is to create a deep puzzle game that organically **combines an engaging gameplay experience with an effective "brain trainer"**, focusing on problem-solving and achieving a **"flow state"**.

### **1.2. Player Fantasy**

The player is a talented engineer, capable of finding not just working solutions, but truly elegant and efficient ones for complex challenges.

### **1.3. Core Principle**

**"Challenge Logic, Reward Elegance."** The gameplay encourages **experimentation and discovery** over rote calculation.

## **2. Core Mechanic: The Energy Economy & Universal Scoring**

The foundation of every level is a resource management puzzle centered around **Energy (EU)**. The player's success is measured by a single, universal metric: **`Efficiency`**.

### **2.1. The Universal `Efficiency` Formula**

`Efficiency` is the Coefficient of Power Utilization (КПД) of the player's circuit. It answers the question: "What percentage of the total energy from the `Source` was used for productive work, rather than lost as heat?"

**`Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100`**

### **2.2. Defining `Useful Energy`**

`Useful Energy` is the sum of all energy that has been productively used in the circuit. There are only two types of productive use:

1. **Energy Delivered to `Target(s)` within Sweet Spot:** Only the energy successfully delivered to target components within their specified `Sweet Spot` ranges counts as useful. Any energy delivered outside these ranges is considered **Heat Loss** and contributes zero to the useful energy calculation.
2. **Energy Saved in `Supercapacitor`:** The energy successfully stored in the `Supercapacitor` (if present in the level). This energy is always considered useful.

**`Total Useful Energy = Energy in Sweet Spots + Energy in Supercapacitor`**

This single formula elegantly handles all level types. On levels without a `Supercapacitor`, the goal becomes minimizing waste (`Power Consumption`). On levels with a `Supercapacitor`, the goal becomes intelligently managing and storing surplus energy.

#### **2.2.1. The Sweet Spot Rule (Critical Implementation Detail)**

The **Sweet Spot Rule** is strictly enforced during efficiency calculation:

- **Target Component Definition:** Each `Target` (LED) has an energy range `[minEnergy, maxEnergy]` defined in its properties.
- **Delivered Energy Check:** After simulation, the system checks if `deliveredEnergy >= minEnergy AND deliveredEnergy <= maxEnergy`.
- **Useful Energy Assignment:**
  - **IF in Sweet Spot:** `usefulEnergy = deliveredEnergy` (full value counted)
  - **IF outside Sweet Spot:** `usefulEnergy = 0` (energy becomes Heat Loss)

**Example:**
```
Target LED: Sweet Spot [38-102] EU
Delivered: 96 EU → In range → Useful Energy = 96 EU ✅
Delivered: 34 EU → Out of range → Useful Energy = 0 EU ❌ (Heat Loss)
```

### **2.3. Energy Distribution Physics Model**

The game implements a **realistic energy distribution model** for parallel circuits that governs how the Source Energy Output is allocated across different circuit paths.

#### **2.3.1. Parallel Circuit Energy Distribution**

When a circuit has multiple parallel paths from the source to different targets, the energy is distributed **inversely proportional to the path resistance**:

**`Energy_Path = (1/Resistance_Path) / (Sum of all 1/Resistance_Paths) * Source_Energy_Output`**

**Key Principles:**
- **Lower resistance paths receive more energy** (realistic electrical physics)
- **Total distributed energy equals Source Energy Output** (energy conservation)
- **Each path operates with its allocated energy budget**

#### **2.3.2. Path Energy Calculation Process**

1. **Path Identification:** System identifies all paths from Source to each Target
2. **Resistance Calculation:** Sum of all component resistances in each path
3. **Energy Distribution:** Calculate energy allocation using inverse proportionality
4. **Component Losses:** Apply percentage-based losses for each component type
5. **Energy Delivery:** Calculate final energy delivered to each target

#### **2.3.3. Component Loss Model**

Components consume energy based on **game-balanced percentage losses**:

- **Resistors:** 5-40% loss based on resistance value
  - ≤100Ω: 5% loss
  - 101-300Ω: 10% loss  
  - 301-500Ω: 20% loss
  - 501-700Ω: 30% loss
  - >700Ω: 40% loss
- **Capacitors/Inductors:** 1% loss (minimal)
- **Switches:** 0% loss when closed, 100% loss when open

#### **2.3.4. Worked Example**

**Circuit Setup:**
- Source: 120 EU output
- PATH1: Source → Resistor(470Ω) → LED1 [Sweet Spot: 38-102 EU]
- PATH2: Source → Resistor(680Ω) → LED2 [Sweet Spot: 18-29 EU]

**Energy Distribution:**
- PATH1 conductance: 1/470 = 0.00213
- PATH2 conductance: 1/680 = 0.00147
- Total conductance: 0.00360
- PATH1 energy: (0.00213/0.00360) * 120 = 71.0 EU
- PATH2 energy: (0.00147/0.00360) * 120 = 49.0 EU

**Energy Processing:**
- PATH1: 71.0 EU → -20% loss = 56.8 EU delivered to LED1
- PATH2: 49.0 EU → -30% loss = 34.3 EU delivered to LED2

**Useful Energy Calculation:**
- LED1: 56.8 EU in [38-102] → Useful = 56.8 EU ✅
- LED2: 34.3 EU outside [18-29] → Useful = 0 EU ❌ (Heat Loss)
- Supercapacitor: 28.9 EU remaining → Useful = 28.9 EU
- **Total Useful Energy: 56.8 + 0 + 28.9 = 85.7 EU**
- **Efficiency: (85.7/120) * 100 = 71.4%**

### **2.4. Calculating the Final `Score`**

The `Final Score` (reward in coins/points) is calculated based on the player's `Efficiency`:

**`Final Score = Base Reward * Efficiency Multiplier`**

The `Base Reward` is determined by the level's `Difficulty`. The `Efficiency Multiplier` is a non-linear curve that disproportionately rewards solutions closer to 100% `Efficiency`.

## **3. Core Gameplay Loop: Player-Driven Completion**

The gameplay is designed to give the player full control over their problem-solving process.

- **The `Simulate` Button (Exploration Phase):** The player's primary tool for experimentation. It runs a simulation and provides immediate feedback on the outcome (e.g., current `Efficiency`), but **never** ends the level. The system tracks the `bestScore` achieved across all simulations.
- **The `Finish Level` Button (Completion Phase):** This button becomes active only after the player achieves a `Minimal Pass` (fulfills the basic level objectives). Pressing it officially ends the level and displays the `Success Modal`, which shows the `bestScore` from the entire session.

### **3.1. Timer System & Performance Optimization**

The game includes a **non-performance-impacting timer system** that tracks level completion time without affecting gameplay smoothness:

**Timer Implementation Principles:**
- **No Live Updates:** Timer does not update during gameplay to prevent performance impact
- **Lazy Calculation:** Time is calculated only when the level is completed using `Date.now()`
- **Start Recording:** Timer starts when the level begins loading: `levelStartTimeRef.current = Date.now()`
- **End Calculation:** Time is calculated in `finishLevel()`: `Math.floor((Date.now() - levelStartTimeRef.current) / 1000)`

**bestTime Logic:**
- **Linked to bestScore:** New personal best score automatically updates both `bestScore` and `bestTime`
- **Time-Score Coupling:** If the current attempt doesn't beat the best score, the time is ignored (maintains previous `bestTime`)
- **Single Record System:** One record tracks both the best efficiency and the time it was achieved

**Example Implementation:**
```javascript
const finishLevel = () => {
  const finalTime = levelStartTimeRef.current 
    ? Math.floor((Date.now() - levelStartTimeRef.current) / 1000) : 0
  
  const isNewRecord = prev.currentScore > prev.bestScore
  setGameState(prev => ({
    ...prev,
    levelTime: finalTime,
    bestScore: isNewRecord ? prev.currentScore : prev.bestScore,
    bestTime: isNewRecord ? finalTime : prev.bestTime,
  }))
}
```

### **3.2. Level Progression & Navigation System**

The game implements a **Free Progression System** that allows players to replay any unlocked level while maintaining overall progression:

**Navigation Screens:**
- **MainScreen:** Entry point with Play button (loads current progression level)
- **LevelsScreen:** Grid of available levels for selection and replay
- **GameScreen:** Active gameplay with level completion and progression
- **SettingsScreen:** Game configuration and preferences

**Free Progression Principles:**
- **Non-Linear Access:** Players can select any unlocked level from the Levels Screen
- **Replay Capability:** Previously completed levels remain accessible for replay and improvement
- **Progression Tracking:** `LevelManager` maintains player progress and unlocks new levels
- **Current Level Logic:** "Play" button loads the next unfinished level in progression

**Level Completion Flow:**
1. Player completes level → `completeLevelWithScore()` marks level as finished
2. System calculates next available level → `getNextAvailableLevel()`
3. If next level exists → Load next level automatically
4. If no next level → Show "All levels completed!" message
5. Player can return to Levels Screen for replay or main menu

**Level State Management:**
- **Current:** Next level to be completed in progression (orange background, play icon)
- **Passed:** Completed but sub-optimal performance (<85% efficiency, transparent background)
- **Completed:** Optimal performance achieved (≥85% efficiency, dark background)

## **4. Level & Component Design**

*(This section remains largely unchanged but is included for completeness.)*

### **4.1. Level Architecture**

Levels are constructed based on a combination of three key entities, as defined by the "Prometheus" generator:

- **`Difficulty`**: A 5-level scale defining the overall challenge.
- **`Archetype`**: The core puzzle logic (e.g., `Voltage Divider`, `LC Filter`).
- **`Mutator`**: A global rule that alters the level's physics or constraints.

### **4.2. Component Types**

- **Standard Components:** Predictable, foundational components.
- **"Imperfect Parts":** Components with slight, non-linear deviations.
- **"Black Box" Components:** Unmarked components for `Expert` difficulty levels.

## **5. UI/UX Brief for Intuitive Gameplay**

This section outlines the key principles for creating an interface that teaches the player through interaction, not text.

### **5.1. Visualize the Goal & State**

- **`Source` → `Energy Hub`:** The `Source` component must clearly display its total **`Output: [value] EU`**.
- **`Target` → `Target Gauge`:** Each `Target` component must have a visual gauge (e.g., a circular progress bar) that clearly marks the required energy range (the **`Sweet Spot`**). The gauge should fill in real-time during simulation.
- **`Supercapacitor` → `Energy Well`:** The `Supercapacitor` must have a clear fill indicator that shows how much energy has been stored.
- **Main UI Metric:** The primary metric displayed on the main game screen should be **`Best Efficiency: [value]%`**, which updates whenever the player achieves a new best result.

### **5.2. Animate for Feedback**

Animation is a core feedback tool, not a decoration.

- **Energy Flow:** During simulation, an animated texture or particles must flow through the wires. The density/speed of the flow should visually represent the amount of current.
- **Component States:**
    - **`Target`:** Must have clear visual states for underpowered (dim), correctly powered (stable bright glow), and overpowered (flickering, shaking).
    - **`Resistor`:** Can emit a subtle heat-haze effect under high load.
    - **`Supercapacitor`:** Should have a satisfying "fill" animation.
- **Positive Reinforcement:** The `Best Efficiency` text in the UI should have a prominent "pop" or "shine" animation when the player sets a new personal best for the level.

### **5.3. Interaction & Control**

- **`Simulate` Button:** This is the "test hypothesis" button. It should provide immediate feedback (e.g., show the `Efficiency` of the last run for a few seconds) and then reset, inviting further experimentation.
- **`Finish Level` Button:** This button should be disabled (`greyed out`) by default. It becomes active and visually distinct only after the player achieves the `Minimal Pass` condition, clearly signaling that they now have the *option* to end the level.

### **5.4. Levels Screen Design**

The Levels Screen provides an overview of player progression and level selection:

**Grid Layout:**
- **3-Column Responsive Grid:** Adaptive layout that maintains 3 columns across different screen sizes
- **Square Cards:** Each level card uses `aspect-ratio: 1` for consistent square appearance
- **Visual Hierarchy:** Clear differentiation between current, passed, and completed levels

**Level Card States:**
- **Current Level:** Orange background (#D84205), white text, play icon (▶) in bottom-right
- **Passed Level:** Transparent background, gray border, shows efficiency% and time
- **Completed Level:** Dark semi-transparent background, shows efficiency% and time in white text

**Level Card Content:**
- **Level Number:** Displayed as zero-padded format (001, 002, etc.)
- **Efficiency Percentage:** Shows best efficiency achieved (e.g., "88.6%")
- **Completion Time:** Shows time in MM:SS format (e.g., "03:03")
- **Visual Feedback:** Hover effects with `transform: scale(1.02)` and tap feedback

**Navigation Flow:**
- **Back Button:** Returns to MainScreen
- **Settings Access:** Quick access to settings from levels overview
- **Level Selection:** Tap any unlocked level to start playing immediately

### **5.5. Timer Display & Statistics**

**In-Game Timer Display:**
- **No Live Timer:** Timer is not displayed during gameplay to avoid distraction
- **Post-Completion Display:** Time is shown only in the success modal after level completion
- **Time Format:** Displays in minutes:seconds format (MM:SS) for readability

**Statistics Integration:**
- **Level Cards:** Show both efficiency and time for completed levels
- **Personal Records:** Clear indication when a new best time or score is achieved
- **Progress Tracking:** Visual progression through efficiency and time improvements

---

## **6. Technical Implementation Specification**

This section provides exact technical requirements for implementing the energy calculation system described above. **These specifications are critical for correct game behavior and must be followed precisely.**

### **6.1. Energy Distribution Algorithm**

The energy distribution system operates in the following sequence:

#### **Step 1: Path Discovery**
- Identify all paths from Source to each Target using graph traversal
- Each path is represented as an array: `[SOURCE, component1, component2, ..., TARGET]`

#### **Step 2: Resistance Calculation**
```
For each path:
  totalResistance = 0
  For each component in path (excluding Source and Target):
    If component.type == RESISTOR:
      totalResistance += component.actualValue
  pathResistances.push(totalResistance)
```

#### **Step 3: Energy Distribution**
```
conductances = pathResistances.map(r => r > 0 ? 1/r : 1)
totalConductance = sum(conductances)
sourceEnergy = source.getAvailableEnergy()

For each path:
  pathEnergy = (conductances[i] / totalConductance) * sourceEnergy
```

#### **Step 4: Component Loss Processing**
```
For each path:
  energyFlow = pathEnergyBudget
  For each component in path (excluding Source and Target):
    loss = calculateComponentLoss(component, energyFlow)
    energyFlow -= loss
  deliveredEnergy = max(0, energyFlow)
```

### **6.2. Useful Energy Calculation Algorithm**

#### **Step 1: Sweet Spot Validation**
```
totalUsefulEnergy = 0

For each target in energyDistribution:
  deliveredEnergy = energyDistribution[target.id]
  If target.energyRange exists:
    [minEnergy, maxEnergy] = target.energyRange
    isInSweetSpot = (deliveredEnergy >= minEnergy && deliveredEnergy <= maxEnergy)
    If isInSweetSpot:
      totalUsefulEnergy += deliveredEnergy
    Else:
      // Energy becomes Heat Loss, contributes 0 to useful energy
```

#### **Step 2: Supercapacitor Energy**
```
supercapacitorEnergy = supercapacitor.getScore()
totalUsefulEnergy += supercapacitorEnergy
```

#### **Step 3: Final Efficiency**
```
efficiency = (totalUsefulEnergy / sourceEnergyOutput) * 100
```

### **6.3. Component Loss Calculation**

**Resistor Loss Formula:**
```
If resistance <= 100: lossPercentage = 0.05
Else If resistance <= 300: lossPercentage = 0.10
Else If resistance <= 500: lossPercentage = 0.20
Else If resistance <= 700: lossPercentage = 0.30
Else: lossPercentage = 0.40

loss = energyIn * lossPercentage
```

**Other Components:**
- Capacitors/Inductors: `loss = energyIn * 0.01`
- Switches: `loss = isClosed ? 0 : energyIn`
- All others: `loss = 0`

### **6.4. Energy Conservation Validation**

The system must maintain energy conservation at all times:

**Energy Balance Check:**
```
totalEnergyIn = sourceEnergyOutput
totalEnergyOut = sum(allComponentLosses) + sum(energyDeliveredToTargets) + supercapacitorEnergy

// This equation must always be true (within floating point precision):
abs(totalEnergyIn - totalEnergyOut) < 0.01
```

### **6.5. Implementation Notes**

1. **Precision:** Use floating-point arithmetic with at least 2 decimal places precision
2. **Edge Cases:** Handle zero resistance paths with default conductance = 1
3. **Path Validation:** Ensure all paths are electrically valid (no open switches)
4. **Debug Logging:** Implement comprehensive logging for energy flow tracking
5. **Unit Testing:** All formulas must be validated with known test cases

### **6.6. Reference Implementation**

**Files implementing this specification:**
- `src/game/energyEconomy.ts` - Core energy calculation engine
- `src/hooks/useGameEngine.js` - React integration and debug utilities
- `src/game/components.ts` - Component definitions and properties

**Test Case Reference:**
The system has been validated against the worked example in Section 2.3.4, producing expected efficiency values of ~75.9% for the test circuit configuration.

### **6.7. Level Management System**

The game implements a comprehensive level management system for handling Prometheus-generated content:

#### **LevelManager Architecture**
```typescript
// Core data structures
interface PlayerProgress {
  completedLevels: number[]     // List of completed level IDs
  currentLevel: number         // Next level in progression sequence
  totalScore: number          // Cumulative score across all levels
}

class LevelManager {
  private playerProgress: PlayerProgress
  private loadedLevels: Map<number, Level>  // Level caching system
  
  // Key methods
  async loadLevelByOrder(levelOrder: number): Promise<Level | null>
  completeLevelWithScore(levelOrder: number, score: number): void
  getNextAvailableLevel(completedLevelOrder?: number): number | null
}
```

#### **Level Loading & Caching**
```javascript
// Dynamic level loading from JSON files
const levelPath = `/levels/level-${levelOrder.toString().padStart(3, '0')}.json`
const response = await fetch(levelPath)
const levelData = await response.json()
const level = await loadLevel(levelData)

// Level caching for performance
this.loadedLevels.set(levelOrder, level)  // Cache loaded level
return this.loadedLevels.get(levelOrder)  // Return cached version
```

#### **Progression Logic**
```javascript
// Free progression implementation
getNextAvailableLevel(completedLevelOrder?: number): number | null {
  const baseLevel = completedLevelOrder || this.playerProgress.currentLevel
  const nextLevel = getNextLevel(baseLevel)
  
  if (nextLevel && isLevelUnlocked(nextLevel.id, completedLevels, totalScore)) {
    return nextLevel.id
  }
  return null  // No more levels available
}

// Level completion handling
completeLevelWithScore(levelOrder: number, score: number): void {
  if (!this.playerProgress.completedLevels.includes(levelOrder)) {
    this.playerProgress.completedLevels.push(levelOrder)
  }
  this.playerProgress.totalScore += score
  
  // Advance progression if this was the current level
  if (levelOrder === this.playerProgress.currentLevel) {
    const nextLevel = this.getNextAvailableLevel(levelOrder)
    if (nextLevel) {
      this.playerProgress.currentLevel = nextLevel
    }
  }
  this.savePlayerProgress()  // Persist to localStorage
}
```

#### **Persistence & Data Management**
```javascript
// localStorage integration
private loadPlayerProgress(): PlayerProgress {
  const saved = localStorage.getItem('ignit_player_progress')
  return saved ? JSON.parse(saved) : {
    completedLevels: [],
    currentLevel: 1,
    totalScore: 0
  }
}

private savePlayerProgress(): void {
  localStorage.setItem('ignit_player_progress', JSON.stringify(this.playerProgress))
}
```

### **6.8. Timer Implementation Specification**

The timer system is implemented to provide accurate time tracking without performance impact:

#### **Timer Initialization**
```javascript
// Start timer when level loading begins
const initializeGameEngine = (canvasElement) => {
  levelStartTimeRef.current = Date.now()  // Capture start timestamp
  // ... other initialization
}
```

#### **Time Calculation**
```javascript
// Calculate final time only on level completion
const finishLevel = () => {
  const finalTime = levelStartTimeRef.current 
    ? Math.floor((Date.now() - levelStartTimeRef.current) / 1000) : 0
    
  // Update state with linked bestTime/bestScore logic
  const isNewRecord = currentScore > bestScore
  setGameState(prev => ({
    ...prev,
    levelTime: finalTime,
    bestScore: isNewRecord ? currentScore : prev.bestScore,
    bestTime: isNewRecord ? finalTime : prev.bestTime,
  }))
}
```

#### **Performance Considerations**
- **No setInterval or continuous updates**: Prevents performance degradation
- **Single timestamp capture**: Minimal memory overhead
- **Lazy calculation**: Time computed only when needed
- **Atomic updates**: State changes happen together to prevent inconsistencies