# PRD Ignit 3.0

**Version:** 3.0
**Status:** Pre-release MVP (Early Access)

## **1. Define the Product**

- **Product Name:** Ignit
- **High-Level Summary:** Ignit is a minimalist puzzle game for the "Cognitive Health" market. It provides users with a series of engaging cognitive exercises based on the logic of electronic circuits, designed to train focus, systematic thinking, and problem-solving skills.
- **Platform:** iOS & Android.
- **Product Purpose & Pain Point Solved:** The primary goal of Ignit is to provide an elegant and effective tool for "brain gymnastics". The product solves the key problem of existing simulators: a high entry barrier and intimidating interface. We adapt this complex but highly rewarding discipline for beginners, ensuring a smooth onboarding and skill progression.
- **Target Audience:**
    - **"Conscious Enthusiasts":** Users seeking intellectual development and meditative focus in their gaming experiences.
    - **Adults (30+):** An audience concerned with their cognitive health, looking for alternatives to traditional brain-training games.
- **User Value Proposition:** Ignit's value lies in providing a unique experience where the player can immerse themselves in the process of **thinking** and achieve deep satisfaction from finding an elegant solution. The fact that they also learn the basics of electronics is a valuable bonus, not the primary goal.
- **Monetization Model:** *Freemium*, built on the **"Monetization of Respect"** principle. Core gameplay is free. Monetization comes from optional enhancements:
    - **Depth & Analytics:** Purchasing advanced widgets for the statistics screen (`The Mirror`), subscribing to *premium* puzzle packs.
    - **Comfort:** Purchasing **"helping tools"**, additional **"save game"** slots.
    - **Customization:** Purchasing cosmetic themes and component skins.
- **Key Differentiators:**
    1. Focus on **"cognitive exercise"**, not academic instruction.
    2. Unique core mechanic: **"Sweet Spot + Supercapacitor"**.
    3. Impeccable **UX** and accessibility for newcomers.

## **2. Determine Goals**

### **Goal 1: Player Engagement & Satisfaction**

- **M (Measurable):**
    - *Average App Store Rating:* **4.6+**.
    - *Day 1 Retention:* **≥ 40%**.
    - *Day 7 Retention:* **≥ 20%**.
- **T (Time-bound):** Within **6 months** of global launch.

### **Goal 2: Business & Monetization**

- **M (Measurable):**
    - *Conversion Rate* (to paying user): **3%**.
    - *ARPU* (Average Revenue Per User): **$0.25**.
- **T (Time-bound):** Within **12 months** of global launch.

### **Goal 3: Product Roadmap**

- **M (Measurable):**
    - *MVP Launch:* "Lab" mode, powered by the "Prometheus" generator, is released to a closed group of testers to validate the quality of generated levels.
    - *Post-launch Update:* "Main Campaign" with handcrafted levels is released as the first major update.
- **T (Time-bound):**
    - *MVP Release:* **Q4 2026**.
    - *"Main Campaign" Release:* Within **6-9 months** post-MVP launch.

## **3. Tech Stack Analysis**

- **Tech Stack:** TypeScript, React, Vite, Material UI (with sx props), Framer Motion.
- **Key Implementations:**
    - **Simulation Engine:** The core physics engine will be implemented in **TypeScript**.
    - **Game Canvas:** The interactive game board will use **HTML Canvas** with a **WebGL** library (e.g., `react-three-fiber`) to ensure high performance for rendering and visual effects.
    - **UI & Animations:** The main UI will be built with **React, Material UI, and Framer Motion**. A hybrid approach of CSS animations and PNG sprites will be used for visual effects.
    - **Level Generator "Prometheus":** This is a separate sub-product (e.g., a Node.js/Python script) that generates level data in a **JSON format**. The main application will consume these JSON files to render levels.

## **4. Limit the Scope of Work**

### **In-Scope for MVP (Pre-release / Early Access):**

- **Core Feature:** The **"Lab"** mode, powered by the **"Prometheus"** level generator.
- **Core Gameplay Loop:** A fully functional **"Energy Economy"** mechanic and scoring system.
- **UI/UX:** A functional **"grey-box"** prototype using standard **Material UI** components.
- **Feedback Mechanism:** An in-game tool for players to report bugs and rate levels.
- **Core Analytics:** Implementation of all telemetry events specified in Section 8.

### **Out-of-Scope for MVP:**

- **"Main Campaign"** with handcrafted levels.
- **Polished Visuals** and complex custom animations.
- **Monetization:** The IAP store and all related features.
- **"The Mirror":** Analytics widgets will not be displayed to the user in the MVP.

## 5. Core Gameplay & Scoring

### **5.1. Core Philosophy**

"Challenge Logic, Reward Elegance." The gameplay encourages experimentation and discovery over rote calculation.

### **5.2. Core Gameplay Loop: Player-Driven Completion**

The gameplay gives the player full control over their problem-solving process.

- **The `Simulate` Button (Exploration Phase):** The player's primary tool for experimentation. It runs a simulation and provides immediate feedback on the outcome (e.g., current `Efficiency`), but **never** ends the level. The system tracks the `bestScore` achieved across all simulations.
- **The `Finish Level` Button (Completion Phase):** This button becomes active only after the player achieves a `Minimal Pass` (fulfills the basic level objectives). Pressing it officially ends the level and displays the `Success Modal`, which shows the `bestScore` from the entire session.

### **5.3. Universal Scoring Formula**

The player's success is measured by a single, universal metric: **`Efficiency`**.

- **Formula:** `Efficiency (%) = (Total Useful Energy / Source Energy Output) * 100`
- **`Useful Energy` Definition:** The sum of energy productively used in the circuit.
    - `Total Useful Energy = Energy on Targets + Energy in Supercapacitor`
- **`Final Score` Calculation:** The reward is calculated based on `Efficiency`.
    - `Final Score = Base Reward * Efficiency Multiplier`
    - The `Efficiency Multiplier` is a non-linear curve that disproportionately rewards solutions closer to 100% `Efficiency`.

## **6. UI/UX Principles for Intuitive Gameplay**

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

## **7. Monetization Strategy: "Purist's Freemium"**

### **7.1. Economy**

- **Soft Currency:** None.
- **Hard Currency:**
    - **Primary Source:** In-App Purchase (IAP).
    - **Secondary Source:** Small, fixed rewards for non-repeatable high-tier achievements.

### **7.2. IAP Store Structure**

Products are purchased with `Hard Currency` across three categories:

- **Depth & Analytics:** Unlockable `Analytics Widgets` for the "The Mirror" stats screen.
- **Comfort:** Consumable `Helping Tools` and permanent upgrades like `Sandbox Slots`.
- **Customization:** Non-gameplay affecting `Visual Themes` and cosmetic `Component Skins`.

### **7.3. Player Lifecycle Strategy**

- **New Players (Days 1-7):** Minimal monetization exposure. Offer a small gift of `Hard Currency` to encourage store discovery.
- **Engaged Players (Days 7-30):** Display locked `Analytics Widgets` within the stats screen as a contextual offering.
- **Mastery Players (Days 30+):** Offer exclusive, challenging `Premium Level Packs` and high-value cosmetic items.

## **8. Analytics & Data Strategy ("The Mirror")**

### **8.1. Data Collection**

A detailed list of telemetry events must be implemented to track both final outcomes and the player's problem-solving process.

- **Reference:** See the `Analytics Specification: Ignit` document for the full list of events (e.g., `level_finished`, `component_placed`, `simulation_run`).

### **8.2. Analytics Widgets**

The collected data will power the `Analytics Widgets` available for purchase. These widgets provide players with deep insights into their cognitive style.

- **Example Widgets:**
    - **`Cognitive Style Profile`**: Visualizes the player's dominant problem-solving approach (e.g., "Planner" vs. "Iterator").
    - **`Component Affinity`**: Shows which components the player uses most and least often.
    - **`Archetype Mastery`**: Analyzes player performance across different puzzle types.
- **Reference:** See the `Analytics Specification: Ignit` document for detailed technical specifications of each widget.

## **9. Level Design Framework**

Levels are procedurally generated by the "Prometheus" engine based on a combination of three key entities: `Difficulty`, `Archetype`, and `Mutator`.

- **Reference:** All detailed specifications for level generation are located in the supplementary design documents (`Game Design 3.md`, `Ignit Levels - ... .csv`, etc.).