# PRD: Level Generator "Prometheus"

- **Product:** Automated Level Generation Tool for the puzzle game "Ignit".
- **Version:** 2.0
- **Date:** 09.08.2025
- **Owner:** Luminoa

## 1. Overview

### 1.1. Purpose

This document specifies the functional and non-functional requirements for "Prometheus," an external tool for the automated generation and validation of game levels.

### 1.2. Target User

- **Primary User:** Lead Game Designer / Producer.
- **User Goal:** To define high-level parameters for content generation and assemble the output into game campaigns, events, and DLC.

### 1.3. Product Goals

- **Automation:** Eliminate manual level design, reducing content creation time.
- **Quality Assurance:** Ensure every generated level is 100% solvable, balanced, and meets design intent.
- **Creative Control:** Provide the designer with powerful tools to direct the style, difficulty, and variety of generated content.

## 2. Level Configuration Parameters

This section defines the input parameters the user provides to the generator. The generator will use these parameters to construct and validate levels.

### 2.1. Difficulty

A 5-point scale defining the level's complexity.

- **Level 1 (Tutorial):**
    - **Description:** Introduces a single, core mechanic to a new player.
    - **Configuration:** Simple series circuit; 1 target; Wide precision (+/- 20%); 0 Red Herrings; No Hybrids or Mutators.
- **Level 2 (Basic):**
    - **Description:** Tests the player's understanding of basic mechanics in a slightly more complex scenario.
    - **Configuration:** Simple parallel circuit; 1-2 targets; Wide precision (+/- 15%); 0-1 Red Herrings; No Hybrids or Mutators.
- **Level 3 (Advanced):**
    - **Description:** Requires the player to combine multiple concepts to find a solution.
    - **Configuration:** Requires LC-filters or complex branches; 2 targets; Medium precision (+/- 10%); 1-2 Red Herrings; May include one Mutator.
- **Level 4 (Hard):**
    - **Description:** Requires the player to find a single, specific, and non-obvious solution among many possibilities.
    - **Configuration:** Complex mixed topologies; 2-3 targets; Narrow precision (+/- 5%); 2-3 Red Herrings; Must use Hybrid Archetypes.
- **Level 5 (Expert):**
    - **Description:** Requires non-standard thinking and a deep understanding of the game's physics to overcome unique constraints.
    - **Configuration:** Non-obvious topologies; 2-3 targets with conflicting requirements; Critical precision (+/- 2%); 3+ Red Herrings; Must use complex Hybrids and critical Mutators.

### 2.2. Primary Archetype

The main objective of the level. One must be selected.

- **Stabilizer:** The player's primary goal is to smooth an unstable power source (`is_stable: false`) to provide a clean energy flow to a sensitive target.
- **Splitter:** The player's primary goal is to distribute power from one source to multiple targets, each with unique energy requirements.
- **Timed Charge:** The player's primary goal is to deliver a precise amount of energy to a target component (usually a Capacitor) via a Switch.
- **Protector:** The player's primary goal is to protect a sensitive target from an overpowered source by efficiently shunting excess energy to the Supercapacitor.
- **Logic Gate:** The player's primary goal is to construct a circuit whose output depends on the logical state of multiple Switches.

### 2.3. Secondary Archetype

An optional, additional archetype that acts as a **complication** to the Primary Archetype, creating a Hybrid level. The list of available Secondary Archetypes is identical to the Primary Archetypes. The combination of two archetypes creates a multi-stage problem (e.g., "First, stabilize the source, THEN split the power").

### 2.4. Mutator

An optional **global rule** that modifies the level's physics or constraints, forcing the player to abandon standard solutions.

- **Physical Mutators:** Modify component behavior.
    - **Overheat:** Resistors have increased energy loss.
    - **Interference:** Stable sources gain slight instability.
    - **Imperfect Parts:** Components have slight random value deviations.
- **Economic Mutators:** Modify resource management.
    - **Tight Budget:** Source provides minimal excess energy.
    - **Expensive Parts:** Using any component deducts a fixed EU cost from the source.
- **Constraint Mutators:** Forbid the use of specific components or tactics.
    - **Inductor Embargo:** Forbids the use of Inductors.
    - **Component Shortage:** Forbids components of a specific value range.
    - **Vintage Only:** Only "Imperfect Parts" are available.

## 3. Functional Requirements

- **F-1 (Configuration):** The user must be able to set all parameters defined in Section 2 for each generation batch.
- **F-2 (Generation):** The system must algorithmically construct a solvable circuit ("optimal solution") based on the user's configuration.
- **F-3 (Validation):** The system must automatically test each generated level to confirm that a) the optimal solution works as intended, and b) at least one non-optimal "minimal solution" exists. Levels failing validation are discarded.
- **F-4 (Export):** The system must save all validated levels as individual `.json` files.

## 4. Non-Functional Requirements

- **NF-1 (Performance):** Average generation and validation time per level must not exceed 5 seconds.
- **NF-2 (UI):** The tool must have a simple, clear graphical user interface.
- **NF-3 (Extensibility):** The architecture must allow for the future addition of new Components, Archetypes, and Mutators without a full rewrite.

## 5. Success Metrics

- **Throughput:** The system can generate >= 100 valid, medium-difficulty levels per hour.
- **Efficiency:** A designer can assemble a 100-level campaign in < 2 business days.
- **Quality:** < 1% of auto-validated levels are rejected during final manual review.

## 6. Out of Scope

- A visual drag-and-drop editor for manual circuit design.
- An in-game (runtime) level generator. All generation is performed offline.
- Adaptive level generation based on individual player performance.