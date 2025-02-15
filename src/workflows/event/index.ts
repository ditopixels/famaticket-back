import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { ProductDTO } from "@medusajs/framework/types"
import { createRemoteLinkStep, dismissRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { EVENT_MODULE } from "../../modules/event"
import { createEventStep } from "./steps/create-event"
import { deleteEventStep } from "./steps/delete-event"
import { updateEventStep } from "./steps/update-event"

export type CreateEventFromProductWorkflowInput = {
  product: ProductDTO
  additional_data?: {
    place?: string
    minAge?: number
    opening?: Date
    dateStart?: Date
    dateEnd?: Date
    organizer?: string
    puleb?: string
    nit?: string
  }
}

export const createEventFromProductWorkflow = createWorkflow(
  "create-event-from-product",
  (input: CreateEventFromProductWorkflowInput) => {
    const place = transform({input}, (data) => data.input.additional_data?.place || "")
    const minAge = transform({input}, (data) => data.input.additional_data?.minAge)
    const opening = transform({input}, (data) => data.input.additional_data?.opening)
    const dateStart = transform({input}, (data) => data.input.additional_data?.dateStart)
    const dateEnd = transform({input}, (data) => data.input.additional_data?.dateEnd)
    const organizer = transform({input}, (data) => data.input.additional_data?.organizer || "")
    const puleb = transform({input}, (data) => data.input.additional_data?.puleb || "")
    const nit = transform({input}, (data) => data.input.additional_data?.nit || "")


    const event = createEventStep({ place, minAge, opening, dateStart, dateEnd, organizer, puleb, nit })

    when(({ event }), ({ event }) => event !== undefined)
      .then(() => {
        createRemoteLinkStep([{
          [Modules.PRODUCT]: {
            product_id: input.product.id,
          },
          [EVENT_MODULE]: {
            event_id: event.id,
          },
        }])
      })

    return new WorkflowResponse({
        event,
    })
  }
)

export type UpdateEventFromProductStepInput = {
    product: ProductDTO
    additional_data?: {
        place?: string
        minAge?: number
        opening?: Date
        dateStart?: Date
        dateEnd?: Date
        organizer?: string
        puleb?: string
        nit?: string
    }
}
  
export const updateEventFromProductWorkflow = createWorkflow(
    "update-event-from-product",
    (input: UpdateEventFromProductStepInput) => {
        // @ts-ignore
        const { data: products } = useQueryGraphStep({
            entity: "product",
            fields: ["event.*"],
            filters: {
                id: input.product.id,
            }
        }) as any
      
        const created = when(
            "create-product-event-link",
            {
              input,
              products,
            }, (data) => 
              !data.products[0].event && 
              Boolean(data.input.additional_data?.place) &&
              Boolean(data.input.additional_data?.dateStart) &&
              Boolean(data.input.additional_data?.organizer) &&
              Boolean(data.input.additional_data?.puleb) &&
              Boolean(data.input.additional_data?.nit)
        )
        .then(() => {
            const event = createEventStep({
                place: input.additional_data?.place,
                minAge: input.additional_data?.minAge,
                opening: input.additional_data?.opening,
                dateStart: input.additional_data?.dateStart,
                dateEnd: input.additional_data?.dateEnd,
                organizer: input.additional_data?.organizer,
                puleb: input.additional_data?.puleb,
                nit: input.additional_data?.nit,
            })
            
            createRemoteLinkStep([{
                [Modules.PRODUCT]: {
                product_id: input.product.id,
                },
                [EVENT_MODULE]: {
                    event_id: event.id,
                },
            }])
        
            return event
        })
          
        
        const deleted = when(
            "delete-product-event-link",
            {
              input,
              products,
            }, (data) => 
                data.products[0].custom && (
                    !Boolean(data.input.additional_data?.place) &&
                    !Boolean(data.input.additional_data?.dateStart) &&
                    !Boolean(data.input.additional_data?.organizer) &&
                    !Boolean(data.input.additional_data?.puleb) &&
                    !Boolean(data.input.additional_data?.nit)
                )
        )
        .then(() => {
            deleteEventStep({
              event: products[0].event,
            })
          
            dismissRemoteLinkStep({
              [EVENT_MODULE]: {
                event_id: products[0].event.id,
              },
            })
          
            return products[0].custom.id
        })
          
        const updated = when({
            input,
            products,
          }, (data) => data.products[0].event && (
            Boolean(data.input.additional_data?.place) &&
            Boolean(data.input.additional_data?.dateStart) &&
            Boolean(data.input.additional_data?.organizer) &&
            Boolean(data.input.additional_data?.puleb) &&
            Boolean(data.input.additional_data?.nit)
        ))
        .then(() => {
            return updateEventStep({
                id: products[0].custom.id,
                place: input.additional_data?.place!,
                minAge: input.additional_data?.minAge!,
                opening: input.additional_data?.opening!,
                dateStart: input.additional_data?.dateStart!,
                dateEnd: input.additional_data?.dateEnd!,
                organizer: input.additional_data?.organizer!,
                puleb: input.additional_data?.puleb!,
                nit: input.additional_data?.nit!,
            })
        })
          
        return new WorkflowResponse({
            created,
            updated,
            deleted,
        })

    }
)
  