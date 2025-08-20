# PRD: Level Generator "Prometheus" Constructor System

- **Product:** Automated Level Generation Tool for the puzzle game "Ignit".
- **Version:** 3.0 - Constructor (Standardized Components System)
- **Date:** 19.08.2025
- **Owner:** Luminoa

## 1. Overview

### 1.1. Purpose

This document specifies the functional and non-functional requirements for "Prometheus," an external tool for the automated generation and validation of game levels using standardized component systems.

### 1.2. Target User

- **Primary User:** Lead Game Designer / Producer.
- **User Goal:** To define high-level parameters for content generation and assemble standardized, balanced levels into game campaigns.

### 1.3. Product Goals

- **Standardization:** Generate predictable, balanced levels using fixed component values instead of random parameters.
- **Quality Assurance:** Ensure every generated level uses standardized Sweet Spot ranges and component catalogs.
- **Automation:** Eliminate manual balancing while maintaining design control through archetype selection.

### 1.4. Major Changes in Version 3.0

- **Constructor Mode:** Sweet Spot optimization disabled for standardized components.
- **Fixed Component Catalogs:** All resistors, capacitors, LEDs, and voltage sources use pre-defined standard values.
- **Universal Tolerance:** All LED Sweet Spot ranges use fixed ±2.0 EU tolerance.
- **Validation System:** Enhanced validation for standardized ranges and component compliance.

## 2. Standardized Component System

### 2.1. LED Series (Target Components)

All LED targets use **Nominal Energy ± 2.0 EU** Sweet Spot ranges:

- **Low Power:** 5 EU, 10 EU, 15 EU
- **Medium Power:** 20 EU, 25 EU, 30 EU  
- **High Power:** 40 EU, 50 EU
- **Very High Power:** 75 EU, 100 EU

**Example:** 20 EU LED → Sweet Spot range: [18.0, 22.0]

### 2.2. Voltage Source Series

Standard voltages only:
- **Available Values:** 5V, 9V, 12V, 24V
- **Energy Output:** Dynamic (calculated by generator based on level requirements)

### 2.3. R-Series (Resistors)

Standard resistance values:
- **Low Value (fine tuning):** 22Ω, 47Ω
- **Core Set (primary values):** 100Ω, 220Ω, 470Ω, 680Ω, 1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ

### 2.4. C-Series (Capacitors)

Standard capacitance values:
- **Available Values:** 10µF, 47µF, 100µF, 220µF, 470µF, 1000µF

### 2.5. L-Series (Inductors)

Standard inductance values:
- **Available Values:** 1mH, 5mH, 10mH, 22mH, 50mH, 100mH

## 3. Level Configuration Parameters

### 3.1. Difficulty Scaling

A 5-point scale defining the level's complexity using standardized components:

- **Level 1 (Tutorial):**
    - **LED Selection:** Low Power only (5-15 EU)
    - **Component Count:** 2-3 components
    - **Precision:** ±2.0 EU (universal)
    - **Red Herrings:** 0
    - **Architecture:** Simple voltage divider

- **Level 2 (Basic):**
    - **LED Selection:** Low/Medium Power (5-30 EU)
    - **Component Count:** 3-4 components
    - **Precision:** ±2.0 EU (universal)
    - **Red Herrings:** 0-1
    - **Architecture:** Parallel paths or RC combinations

- **Level 3 (Advanced):**
    - **LED Selection:** All categories available
    - **Component Count:** 4-5 components
    - **Precision:** ±2.0 EU (universal)
    - **Red Herrings:** 1-2
    - **Architecture:** Complex RC networks, LC filters

- **Level 4 (Hard):**
    - **LED Selection:** High/Very High Power emphasis
    - **Component Count:** 5-6 components
    - **Precision:** ±2.0 EU (universal)
    - **Red Herrings:** 2-3
    - **Architecture:** Multi-stage circuits, hybrid archetypes

- **Level 5 (Expert):**
    - **LED Selection:** Very High Power, conflicting requirements
    - **Component Count:** 6+ components
    - **Precision:** ±2.0 EU (universal)
    - **Red Herrings:** 3+
    - **Architecture:** Non-obvious topologies, complex hybrids

### 3.2. Primary Archetype

The main circuit topology. One must be selected:

- **Stabilizer:** LC filter circuits to smooth unstable power sources using standard L/C values.
- **Splitter:** Voltage divider or parallel distribution using standard resistor values.
- **Timed Charge:** Capacitor charging circuits using standard C values and switching logic.
- **Protector:** Current limiting and shunt circuits using standard component combinations.
- **Logic Gate:** Switch-based logic using standard resistor networks.

### 3.3. Secondary Archetype

Optional complication creating hybrid levels by combining two standardized circuit patterns.

### 3.4. Mutator

Optional global rules affecting standardized components:

- **Component Value Mutators:** Slightly modify standard values within tolerance
- **Availability Mutators:** Restrict access to certain component ranges
- **Physics Mutators:** Modify component behavior while preserving standardized ranges

## 4. Functional Requirements

- **F-1 (Standardized Generation):** The system must generate levels using only components from standardized catalogs.
- **F-2 (Fixed Sweet Spots):** All LED targets must use the formula: Sweet Spot = Nominal ± 2.0 EU.
- **F-3 (Constructor Mode):** Sweet Spot optimization must be disabled to preserve standardized ranges.
- **F-4 (Catalog Validation):** The system must validate that all generated components exist in the standard catalogs.
- **F-5 (Export Enhancement):** Generated levels must include constructor_mode metadata and standardized_ranges validation.

## 5. Technical Implementation

### 5.1. Constructor Mode Operation

```python
# Constructor mode disables Sweet Spot optimization
if constructor_mode:
    print("🔧 CONSTRUCTOR: Using standardized Sweet Spots (Nominal ± 2.0 EU)")
    print("🔧 CONSTRUCTOR: Skipping post-simulation optimization")
    is_valid = True  # Standardized components are always valid
```

### 5.2. Component Selection Logic

```python
# LED selection based on difficulty
def select_leds_for_difficulty(difficulty: int, count: int):
    if difficulty <= 2:
        categories = [LOW_POWER, MEDIUM_POWER]
    elif difficulty <= 3:
        categories = [LOW_POWER, MEDIUM_POWER, HIGH_POWER]
    else:
        categories = [ALL_CATEGORIES]
    
    return random.choices(categories, k=count)

# Sweet Spot calculation
def get_sweet_spot_range(nominal_energy: float):
    return (nominal_energy - 2.0, nominal_energy + 2.0)
```

### 5.3. Validation Enhancements

```python
validation_data = {
    "validation_performed": True,
    "sweet_spot_optimization": is_valid,
    "constructor_mode": True,
    "standardized_ranges": "Nominal ± 2.0 EU"
}
```

## 6. Non-Functional Requirements

- **NF-1 (Performance):** Average generation time per standardized level must not exceed 3 seconds.
- **NF-2 (Consistency):** All levels using the same parameters must produce identical component selection patterns.
- **NF-3 (Catalog Integrity):** The system must prevent generation of non-standard component values.

## 7. Success Metrics

- **Standardization:** 100% of generated levels use only catalog components.
- **Balance:** All LED Sweet Spots follow the Nominal ± 2.0 EU formula.
- **Throughput:** The system can generate >= 200 standardized levels per hour.
- **Quality:** 0% of generated levels contain non-standard component values.

## 8. Version 3.0 Benefits

### 8.1. For Game Designers

- **Predictable Balance:** No more random Sweet Spot ranges causing difficulty spikes.
- **Component Familiarity:** Players learn standard component values across levels.
- **Consistent Difficulty:** Each difficulty level uses appropriate component complexity.

### 8.2. For Players

- **Fair Progression:** Sweet Spot tolerances are consistent across all levels.
- **Component Knowledge:** Standard values become familiar tools for puzzle solving.
- **Balanced Challenge:** Difficulty comes from circuit complexity, not arbitrary precision requirements.

### 8.3. For Developers

- **Maintainability:** Component catalogs are centralized and easily updatable.
- **Debugging:** Standard values make level behavior more predictable.
- **Quality Assurance:** Automated validation prevents non-standard components.

## 9. Out of Scope

- Dynamic component value generation (replaced by standardized catalogs).
- Per-level Sweet Spot optimization (replaced by universal ±2.0 EU tolerance).
- Adaptive precision scaling (replaced by consistent tolerance standards).
- Manual circuit editing (remains out of scope).

## 10. Migration from Version 2.0

Existing levels generated with Version 2.0 (random values) should be:
- **Identified:** By checking for `generator_version` and `constructor_mode` metadata.
- **Replaced:** With equivalent standardized levels using Version 3.0.
- **Validated:** To ensure all components conform to standard catalogs.

---

*This PRD represents a fundamental shift from random generation to standardized, balanced level creation ensuring consistent player experience and maintainable content pipelines.*