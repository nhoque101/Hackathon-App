import { NextResponse } from "next/server"
import { shoeData } from "@/lib/shoe-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const condition = searchParams.get("condition")
    const style = searchParams.get("style")
    const gender = searchParams.get("gender")
    const priceMin = searchParams.get("priceMin") ? Number.parseFloat(searchParams.get("priceMin")!) : null
    const priceMax = searchParams.get("priceMax") ? Number.parseFloat(searchParams.get("priceMax")!) : null

    console.log(
      `API Request - Condition: ${condition}, Style: ${style}, Gender: ${gender}, Price: ${priceMin}-${priceMax}`,
    )

    // Get all shoes
    let filteredShoes = [...shoeData.shoes]
    console.log(`Initial shoes count: ${filteredShoes.length}`)

    // Filter by condition
    if (condition && condition !== "any") {
      console.log(`Filtering by condition: ${condition}`)

      // Map condition name to ID based on our data structure
      let conditionId = null

      // Map the condition names from the UI to the condition IDs in our data
      switch (condition.toLowerCase()) {
        case "diabetic-friendly":
          conditionId = "2"
          break
        case "plantar-fasciitis":
          conditionId = "1"
          break
        case "foot-pain":
          conditionId = "4"
          break
        case "wide-foot":
          conditionId = "3"
          break
        case "orthopedic":
          conditionId = "5"
          break
      }

      if (conditionId) {
        console.log(`Mapped condition ${condition} to ID ${conditionId}`)

        // Find shoes with this condition
        const shoeIdsWithCondition = shoeData.shoe_conditions
          .filter((sc) => sc.condition_id === conditionId)
          .map((sc) => sc.shoe_id)

        console.log(
          `Found ${shoeIdsWithCondition.length} shoes with condition ID ${conditionId}:`,
          shoeIdsWithCondition,
        )

        filteredShoes = filteredShoes.filter((shoe) => shoeIdsWithCondition.includes(shoe.id))

        console.log(`After condition filter: ${filteredShoes.length} shoes`)
      }
    }

    // Filter by style
    if (style && style !== "any") {
      console.log(`Filtering by style: ${style}`)

      // Find the style ID from the style name
      const styleObj = shoeData.styles.find((s) => s.name.toLowerCase() === style.toLowerCase())

      if (styleObj) {
        console.log(`Found style ID ${styleObj.id} for ${style}`)

        filteredShoes = filteredShoes.filter((shoe) => shoe.style_id === styleObj.id)

        console.log(`After style filter: ${filteredShoes.length} shoes`)
      }
    }

    // Filter by gender
    if (gender && gender !== "all") {
      console.log(`Filtering by gender: ${gender}`)

      filteredShoes = filteredShoes.filter((shoe) => {
        const shoeGender = shoe.gender.toLowerCase()
        const requestedGender = gender.toLowerCase()

        // Match exact gender or unisex shoes
        return shoeGender === requestedGender || shoeGender === "unisex"
      })

      console.log(`After gender filter: ${filteredShoes.length} shoes`)
    }

    // Filter by price range
    if (priceMin !== null) {
      console.log(`Filtering by minimum price: $${priceMin}`)
      filteredShoes = filteredShoes.filter((shoe) => shoe.price >= priceMin)
      console.log(`After min price filter: ${filteredShoes.length} shoes`)
    }

    if (priceMax !== null) {
      console.log(`Filtering by maximum price: $${priceMax}`)
      filteredShoes = filteredShoes.filter((shoe) => shoe.price <= priceMax)
      console.log(`After max price filter: ${filteredShoes.length} shoes`)
    }

    // Transform the data to match the frontend structure
    const transformedData = filteredShoes.map((shoe) => {
      // Find the style
      const style = shoeData.styles.find((s) => s.id === shoe.style_id)

      // Find the conditions
      const shoeConditionIds = shoeData.shoe_conditions
        .filter((sc) => sc.shoe_id === shoe.id)
        .map((sc) => sc.condition_id)

      const conditions = shoeData.conditions
        .filter((c) => shoeConditionIds.includes(c.id))
        .map((c) => c.name.toLowerCase().replace(/\s+/g, "-"))

      // Find the brand
      const brand = shoeData.brands.find((b) => b.id === shoe.brand_id)

      // Get image
      const image = shoeData.shoe_images.find((img) => img.shoe_id === shoe.id)?.url || shoe.image_url

      return {
        id: Number.parseInt(shoe.id),
        name: shoe.name,
        price: shoe.price,
        rating: shoe.rating,
        reviews: Math.floor(Math.random() * 100) + 20, // Random number of reviews
        image: image,
        tags: [brand?.name, style?.name].filter(Boolean),
        description: shoe.description,
        medicalConditions: conditions,
        styles: [style?.name?.toLowerCase()].filter(Boolean),
        gender: shoe.gender,
        product_url: shoe.product_url,
      }
    })

    console.log(`Returning ${transformedData.length} transformed shoes`)
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching shoes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

