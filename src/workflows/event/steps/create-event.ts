import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import EventModuleService from "../../../modules/event/service"
import { EVENT_MODULE } from "../../../modules/event"

type CreateEventStepInput = {
    place?: string
    minAge?: number
    opening?: Date
    dateStart?: Date
    dateEnd?: Date
    organizer?: string
    puleb?: string
    nit?: string
}

export const createEventStep = createStep(
    "create-event",
    async (data: CreateEventStepInput, { container }) => {
        if (
            !data.place ||
            !data.dateStart ||
            !data.organizer ||
            !data.puleb ||
            !data.nit
        ) {
        return
        }

        const eventModuleService: EventModuleService = container.resolve(
            EVENT_MODULE
        )

        const custom = await eventModuleService.createEvents(data)

        return new StepResponse(custom, custom)
    },
    async (custom, { container }) => {
        const eventModuleService: EventModuleService = container.resolve(
            EVENT_MODULE
        )
        if(!custom) return
        await eventModuleService.deleteEvents(custom.id)
    }
)