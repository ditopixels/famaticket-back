import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { EVENT_MODULE } from "../../../modules/event"
import EventModuleService from "../../../modules/event/service"

type UpdateEventStepInput = {
    id: string
    place: string
    minAge: number
    opening: Date
    dateStart: Date
    dateEnd: Date
    organizer: string
    puleb: string
    nit: string
}

export const updateEventStep = createStep(
    "update-event",
    async ({ id, place, minAge, opening, dateStart, dateEnd, organizer, puleb, nit }: UpdateEventStepInput, { container }) => {
        const eventModuleService: EventModuleService = container.resolve(
            EVENT_MODULE
        )

        const prevData = await eventModuleService.retrieveEvent(id)

        const custom = await eventModuleService.updateEvents({
            id,
            place,
            minAge,
            opening,
            dateStart,
            dateEnd,
            organizer,
            puleb,
            nit
        })

        return new StepResponse(custom, prevData)
    },
    async (prevData, { container }) => {
        const eventModuleService: EventModuleService = container.resolve(
            EVENT_MODULE
        )

        await eventModuleService.updateEvents(prevData!)
    }
)