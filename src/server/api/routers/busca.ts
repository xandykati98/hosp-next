import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

const getImoveisInput = z.object({
    tipos: z.array(z.string()),
    isLocacao: z.boolean(),
    isVenda: z.boolean(),
    precoVendaMin: z.number(),
    precoVendaMax: z.number(),
    precoLocacaoMin: z.number(),
    precoLocacaoMax: z.number(),
    areaMin: z.number(),
    areaMax: z.number(),
    quartos: z.number(),
    banheiros: z.number(),
    vagas: z.number(),
})

function getWhere({ input }:{
    input: z.infer<typeof getImoveisInput>
}) {
    const where: {
        tipo?: any      
        precoVenda?: { gte?: number, lte?: number }
        precoLocacao?: { gte?: number, lte?: number }
        areaTotal?: { gte?: number, lte?: number }
        isAtivo: true
        isLocacao?: boolean
        isVenda?: boolean
        quartos?: number | { gte?: number }
        banheiros?: number | { gte?: number }
        vagas?: number | { gte?: number }
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
    if (input.banheiros > 0) {
        if (input.banheiros >= 4) {
            where.banheiros = {
                gte: input.banheiros
            }
        } else {
            where.banheiros = input.banheiros
        }
    }
    if (input.vagas > 0) {
        if (input.vagas >= 4) {
            where.vagas = {
                gte: input.vagas
            }
        } else {
            where.vagas = input.vagas
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
    if (input.areaMin > 0 || input.areaMax > 0) {
        where.areaTotal = {}
        if (input.areaMin > 0) {
            where.areaTotal.gte = input.areaMin
        }
        if (input.areaMax > 0) {
            where.areaTotal.lte = input.areaMax
        }
    }
    if (input.tipos.length > 0) {
        where.tipo = {
            in: input.tipos
        }
    }

    return where
}

export const buscaRouter = createTRPCRouter({
    getImoveisCount: publicProcedure.input(getImoveisInput).query(async ({ ctx, input }) => {
        
        const where = getWhere({ input })
        
        return await ctx.prisma.imovel.count({ where })
    }),
    getImoveisPage: publicProcedure.input(getImoveisInput.extend({ page: z.number() })).query(async ({ ctx, input }) => {
        if (!input.page) {
            throw new Error('No page provided')
        }
        const where = getWhere({ input })
        const pageSize = 25
        return await ctx.prisma.imovel.findMany({
            skip: (input.page - 1) * pageSize,
            take: pageSize,
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