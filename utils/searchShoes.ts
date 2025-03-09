import shoesData from "@/lib/shoes-data.json"

export interface SearchFilters {
  condition?: string
  style?: string
  gender?: string
  priceMin?: number | null
  priceMax?: number | null
}

export function searchShoes(filters: SearchFilters) {
  const { condition, style, gender, priceMin, priceMax } = filters

  // Filter shoes based on criteria
  return shoesData.shoes.filter((shoe) => {
    // Filter by condition
    if (condition && condition !== "any") {
      // Check if the condition is in the shoe's conditions array
      if (
        !shoe.conditions.some(
          (c) =>
            c.toLowerCase().replace(/\s+/g, "-") === condition.toLowerCase() ||
            c.toLowerCase() === condition.toLowerCase(),
        )
      ) {
        return false
      }
    }

    // Filter by style
    if (style && style !== "any") {
      if (shoe.style.toLowerCase() !== style.toLowerCase()) {
        return false
      }
    }

    // Filter by gender
    if (gender && gender !== "all") {
      if (shoe.gender.toLowerCase() !== gender.toLowerCase() && shoe.gender !== "Unisex") {
        return false
      }
    }

    // Filter by price range
    if (priceMin !== null && priceMin !== undefined && shoe.price < priceMin) {
      return false
    }

    if (priceMax !== null && priceMax !== undefined && shoe.price > priceMax) {
      return false
    }

    // If the shoe passed all filters, include it
    return true
  })
}

