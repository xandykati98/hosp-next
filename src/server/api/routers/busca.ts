import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const buscaRouter = createTRPCRouter({
    getTipos: publicProcedure.query(async ({ ctx, input }) => {
        const res = (await ctx.prisma.imovel.findMany({
            where: {
                tipo: {
                    not: null
                }
            },
            distinct: ['tipo'],
            select: {
                tipo: true
            }
        }))
        
        return res.filter(item => item.tipo !== null) as unknown as { tipo: string }[]
    })
})