import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const buscaRouter = createTRPCRouter({
    getImoveisPage: publicProcedure.input(z.object({ page: z.number() })).query(async ({ ctx, input }) => {
        if (!input.page) {
            throw new Error('No page provided')
        }
        return await ctx.prisma.imovel.findMany({
            skip: (input.page - 1) * 10,
            take: 10,
            orderBy: {
                isPro: 'desc'
            }
        })
    }),
    getTipos: publicProcedure.query(async ({ ctx, input }) => {
        return [
            { tipo: 'Residential / Apartment' },
            { tipo: 'Residential / Condo' },
            { tipo: 'Residential / Home' },
            { tipo: 'Residential / Land Lot' },
            { tipo: 'Residential / Penthouse' }
        ]
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