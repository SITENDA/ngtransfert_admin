import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import type { NeonDbError } from "@neondatabase/serverless"

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        })
    },
    handleServerError(e, utils) {
        const { clientInput, metadata } = utils 
        if (e.constructor.name === 'NeonDbError') {
            const { code, detail } = e as NeonDbError
            if (code === "23505") {
                return `Unique entry required. ${detail}`
            }
        }
        
        if (e.constructor.name === 'DatabaseError') {
            return "Database Error: Your data did not save. Support will be notified."
        }
        return e.message
    }
})