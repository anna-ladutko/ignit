# PRD Ignit 4.0

**Version:** 4
**Status:** Pre-release MVP (Early Access)

## **1. Define the Product**

- **Product Name:** Ignit
- **High-Level Summary:** Ignit is a minimalist puzzle game for the "Cognitive Health" market. It provides users with a series of engaging cognitive exercises based on the logic of electronic circuits, designed to train focus, systematic thinking, and problem-solving skills.
- **Platform:** iOS & Android.
- **Product Purpose & Pain Point Solved:** The primary goal of Ignit is to provide an elegant and effective tool for "brain gymnastics". The product solves the key problem of existing simulators: a high entry barrier and intimidating interface. We adapt this complex but highly rewarding discipline for beginners, ensuring a smooth onboarding and skill progression.
- **Target Audience:**
    - **"Conscious Enthusiasts":** Users seeking intellectual development and meditative focus in their gaming experiences.
    - **Adults (30+):** An audience concerned with their cognitive health, looking for alternatives to traditional brain-training games.
- **Key Differentiators:**
    1. Focus on **"cognitive exercise"**, not academic instruction.
    2. Unique core mechanic: **"Sweet Spot + Energy Economy"**.
    3. Impeccable **UX** and accessibility for newcomers.

## **2. Determine Goals**

*(This section remains unchanged as it is still relevant)*

### **Goal 1: Player Engagement & Satisfaction**

- **M (Measurable):**
    - *Average App Store Rating:* **4.6+**.
    - *Day 1 Retention:* **≥ 40%**.
    - *Day 7 Retention:* **≥ 20%**.
- **T (Time-bound):** Within **6 months** of global launch.

### **Goal 2: Business & Monetization**

- **M (Measurable):**
    - *Conversion Rate* (to any paying tier): **5%**.
    - *ARPU* (Average Revenue Per User): **$0.35**.
- **T (Time-bound):** Within **12 months** of global launch.

### **Goal 3: Product Roadmap**

- **M (Measurable):**
    - *MVP Launch:* "Lab" mode is released to testers to validate the quality of generated levels.
    - *Post-launch Update:* "Main Campaign" with handcrafted levels is released.
- **T (Time-bound):**
    - *MVP Release:* **Q4 2026**.
    - *"Main Campaign" Release:* Within **6-9 months** post-MVP launch.

## **3. Tech Stack Analysis**

*(This section remains unchanged)*

- **Tech Stack:** TypeScript, React, Vite, Material UI (with sx props), Framer Motion.
- **Key Implementations:**
    - **Simulation Engine:** Implemented in **TypeScript**.
    - **Game Canvas:** Will use **HTML Canvas** with a **WebGL** library (e.g., `react-three-fiber`).
    - **UI & Animations:** Built with **React, Material UI, and Framer Motion**.
    - **Level Generator "Prometheus":** A separate sub-product generating level data in **JSON format**.

## **4. Limit the Scope of Work**

### **In-Scope for MVP (Pre-release / Early Access):**

- **Core Feature:** The **"Lab"** mode, powered by the **"Prometheus"** level generator, with a limit of 3-5 free levels per day.
- **Core Gameplay Loop:** A fully functional **"Energy Economy"** mechanic and scoring system.
- **UI/UX:** A functional **"grey-box"** prototype using standard **Material UI** components.
- **Feedback Mechanism:** An in-game tool for players to report bugs and rate levels.
- **Core Analytics:** Implementation of all telemetry events specified in Section 8.

### **Out-of-Scope for MVP:**

- **"Main Campaign"** with handcrafted levels.
- **Polished Visuals** and complex custom animations.
- **Monetization:** The subscription/purchase flows.
- **"The Mirror":** Analytics widgets will not be displayed to the user in the MVP.

## **5. Core Gameplay & Scoring**

### **5.1. Core Philosophy**

"Challenge Logic, Reward Elegance." The gameplay encourages experimentation and discovery over rote calculation.

### **5.2. Core Gameplay Loop: Player-Driven Completion**

The gameplay gives the player full control over their problem-solving process.

- **The `Simulate` Button (Exploration Phase):** The player's primary tool for experimentation. It runs a simulation and provides immediate feedback on the outcome (e.g., current `Efficiency`), but **never** ends the level. The system tracks the `bestScore` achieved across all simulations.
- **The `Finish Level` Button (Completion Phase):** This button becomes active only after the player achieves a `Minimal Pass` (fulfills the basic level objectives). Pressing it officially ends the level and displays the `Success Modal`, which shows the `bestScore` from the entire session.

### **5.3. Universal Scoring Metric: `Efficiency`**

The player's success and mastery are measured by a single, universal metric: **`Efficiency`**. This score is the primary reward in itself, feeding into the player's statistics and leaderboards.

- **Formula:** `Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100`
- **`Useful Energy` Definition:** The sum of energy productively used in the circuit.
    - `Total Useful Energy = Energy on Targets + Energy in Supercapacitor`

### **5.4. Timer System & Performance Tracking**

The game includes a **non-performance-impacting timer system** that tracks completion time without affecting gameplay smoothness:

**Timer Features:**
- **Lazy Calculation:** Time calculated only upon level completion, preventing performance impact
- **Best Time Tracking:** Personal best times are recorded and displayed alongside efficiency scores
- **Score-Time Linking:** New efficiency records automatically update both best score and best time
- **Time Display:** Shown in MM:SS format for readability (e.g., "03:42")

**Performance Philosophy:**
- No live timer updates during gameplay to maintain 60fps performance
- Timer data serves as secondary metric to efficiency for player progression tracking
- Provides additional replay motivation for completed levels

## **6. Navigation & Screen Architecture**

The game implements a **four-screen navigation system** designed for clear user flow and progressive disclosure:

### **6.1. MainScreen (Entry Point)**

The primary landing screen that serves as the game's hub:

**Core Elements:**
- **Play Button:** Loads the next level in player progression sequence
- **Levels Button:** Access to level selection grid for replay and exploration
- **Settings Button:** Game configuration and preferences
- **Dev Mode Access:** Developer tools for debugging (development builds only)

**User Experience:**
- Clean, focused design that emphasizes the primary "Play" action
- Clear visual hierarchy guiding players to continue their progression
- Quick access to all game sections without overwhelming new users

### **6.2. LevelsScreen (Level Selection)**

A comprehensive overview of available levels with progression tracking:

**Grid Layout:**
- **3-Column Responsive Design:** Maintains consistent layout across devices
- **Square Level Cards:** Uniform visual treatment using `aspect-ratio: 1`
- **Progressive Disclosure:** Only unlocked levels are displayed to maintain focus

**Level Card States:**
- **Current Level:** Orange background, play icon, represents next progression step
- **Passed Level:** Transparent background with border, shows completion statistics
- **Completed Level:** Dark background, represents optimal performance achieved

**Information Display:**
- **Level Numbers:** Zero-padded format (001, 002, 003) for professional appearance
- **Efficiency Scores:** Best efficiency percentage achieved (e.g., "88.6%")
- **Completion Times:** Best time in MM:SS format (e.g., "03:42")
- **Visual Feedback:** Hover effects and tap responses for interactive clarity

### **6.3. GameScreen (Active Gameplay)**

The core gameplay interface implementing the hybrid architecture:

**Layout Components:**
- **TopGameBar:** Level info, current score, energy usage, and best records
- **Game Canvas:** Interactive area for component placement and circuit building
- **Component Palette:** Available components for the current level
- **Game Controls:** Simulate, Reset, Finish Level, and utility buttons

**User Flow Integration:**
- **Back Navigation:** Returns to previous screen (MainScreen or LevelsScreen)
- **Level Completion:** Automatic progression or manual return based on context
- **Session Management:** Maintains best scores and times throughout gameplay session

### **6.4. SettingsScreen (Configuration)**

Game preferences and configuration options:

**Settings Categories:**
- **Gameplay Preferences:** Difficulty settings, tutorial options
- **Audio/Visual:** Sound effects, music, visual feedback intensity
- **Developer Options:** Debug modes, performance metrics (development builds)

**Navigation:**
- **Back Button:** Returns to calling screen (MainScreen or LevelsScreen)
- **Save Persistence:** Automatic saving of preferences to localStorage

### **6.5. Navigation Flow & User Journey**

**Primary User Paths:**
1. **Progression Path:** MainScreen → GameScreen → Success Modal → Next Level
2. **Exploration Path:** MainScreen → LevelsScreen → Selected Level → GameScreen
3. **Configuration Path:** Any Screen → SettingsScreen → Previous Screen

**Free Progression Philosophy:**
- **Non-Linear Access:** Players can jump to any unlocked level for replay
- **Progression Continuity:** "Play" button always loads the next unfinished level
- **Context Preservation:** System remembers how players reached GameScreen for proper back navigation

## **7. UI/UX Principles for Intuitive Gameplay**

- **Visualize the Goal & State:**
    - **`Source`** must display its total **`Output: [value] EU`**.
    - **`Target`** must have a visual gauge that clearly marks the **`Sweet Spot`**.
    - The main UI metric displayed is **`Best Efficiency: [value]%`**.
- **Animate for Feedback:**
    - **Energy Flow:** Animated particles must flow through wires, with density/speed representing current.
    - **Component States:** Components must visually react to the energy they receive (e.g., dim, bright, flickering).
- **Interaction & Control:**
    - The `Simulate` button is always available for experimentation.
    - The `Finish Level` button is disabled by default and becomes active only after a `Minimal Pass` is achieved.

### **7.1. Cross-Screen Consistency**

**Visual Design Language:**
- **Typography:** Consistent font families and sizing across all screens
- **Color Palette:** Unified color scheme maintaining brand identity
- **Spacing & Layout:** Consistent margin, padding, and component sizing
- **Border Radius:** Standardized corner radius values for visual cohesion

**Interaction Patterns:**
- **Button Behaviors:** Consistent hover effects, tap feedback, and disabled states
- **Navigation Elements:** Uniform back button placement and behavior
- **Loading States:** Consistent feedback for async operations across screens

## **8. Level Content & Management System**

The game utilizes the **Prometheus Level Generator** to create procedurally generated content with a robust management system:

### **8.1. Level Generation & Format**

**Prometheus Integration:**
- **JSON-Based Levels:** All levels are generated as JSON files by the Prometheus system
- **Dynamic Loading:** Levels are loaded on-demand from `/levels/level-XXX.json` files
- **Metadata Structure:** Each level includes metadata, circuit definition, and solution data
- **Unique Identifiers:** Every level has a unique UUID for tracking and analytics

**Level Registry System:**
- **Auto-Generated Registry:** `level-registry.ts` contains all available levels and unlock requirements
- **Progressive Unlocking:** Levels unlock based on completion of previous levels and score thresholds
- **Difficulty Scaling:** Levels are organized by difficulty and archetype for balanced progression

### **8.2. Player Progress Management**

**Progress Persistence:**
- **LocalStorage Integration:** Player progress is automatically saved to browser storage
- **Cross-Session Continuity:** Progress persists between game sessions
- **Backup & Recovery:** Robust error handling for corrupted save data

**Progress Tracking:**
- **Completed Levels:** List of all levels the player has finished
- **Current Level:** Next level in the progression sequence
- **Total Score:** Cumulative efficiency scores across all completed levels
- **Best Performances:** Individual best scores and times for each level

## **9. Monetization Strategy: The Power of Three**

The model is designed to give players a clear choice based on their desired level of engagement, aligning with the **"Monetization of Respect"** principle.

### **9.1. Free Version**

- **Content:** Access to the "Lab" mode with a limit of **3-5 free levels per day**. Basic statistics are available.

### **9.2. Tier 1: "Ignit Play" (Lite Subscription)**

- **Price:** ~$1.99 / month.
- **Content:** **Unlimited access to all procedurally generated levels** in the "Lab". This is the only feature.
- **Goal:** A low-barrier entry point for players who want to play more without needing advanced features.

### **9.3. Tier 2: "Ignit Premium" (Full Subscription)**

- **Price:** ~$4.99 / month or ~$29.99 / year.
- **Content:** **Everything included:**
    - Unlimited access to the "Lab".
    - Full access to the "Main Campaign" (when released).
    - All `Analytics Widgets` in "The Mirror".
    - All cosmetic items (`Themes`, `Skins`).
    - Access to exclusive `Premium Level Packs`.
- **Goal:** The main, most valuable offer that provides the complete Ignit experience.

### **9.4. Tier 3: "Ignit Forever" (One-Time Purchase)**

- **Price:** ~$79.99.
- **Content:** A lifetime license that grants all the benefits of the **"Ignit Premium"** tier, forever.
- **Goal:** An offer for our most dedicated fans and "purists" who dislike subscriptions and are willing to pay a premium for ownership.

## **10. Analytics & Data Strategy ("The Mirror")**

*(This section remains unchanged)*

### **10.1. Data Collection**

A detailed list of telemetry events must be implemented to track both final outcomes and the player's problem-solving process.

- **Reference:** See the `Analytics Specification: Ignit` document for the full list of events (e.g., `level_finished`, `component_placed`, `simulation_run`).

### **10.2. Analytics Widgets**

The collected data will power the `Analytics Widgets` available in the `Ignit Premium` tier.

- **Example Widgets:**
    - **`Cognitive Style Profile`**: Visualizes the player's dominant problem-solving approach.
    - **`Component Affinity`**: Shows which components the player uses most and least often.
    - **`Archetype Mastery`**: Analyzes player performance across different puzzle types.
- **Reference:** See the `Analytics Specification: Ignit` document for detailed technical specifications.

## **11. Level Design Framework**

*(This section remains unchanged)*

Levels are procedurally generated by the "Prometheus" engine based on a combination of three key entities: `Difficulty`, `Archetype`, and `Mutator`.

- **Reference:** All detailed specifications for level generation are located in the supplementary design documents.