import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const buscaRouter = createTRPCRouter({
    getImoveisPage: publicProcedure.input(z.object({ page: z.number(), tipos: z.array(z.string()) })).query(async ({ ctx, input }) => {
        if (!input.page) {
            throw new Error('No page provided')
        }

        const where: {
            tipo?: any
        } = {

        }

        if (input.tipos.length > 0) {
            where.tipo = {
                in: input.tipos
            }
        }

        const res = await ctx.prisma.imovel.findMany({
            skip: (input.page - 1) * 50,
            take: 50,
            orderBy: {
                isPro: 'desc'
            },
            where,
            include: {
                fotos: {
                    take: 1,
                    where: {
                        isAtivo: true
                    },
                    orderBy: {
                        isPrincipal: 'desc'
                    },
                    select: {
                        url: true
                    }
                }
            }
        })
        const count = await ctx.prisma.imovel.count({ where })
        return {
            count,
            imoveis: res,
        }
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