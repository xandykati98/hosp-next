import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const empresaRouter = createTRPCRouter({
    getEmpresaById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        if (!input.id) {
            throw new Error('No id provided')
        }
        return await ctx.prisma.empresa.findFirst({
            where: {
                id: input.id
            }
        })
    })
})