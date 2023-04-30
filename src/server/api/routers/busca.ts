import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

const getImoveisInput = {
    tipos: z.array(z.string()),
    isLocacao: z.boolean(),
    isVenda: z.boolean(),
    precoVendaMin: z.number(),
    precoVendaMax: z.number(),
    precoLocacaoMin: z.number(),
    precoLocacaoMax: z.number(),
    quartos: z.number(),
}
export const buscaRouter = createTRPCRouter({
    getImoveisCount: publicProcedure.input(z.object(getImoveisInput)).query(async ({ ctx, input }) => {
        
        const where: {
            tipo?: any      
            precoVenda?: { gte?: number, lte?: number }
            precoLocacao?: { gte?: number, lte?: number }
            isAtivo: true
            isLocacao?: boolean
            isVenda?: boolean
            quartos?: number | { gte?: number }
        } = {
            isAtivo: true
        }
        if (input.isVenda) {
            where.isVenda = true
        }
        if (input.isLocacao) {
            where.isLocacao = true
        }
        if (input.quartos > 0) {
            if (input.quartos >= 4) {
                where.quartos = {
                    gte: input.quartos
                }
            } else {
                where.quartos = input.quartos
            }
        }
        


        if (input.precoVendaMin > 0 || input.precoVendaMax > 0) {
            where.precoVenda = {}
            if (input.precoVendaMin > 0) {
                where.precoVenda.gte = input.precoVendaMin
            }
            if (input.precoVendaMax > 0) {
                where.precoVenda.lte = input.precoVendaMax
            }
        }

        if (input.precoLocacaoMin > 0 || input.precoLocacaoMax > 0) {
            where.precoLocacao = {}
            if (input.precoLocacaoMin > 0) {
                where.precoLocacao.gte = input.precoLocacaoMin
            }
            if (input.precoLocacaoMax > 0) {
                where.precoLocacao.lte = input.precoLocacaoMax
            }
        }

        if (input.tipos.length > 0) {
            where.tipo = {
                in: input.tipos
            }
        }
        console.log(where)
        return await ctx.prisma.imovel.count({ where })
    }),
    getImoveisPage: publicProcedure.input(z.object({ page: z.number(), ...getImoveisInput })).query(async ({ ctx, input }) => {
        if (!input.page) {
            throw new Error('No page provided')
        }

        const where: {
            tipo?: any      
            precoVenda?: { gte?: number, lte?: number }
            precoLocacao?: { gte?: number, lte?: number }
            isAtivo: true
            isLocacao?: boolean
            isVenda?: boolean
            quartos?: number | { gte?: number }
        } = {
            isAtivo: true
        }
        if (input.isVenda) {
            where.isVenda = true
        }
        if (input.isLocacao) {
            where.isLocacao = true
        }
        if (input.quartos > 0) {
            if (input.quartos >= 4) {
                where.quartos = {
                    gte: input.quartos
                }
            } else {
                where.quartos = input.quartos
            }
        }
        
        if (input.precoVendaMin > 0 || input.precoVendaMax > 0) {
            where.precoVenda = {}
            if (input.precoVendaMin > 0) {
                where.precoVenda.gte = input.precoVendaMin
            }
            if (input.precoVendaMax > 0) {
                where.precoVenda.lte = input.precoVendaMax
            }
        }

        if (input.precoLocacaoMin > 0 || input.precoLocacaoMax > 0) {
            where.precoLocacao = {}
            if (input.precoLocacaoMin > 0) {
                where.precoLocacao.gte = input.precoLocacaoMin
            }
            if (input.precoLocacaoMax > 0) {
                where.precoLocacao.lte = input.precoLocacaoMax
            }
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