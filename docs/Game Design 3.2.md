# Game Design 3.2 - Standardized Component System

**Version:** 3.2.2 (Constructor Update)
**Date:** 19.08.2025
**Owner:** Luminoa

**Latest Update:** Major restructuring to document the new **Standardized Component System** implemented via Prometheus Constructor Mode. This update introduces fixed component catalogs, universal Sweet Spot tolerance, and predictable level balancing that replaces the previous random generation system.

## **1. Core Philosophy & Player Experience**

### **1.1. Product Vision**

Our goal is to create a deep puzzle game that organically **combines an engaging gameplay experience with an effective "brain trainer"**, focusing on problem-solving and achieving a **"flow state"** through consistent, balanced challenges.

### **1.2. Player Fantasy**

The player is a talented engineer, capable of finding not just working solutions, but truly elegant and efficient ones for complex challenges using **familiar, standardized components** that become trusted tools across multiple levels.

### **1.3. Core Principle**

**"Challenge Logic, Reward Elegance."** The gameplay encourages **experimentation and discovery** using consistent component behavior and predictable Sweet Spot ranges.

## **2. Standardized Component System (Constructor Mode)**

### **2.1. Philosophy: From Random to Predictable**

The game now uses a **Standardized Component System** that replaces random value generation with fixed catalogs of components. This ensures:

- **Predictable Balance:** All levels use consistent Sweet Spot tolerances and component values
- **Component Familiarity:** Players learn standard values and can apply knowledge across levels
- **Fair Progression:** Difficulty comes from circuit complexity, not arbitrary precision requirements

### **2.2. Universal Sweet Spot Rule**

All LED targets now use a **fixed tolerance system**:

**Sweet Spot Formula: `[Nominal Energy - 2.0, Nominal Energy + 2.0]`**

**Examples:**
- 15 EU LED → Sweet Spot: [13.0, 17.0] EU
- 25 EU LED → Sweet Spot: [23.0, 27.0] EU  
- 50 EU LED → Sweet Spot: [48.0, 52.0] EU

This eliminates the previous difficulty-based precision scaling (±20% to ±2%) in favor of consistent, fair tolerances.

### **2.3. LED Series (Target Components)**

LEDs are organized into power categories with fixed nominal values:

**Power Categories:**
- **Low Power (5-15 EU):** 5 EU, 10 EU, 15 EU
- **Medium Power (20-30 EU):** 20 EU, 25 EU, 30 EU
- **High Power (40-50 EU):** 40 EU, 50 EU  
- **Very High Power (75-100 EU):** 75 EU, 100 EU

**Difficulty Scaling:**
- **Levels 1-2:** Low/Medium Power LEDs only
- **Levels 3:** All categories available
- **Levels 4-5:** High/Very High Power emphasis

### **2.4. R-Series (Resistors)**

Standard resistance values replace random generation:

**Low Value (Fine Tuning):**
- 22Ω, 47Ω

**Core Set (Primary Values):**
- 100Ω, 220Ω, 470Ω, 680Ω, 1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ

**Component Loss Model (Updated):**
- ≤100Ω: 5% loss
- 101-300Ω: 10% loss
- 301-500Ω: 20% loss
- 501-700Ω: 30% loss
- >700Ω: 40% loss

### **2.5. C-Series (Capacitors)**

Standard capacitance values in microfarads:
- 10µF, 47µF, 100µF, 220µF, 470µF, 1000µF
- **Loss:** Fixed 1% loss per component

### **2.6. L-Series (Inductors)**

Standard inductance values in millihenries:
- 1mH, 5mH, 10mH, 22mH, 50mH, 100mH
- **Loss:** Fixed 1% loss per component

### **2.7. Voltage Source Series**

Standard voltages only:
- **Available Values:** 5V, 9V, 12V, 24V
- **Energy Output:** Dynamic (calculated by generator based on level requirements)

## **3. Core Mechanic: The Energy Economy & Universal Scoring**

The foundation of every level is a resource management puzzle centered around **Energy (EU)**. The player's success is measured by a single, universal metric: **`Efficiency`**.

### **3.1. The Universal `Efficiency` Formula**

`Efficiency` is the Coefficient of Power Utilization (КПД) of the player's circuit. It answers the question: "What percentage of the total energy from the `Source` was used for productive work, rather than lost as heat?"

**`Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100`**

### **3.2. Defining `Useful Energy`**

`Useful Energy` is the sum of all energy that has been productively used in the circuit. There are only two types of productive use:

1. **Energy Delivered to `Target(s)` within Sweet Spot:** Only the energy successfully delivered to target components within their specified `Sweet Spot` ranges counts as useful. Any energy delivered outside these ranges is considered **Heat Loss** and contributes zero to the useful energy calculation.
2. **Energy Saved in `Supercapacitor`:** The energy successfully stored in the `Supercapacitor` (if present in the level). This energy is always considered useful.

**`Total Useful Energy = Energy in Sweet Spots + Energy in Supercapacitor`**

This single formula elegantly handles all level types. On levels without a `Supercapacitor`, the goal becomes minimizing waste (`Power Consumption`). On levels with a `Supercapacitor`, the goal becomes intelligently managing and storing surplus energy.

#### **3.2.1. The Sweet Spot Rule (Critical Implementation Detail)**

The **Sweet Spot Rule** is strictly enforced during efficiency calculation using the standardized tolerance:

- **Target Component Definition:** Each `Target` (LED) has a fixed energy range using the formula `[nominal - 2.0, nominal + 2.0]`.
- **Delivered Energy Check:** After simulation, the system checks if `deliveredEnergy >= minEnergy AND deliveredEnergy <= maxEnergy`.
- **Useful Energy Assignment:**
  - **IF in Sweet Spot:** `usefulEnergy = deliveredEnergy` (full value counted)
  - **IF outside Sweet Spot:** `usefulEnergy = 0` (energy becomes Heat Loss)

**Standardized Example:**
```
Target LED: 25 EU nominal → Sweet Spot [23.0, 27.0] EU
Delivered: 24.5 EU → In range → Useful Energy = 24.5 EU ✅
Delivered: 28.2 EU → Out of range → Useful Energy = 0 EU ❌ (Heat Loss)
```

### **3.3. Energy Distribution Physics Model**

The game implements a **realistic energy distribution model** for parallel circuits that governs how the Source Energy Output is allocated across different circuit paths.

#### **3.3.1. Parallel Circuit Energy Distribution**

When a circuit has multiple parallel paths from the source to different targets, the energy is distributed **inversely proportional to the path resistance**:

**`Energy_Path = (1/Resistance_Path) / (Sum of all 1/Resistance_Paths) * Source_Energy_Output`**

**Key Principles:**
- **Lower resistance paths receive more energy** (realistic electrical physics)
- **Total distributed energy equals Source Energy Output** (energy conservation)
- **Each path operates with its allocated energy budget**

#### **3.3.2. Worked Example with Standardized Components**

**Circuit Setup:**
- Source: 120 EU output, 12V (standard voltage)
- PATH1: Source → Resistor(470Ω) → LED1 [15 EU nominal → Sweet Spot: 13.0-17.0]
- PATH2: Source → Resistor(680Ω) → LED2 [25 EU nominal → Sweet Spot: 23.0-27.0]

**Energy Distribution:**
- PATH1 conductance: 1/470 = 0.00213
- PATH2 conductance: 1/680 = 0.00147
- Total conductance: 0.00360
- PATH1 energy: (0.00213/0.00360) * 120 = 71.0 EU
- PATH2 energy: (0.00147/0.00360) * 120 = 49.0 EU

**Energy Processing with Standard Loss Values:**
- PATH1: 71.0 EU → -20% loss (470Ω standard loss) = 56.8 EU delivered to LED1
- PATH2: 49.0 EU → -30% loss (680Ω standard loss) = 34.3 EU delivered to LED2

**Useful Energy Calculation:**
- LED1: 56.8 EU outside [13.0-17.0] → Useful = 0 EU ❌ (Heat Loss)
- LED2: 34.3 EU outside [23.0-27.0] → Useful = 0 EU ❌ (Heat Loss)
- Supercapacitor: 28.9 EU remaining → Useful = 28.9 EU
- **Total Useful Energy: 0 + 0 + 28.9 = 28.9 EU**
- **Efficiency: (28.9/120) * 100 = 24.1%**

*Note: This example demonstrates a poorly optimized circuit where the standard component values don't match the LED requirements, teaching players to select appropriate components.*

### **3.4. Calculating the Final `Score`**

The `Final Score` (reward in coins/points) is calculated based on the player's `Efficiency`:

**`Final Score = Base Reward * Efficiency Multiplier`**

The `Base Reward` is determined by the level's `Difficulty`. The `Efficiency Multiplier` is a non-linear curve that disproportionately rewards solutions closer to 100% `Efficiency`.

## **4. Level Architecture & Prometheus Integration**

### **4.1. Level Generation Philosophy**

Levels are now generated using **Prometheus Constructor Mode**, which:

- **Eliminates Random Values:** Uses only standardized component catalogs
- **Disables Sweet Spot Optimization:** Preserves universal ±2.0 EU tolerance
- **Ensures Component Compliance:** Validates all components against standard catalogs
- **Maintains Archetype Variety:** Uses different circuit patterns for complexity

### **4.2. Level Metadata Enhancement**

All levels now include constructor mode metadata:

```json
{
  "metadata": {
    "generator_version": "2.0.0-constructor",
    "difficulty": 1,
    "primary_archetype": "splitter"
  },
  "validation_results": {
    "validation_performed": true,
    "constructor_mode": true,
    "standardized_ranges": "Nominal ± 2.0 EU"
  }
}
```

### **4.3. Archetype Patterns Using Standardized Components**

**Splitter Archetype:**
- Uses standard resistor values for voltage division
- LED selection based on difficulty level
- Component count scales with difficulty (2-6 components)

**Stabilizer Archetype:**
- LC filter circuits using standard L/C values
- Focuses on smoothing unstable power sources
- Higher difficulty adds multiple filter stages

**Protector Archetype:**
- Current limiting using standard resistor combinations
- Shunt circuits with supercapacitor energy storage
- Component selection emphasizes power handling

## **5. Core Gameplay Loop: Player-Driven Completion**

The gameplay is designed to give the player full control over their problem-solving process with consistent, predictable component behavior.

- **The `Simulate` Button (Exploration Phase):** The player's primary tool for experimentation. It runs a simulation and provides immediate feedback on the outcome (e.g., current `Efficiency`), but **never** ends the level. The system tracks the `bestScore` achieved across all simulations.
- **The `Finish Level` Button (Completion Phase):** This button becomes active only after the player achieves a `Minimal Pass` (fulfills the basic level objectives). Pressing it officially ends the level and displays the `Success Modal`, which shows the `bestScore` from the entire session.

### **5.1. Timer System & Performance Optimization**

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

### **5.2. Level Progression & Navigation System**

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

## **6. UI/UX Brief for Standardized Component System**

### **6.1. Component Recognition & Learning**

The standardized system requires enhanced UI to help players learn and recognize component values:

**Component Labeling:**
- **Clear Value Display:** All resistors show their standard values (470Ω, 1kΩ, etc.)
- **LED Nominal Values:** Target LEDs display their nominal energy (15 EU, 25 EU, etc.)
- **Voltage Source Labels:** Sources clearly show standard voltages (5V, 12V, etc.)

**Sweet Spot Visualization:**
- **Universal Range Indicators:** All LED gauges use consistent ±2.0 EU range visualization
- **Color Coding:** Green zone for Sweet Spot, red zones for over/under energy
- **Numeric Feedback:** Display exact delivered energy vs. required range

### **6.2. Progressive Component Introduction**

**Difficulty-Based Component Availability:**
- **Levels 1-2:** Limited to core resistor values (100Ω, 220Ω, 470Ω, 1kΩ)
- **Levels 3-4:** Full resistor catalog becomes available
- **Levels 4-5:** Complex component combinations (RC, LC circuits)

**Component Familiarity System:**
- **Consistent Values:** Same component values appear across multiple levels
- **Progressive Complexity:** New component types introduced gradually
- **Value Recognition:** Players learn to associate standard values with typical applications

### **6.3. Levels Screen Design Enhancement**

The Levels Screen now emphasizes the standardized system:

**Level Card Enhancements:**
- **Component Indicators:** Icons showing which component types are featured
- **Difficulty Progression:** Visual indication of component complexity increase
- **Standardization Badges:** Special indicators for Constructor Mode levels

## **7. Technical Implementation Specification**

### **7.1. Constructor Mode Integration**

The system now operates in Constructor Mode by default:

```javascript
// Constructor mode validation
const isConstructorMode = levelData.validation_results?.constructor_mode === true
const hasStandardizedRanges = levelData.validation_results?.standardized_ranges === "Nominal ± 2.0 EU"

// Sweet Spot calculation for standardized components
function calculateSweetSpot(nominalEnergy) {
    const tolerance = 2.0  // Universal tolerance
    return [nominalEnergy - tolerance, nominalEnergy + tolerance]
}
```

### **7.2. Component Catalog Validation**

```javascript
// Standard component catalogs
const STANDARD_RESISTORS = [22, 47, 100, 220, 470, 680, 1000, 2200, 4700, 10000]
const STANDARD_CAPACITORS = [0.00001, 0.000047, 0.0001, 0.00022, 0.00047, 0.001]
const STANDARD_VOLTAGES = [5, 9, 12, 24]
const STANDARD_LED_NOMINALS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100]

// Validation function
function validateStandardizedLevel(levelData) {
    // Check all components are from standard catalogs
    // Verify Sweet Spot ranges use ±2.0 EU formula
    // Ensure generator_version indicates constructor mode
}
```

### **7.3. Energy Calculation with Standardized Components**

The energy calculation system now optimizes for standardized component behavior:

```javascript
// Component loss calculation using standard values
function getStandardizedLoss(component) {
    if (component.type === 'resistor') {
        const resistance = component.actualValue
        if (resistance <= 100) return 0.05
        else if (resistance <= 300) return 0.10
        else if (resistance <= 500) return 0.20
        else if (resistance <= 700) return 0.30
        else return 0.40
    }
    // Standard losses for other components...
}
```

### **7.4. Level Loading & Validation**

```javascript
// Enhanced level loading with constructor mode detection
async function loadStandardizedLevel(levelOrder) {
    const levelData = await fetch(`/levels/level-${levelOrder.toString().padStart(3, '0')}.json`)
    const level = await levelData.json()
    
    // Validate standardized components
    if (!validateStandardizedLevel(level)) {
        console.error('Level contains non-standard components')
        return null
    }
    
    return processStandardizedLevel(level)
}
```

## **8. Benefits of the Standardized System**

### **8.1. For Players**

- **Predictable Learning Curve:** Consistent Sweet Spot tolerances across all levels
- **Component Mastery:** Standard values become familiar tools for problem-solving
- **Fair Challenge Scaling:** Difficulty increases through circuit complexity, not arbitrary precision
- **Transferable Knowledge:** Skills learned in early levels apply throughout the game

### **8.2. For Designers**

- **Balanced Content Pipeline:** Automated generation produces consistently balanced levels
- **Predictable Difficulty:** Component complexity directly correlates with challenge level
- **Quality Assurance:** No random outliers or impossible precision requirements
- **Maintainable Content:** Centralized component catalogs enable easy updates

### **8.3. For Development**

- **Debugging Efficiency:** Standard values make level behavior predictable and testable
- **Performance Optimization:** Component caching and validation simplified
- **Content Validation:** Automated checks prevent non-standard component usage
- **Future-Proof Architecture:** Easy to add new standard components to catalogs

---

**This Game Design document reflects the evolution from random generation to a sophisticated, standardized component system that ensures consistent, balanced, and fair gameplay experiences across all difficulty levels while maintaining the core puzzle-solving challenge that defines the Ignit experience.**