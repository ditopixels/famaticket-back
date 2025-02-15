import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { 
  UpdateEventFromProductStepInput, 
  updateEventFromProductWorkflow,
} from "../event"

updateProductsWorkflow.hooks.productsUpdated(
	async ({ products, additional_data }, { container }) => {
    const workflow = updateEventFromProductWorkflow(container)
    
    for (const product of products) {
      await workflow.run({
        input: {
          product,
          additional_data,
        } as UpdateEventFromProductStepInput,
      })
    }
	}
)