import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const homeRouter = createTRPCRouter({
    getSomeProperties: publicProcedure.input(z.object({ limit: z.number() })).query(async ({ ctx, input }) => {
        if (!input.limit) {
            throw new Error('No limit provided')
        }
        return await ctx.prisma.imovel.findMany({
            take: input.limit,
            // get items that are ultra and pro first
            orderBy: {
                isUltra: 'desc'
            }
        })
    })
})