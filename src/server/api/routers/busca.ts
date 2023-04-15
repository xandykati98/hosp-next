import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

const getImoveisInput = {
    tipos: z.array(z.string()),
    isLocacao: z.boolean(),
    isVenda: z.boolean(),
}
export const buscaRouter = createTRPCRouter({
    getImoveisCount: publicProcedure.input(z.object(getImoveisInput)).query(async ({ ctx, input }) => {
        
        const where: {
            tipo?: any            
            isAtivo: true
            isLocacao: boolean
            isVenda: boolean
        } = {
            isAtivo: true,
            isVenda: input.isVenda,
            isLocacao: input.isLocacao
        }

        if (input.tipos.length > 0) {
            where.tipo = {
                in: input.tipos
            }
        }

        return await ctx.prisma.imovel.count({ where })
    }),
    getImoveisPage: publicProcedure.input(z.object({ page: z.number(), ...getImoveisInput })).query(async ({ ctx, input }) => {
        if (!input.page) {
            throw new Error('No page provided')
        }

        const where: {
            tipo?: any            
            isAtivo: true
            isLocacao: boolean
            isVenda: boolean
        } = {
            isAtivo: true,
            isVenda: input.isVenda,
            isLocacao: input.isLocacao
        }

        if (input.tipos.length > 0) {
            where.tipo = {
                in: input.tipos
            }
        }

        return await ctx.prisma.imovel.findMany({
            skip: (input.page - 1) * 25,
            take: 25,
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