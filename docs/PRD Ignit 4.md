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

## **7. Monetization Strategy: The Power of Three**

The model is designed to give players a clear choice based on their desired level of engagement, aligning with the **"Monetization of Respect"** principle.

### **7.1. Free Version**

- **Content:** Access to the "Lab" mode with a limit of **3-5 free levels per day**. Basic statistics are available.

### **7.2. Tier 1: "Ignit Play" (Lite Subscription)**

- **Price:** ~$1.99 / month.
- **Content:** **Unlimited access to all procedurally generated levels** in the "Lab". This is the only feature.
- **Goal:** A low-barrier entry point for players who want to play more without needing advanced features.

### **7.3. Tier 2: "Ignit Premium" (Full Subscription)**

- **Price:** ~$4.99 / month or ~$29.99 / year.
- **Content:** **Everything included:**
    - Unlimited access to the "Lab".
    - Full access to the "Main Campaign" (when released).
    - All `Analytics Widgets` in "The Mirror".
    - All cosmetic items (`Themes`, `Skins`).
    - Access to exclusive `Premium Level Packs`.
- **Goal:** The main, most valuable offer that provides the complete Ignit experience.

### **7.4. Tier 3: "Ignit Forever" (One-Time Purchase)**

- **Price:** ~$79.99.
- **Content:** A lifetime license that grants all the benefits of the **"Ignit Premium"** tier, forever.
- **Goal:** An offer for our most dedicated fans and "purists" who dislike subscriptions and are willing to pay a premium for ownership.

## **8. Analytics & Data Strategy ("The Mirror")**

*(This section remains unchanged)*

### **8.1. Data Collection**

A detailed list of telemetry events must be implemented to track both final outcomes and the player's problem-solving process.

- **Reference:** See the `Analytics Specification: Ignit` document for the full list of events (e.g., `level_finished`, `component_placed`, `simulation_run`).

### **8.2. Analytics Widgets**

The collected data will power the `Analytics Widgets` available in the `Ignit Premium` tier.

- **Example Widgets:**
    - **`Cognitive Style Profile`**: Visualizes the player's dominant problem-solving approach.
    - **`Component Affinity`**: Shows which components the player uses most and least often.
    - **`Archetype Mastery`**: Analyzes player performance across different puzzle types.
- **Reference:** See the `Analytics Specification: Ignit` document for detailed technical specifications.

## **9. Level Design Framework**

*(This section remains unchanged)*

Levels are procedurally generated by the "Prometheus" engine based on a combination of three key entities: `Difficulty`, `Archetype`, and `Mutator`.

- **Reference:** All detailed specifications for level generation are located in the supplementary design documents.