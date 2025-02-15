import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Event } from "../../../modules/event/models/event"
import { InferTypeOf } from "@medusajs/framework/types"
import EventModuleService from "../../../modules/event/service"
import { EVENT_MODULE } from "../../../modules/event"

type DeleteEventStepInput = {
  event: InferTypeOf<typeof Event>
}

export const deleteEventStep = createStep(
    "delete-event",
    async ({ event }: DeleteEventStepInput, { container }) => {
        const eventModuleService: EventModuleService = container.resolve(
        EVENT_MODULE
        )

        await eventModuleService.deleteEvents(event.id)

        return new StepResponse(event, event)
    },
    async (event, { container }) => {
        const eventModuleService: EventModuleService = container.resolve(
            EVENT_MODULE
        )

        await eventModuleService.createEvents(event!)
    }
)