/**
 * Scientific fitness calculations using Mifflin-St Jeor BMR formula,
 * step-based activity factors, and proper fat conversion (7700 kcal/kg).
 */

// ============================================================================
// Types
// ============================================================================

export interface BMRParams {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: "male" | "female"
}

export interface TotalBurnParams extends BMRParams {
  steps: number
  didHIIT: boolean
}

export interface TDEEResult {
  tdee: number
  breakdown: {
    bmr: number
    activityFactor: number
    hiitBonus: number
  }
}

export interface DeficitResult {
  deficit: number
  fatLostKg: number
  fatLostGrams: number
}

// ============================================================================
// Constants
// ============================================================================

/** 1 kg of body fat = 7700 kcal */
const KCAL_PER_KG_FAT = 7700

/** HIIT bonus calories (conservative estimate for ~5-15 min session) */
const HIIT_BONUS_KCAL = 60

/** Maximum daily fat loss to display (prevents alarming numbers from bad input) */
const MAX_DISPLAY_FAT_LOSS_GRAMS = 250

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 * 
 * Male: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
 * Female: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
 * 
 * @example
 * calculateBMR({ weightKg: 71, heightCm: 174, ageYears: 21, sex: 'male' })
 * // Returns ~1697.5
 */
export function calculateBMR({ weightKg, heightCm, ageYears, sex = "male" }: BMRParams): number {
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * ageYears
  return sex === "male" ? baseBMR + 5 : baseBMR - 161
}

/**
 * Get activity multiplier based on daily step count.
 * Uses step buckets to avoid double-counting with separate step calories.
 * 
 * | Steps     | Factor | Description        |
 * |-----------|--------|--------------------|
 * | ≥10,000   | 1.55   | Active             |
 * | ≥7,500    | 1.40   | Moderate           |
 * | ≥5,000    | 1.25   | Light              |
 * | <5,000    | 1.15   | Sedentary          |
 * 
 * @example
 * activityFactorFromSteps(3000) // Returns 1.15
 * activityFactorFromSteps(10000) // Returns 1.55
 */
export function activityFactorFromSteps(steps: number): number {
  if (steps >= 10000) return 1.55
  if (steps >= 7500) return 1.40
  if (steps >= 5000) return 1.25
  return 1.15
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE) with optional HIIT bonus.
 * 
 * TDEE = BMR × activityFactor + HIITBonus
 * 
 * @example
 * const result = calculateTotalBurn({
 *   weightKg: 71, heightCm: 174, ageYears: 21, sex: 'male',
 *   steps: 3000, didHIIT: false
 * })
 * // result.tdee ≈ 1952
 */
export function calculateTotalBurn({
  weightKg,
  heightCm,
  ageYears,
  sex,
  steps,
  didHIIT,
}: TotalBurnParams): TDEEResult {
  const bmr = calculateBMR({ weightKg, heightCm, ageYears, sex })
  const activityFactor = activityFactorFromSteps(steps || 0)
  const hiitBonus = didHIIT ? HIIT_BONUS_KCAL : 0

  const tdee = Math.round(bmr * activityFactor + hiitBonus)

  return {
    tdee,
    breakdown: {
      bmr: Math.round(bmr),
      activityFactor,
      hiitBonus,
    },
  }
}

/**
 * Calculate calorie deficit and estimated fat loss.
 * 
 * - Deficit = max(0, totalBurn - caloriesConsumed)
 * - Fat loss = deficit / 7700 kcal/kg
 * 
 * Safety rules:
 * - Returns 0 if overate (no negative fat loss)
 * - Caps displayed value at 250g/day for UI safety
 * 
 * @example
 * calculateDeficitAndFatLoss({ caloriesConsumed: 1370, totalBurn: 1952 })
 * // { deficit: 582, fatLostKg: 0.0756, fatLostGrams: 76 }
 */
export function calculateDeficitAndFatLoss({
  caloriesConsumed,
  totalBurn,
}: {
  caloriesConsumed: number
  totalBurn: number
}): DeficitResult {
  // Deficit > 0 means burning more than consumed
  const deficit = Math.max(0, totalBurn - (caloriesConsumed || 0))

  // Fat conversion: 1 kg fat = 7700 kcal
  const fatLostKg = Number((deficit / KCAL_PER_KG_FAT).toFixed(4))
  const rawGrams = Math.round(fatLostKg * 1000)
  
  // Cap displayed grams for UI safety (internal value unchanged)
  const fatLostGrams = Math.min(rawGrams, MAX_DISPLAY_FAT_LOSS_GRAMS)

  return {
    deficit,
    fatLostKg,
    fatLostGrams,
  }
}

/**
 * Full calculation combining all steps.
 * This is the main function to use for daily fat loss estimation.
 */
export function calculateDailyFatLoss({
  weightKg,
  heightCm,
  ageYears,
  sex,
  steps,
  didHIIT,
  caloriesConsumed,
}: TotalBurnParams & { caloriesConsumed: number }): {
  tdeeResult: TDEEResult
  deficitResult: DeficitResult
  hasDeficit: boolean
} {
  const tdeeResult = calculateTotalBurn({
    weightKg,
    heightCm,
    ageYears,
    sex,
    steps,
    didHIIT,
  })

  const deficitResult = calculateDeficitAndFatLoss({
    caloriesConsumed,
    totalBurn: tdeeResult.tdee,
  })

  return {
    tdeeResult,
    deficitResult,
    hasDeficit: deficitResult.deficit > 0,
  }
}
