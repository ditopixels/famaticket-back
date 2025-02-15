
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { 
  createEventFromProductWorkflow, 
  CreateEventFromProductWorkflowInput,
} from "../event"

createProductsWorkflow.hooks.productsCreated(
	async ({ products, additional_data }, { container }) => {
    const workflow = createEventFromProductWorkflow(container)
    
    for (const product of products) {
      await workflow.run({
        input: {
          product,
          additional_data,
        } as CreateEventFromProductWorkflowInput,
      })
    }
	}
)