import { defineMiddlewares } from "@medusajs/framework/http"
import { z } from "zod"

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products",
      additionalDataValidator: {
        place: z.string(),
        minAge: z.number().optional(),
        opening: z.string().optional(),
        dateStart: z.string(),
        dateEnd: z.string().optional(),
        organizer: z.string(),
        puleb: z.string(),
        nit: z.string()
      },
    },
    {
      method: "POST",
      matcher: "/admin/products/:id",
      additionalDataValidator: {
        place: z.string().nullish(),
        minAge: z.number().optional().nullish(),
        opening: z.string().optional().nullish(),
        dateStart: z.string().nullish(),
        dateEnd: z.string().optional().nullish(),
        organizer: z.string().nullish(),
        puleb: z.string().nullish(),
        nit: z.string().nullish()
      },
    },
  ],
})