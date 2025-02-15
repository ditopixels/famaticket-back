import { model } from "@medusajs/framework/utils"

export const Event = model.define("event", {
  id: model.id().primaryKey(),
  place: model.text(),
  minAge: model.number(),
  opening: model.dateTime(),
  dateStart: model.dateTime(),
  dateEnd: model.dateTime(),
  organizer: model.text(),
  puleb: model.text(),
  nit: model.text()
})