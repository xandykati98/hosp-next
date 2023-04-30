import { useState, Fragment, createContext, useContext, useEffect } from "react"
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Switch } from '@headlessui/react'
import { api } from "~/utils/api"
import { Imovel } from "@prisma/client"
import Link from "next/link"
import { animated, useInView } from "@react-spring/web"
import Mapa from '~/components/busca.map'

function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
}

const BuscaContext = createContext({
    transacao: 'Comprar',
    setTransacao: (transacao: string) => {},
    loadingTipos: true,
    /**
     * Tipos de imóveis selecionados na UI
     */
    tipos: {} as { [tipo:string]: boolean },
    setTipos: (tipos: any) => {},
    availableTipos: [] as string[],
    precoVendaMin: 0,
    setPrecoVendaMin: (preco: number) => {},
    precoVendaMax: 0,
    setPrecoVendaMax: (preco: number) => {},
    precoLocacaoMin: 0,
    setPrecoLocacaoMin: (preco: number) => {},
    precoLocacaoMax: 0,
    setPrecoLocacaoMax: (preco: number) => {},
    quartos: 0,
    setQuartos: (quartos: number) => {},
    banheiros: 0,
    setBanheiros: (banheiros: number) => {},
    vagas: 0,
    setVagas: (vagas: number) => {},
    areaMin: 0,
    setAreaMin: (area: number) => {},
    areaMax: 0,
    setAreaMax: (area: number) => {},
})

// not currency
// 10000 => 10.000
function format(n:number) {
    const isNegative = n < 0;
    const str = Math.abs(n).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return isNegative ? '-' + str : str;
}


const Busca = () => {
    const [ transacao, setTransacao ] = useState('Comprar')
    const [ precoVendaMin, setPrecoVendaMin ] = useState(0)
    const [ precoVendaMax, setPrecoVendaMax ] = useState(0)
    const [ precoLocacaoMin, setPrecoLocacaoMin ] = useState(0)
    const [ precoLocacaoMax, setPrecoLocacaoMax ] = useState(0)
    const [ areaMin, setAreaMin ] = useState(0)
    const [ areaMax, setAreaMax ] = useState(0)

    const [ quartos, setQuartos ] = useState(0)
    const [ banheiros, setBanheiros ] = useState(0)
    const [ vagas, setVagas ] = useState(0)
    

    const [ tipos, setTipos ] = useState<{[tipo:string]: boolean}>({})
    const { data:tiposDistinct, isLoading: loadingTipos } = api.busca.getTipos.useQuery()
    
    const [page, setPage] = useState(1)
    const [mapaActive, setMapaActive] = useState(false)

    const tiposActives: string[] = Object.entries(tipos).filter(([key, value]) => value).map(([key, value]) => key)

    const query = {
        tipos: tiposActives, 
        isVenda: transacao === 'Comprar', 
        isLocacao: transacao === 'Alugar',
        precoVendaMin,
        precoVendaMax,
        precoLocacaoMin,
        precoLocacaoMax,
        quartos,
        banheiros,
        vagas,
        areaMin,
        areaMax
    }
    const { data: imoveis, isLoading: loadingImoveis } = api.busca.getImoveisPage.useQuery({ 
        page, ...query
    })
    const { data: count, isLoading: loadingCount } = api.busca.getImoveisCount.useQuery(query)

    useEffect(() => {
        if (tiposDistinct) {
            const activate: { [tipo:string]: boolean } = {}
            for (const { tipo } of tiposDistinct) {
                activate[tipo] = true
            }
            setTipos(activate)
        }
    }, [tiposDistinct])
    
    const pageSize = 25;

    return <BuscaContext.Provider value={{
        transacao, setTransacao,
        loadingTipos,
        tipos, setTipos,
        availableTipos: (tiposDistinct || []).map(({ tipo }: { tipo: string }) => tipo),
        precoVendaMin,
        setPrecoVendaMin,
        precoVendaMax,
        setPrecoVendaMax,
        precoLocacaoMin,
        setPrecoLocacaoMin,
        precoLocacaoMax,
        setPrecoLocacaoMax,
        quartos,
        setQuartos,
        banheiros,
        setBanheiros,
        vagas,
        setVagas,
        areaMin,
        setAreaMin,
        areaMax,
        setAreaMax,
    }}>
        <div className=" sm:grid-cols-[296px_1fr] relative mx-auto mt-24 grid w-full max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8 xl:mt-32">
            <div className="self-baseline mb-4">
                <button style={{display: 'none'}} onClick={() => setMapaActive(!mapaActive)} className="flex flex-row justify-center bg-primary-50 hover:bg-primary-200 text-primary-600 w-full rounded-md py-4 px-4 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                        {
                            mapaActive ? 
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            :
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        }
                    </svg>
                    <span className="font-semibold">
                        {mapaActive ? 'Fechar mapa': 'Buscar pelo mapa'}
                    </span>
                </button>
                <div className="bg-gray-100 text-gray-600 flex flex-col items-baseline rounded-md py-4 px-6">
                    <div className="mb-2">O que você precisa?</div>
                    <div className="pointer-events-auto w-full justify-center flex divide-x divide-slate-400/20 rounded-md bg-white text-[1.0125rem] font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
                        <div onClick={() => setTransacao('Comprar')} className={`${transacao === 'Comprar' ? 'bg-primary-600 hover:bg-primary-700 text-gray-50 hover:text-gray-50' : 'hover:bg-slate-50 hover:text-slate-900'} select-none rounded-r-none text-center rounded-md ring-primary-200 w-full px-6 py-3 cursor-pointer hover:ring-2 `}>Comprar</div>
                        <div onClick={() => setTransacao('Alugar')} className={`${transacao === 'Alugar' ? 'bg-primary-600 hover:bg-primary-700 text-gray-50 hover:text-gray-50' : 'hover:bg-slate-50 hover:text-slate-900'} select-none rounded-l-none text-center rounded-md ring-primary-200 w-full px-6 py-3 cursor-pointer hover:ring-2`}>Alugar</div>
                    </div>
                    <div className="bg-gray-200 h-[1px] w-full my-3 mt-5"></div>
                    <div className="mb-2">Qual tipo?</div>
                    <Tipos/>
                    <div className="mb-2 mt-3">Preço de venda</div>
                    <PrecosVendas/>
                    <div className="mb-2 mt-3">Preço de aluguel</div>
                    <PrecosLocacao/>
                    <div className="bg-gray-200 h-[1px] w-full my-3 mt-5"></div>
                    <div className="mb-2">Quartos</div>
                    <Quartos/>
                    <div className="mb-2 mt-3">Banheiros</div>
                    <Banheiros/>
                    <div className="mb-2 mt-3">Vagas</div>
                    <Vagas/>
                    <div className="mb-2 mt-3">Área</div>
                    <Area/>
                </div>
            </div>
            <div className="sm:ml-6 flex flex-col mb-6" >
                {
                    false &&
                    <div className="flex w-full gap-x-4 relative" >
                        <input
                            id="searchBox"
                            name="searchBox"
                            type="text"
                            className="min-w-0 opacity-50 flex-auto rounded-md border-[1px] bg-white/5 px-3.5 py-2 text-slate-900 shadow-sm ring-2 ring-white/10 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6 outline-none"
                            placeholder="Digite uma cidade, bairro, rua ou estado (BETA)"
                            disabled
                        />
                        <button
                            type="submit"
                            className="flex-none rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                        >
                            Busque
                        </button>
                    </div>
                }
                {
                    mapaActive && <div className="w-full h-[80vh] sm:h-[50vh] bg-gray-50 rounded-md mb-2">
                        <Mapa/>
                    </div>
                }
                <h3 className="col-start-1 row-start-2 max-w-[36rem] text-4xl font-extrabold tracking-tight text-slate-900 sm:text-4xl xl:max-w-[43.5rem]">{loadingCount ? 'Carregando busca...' : `${format(count || 0)} Imóveis encontrados`}</h3>
                <p className="col-start-1 row-start-3 my-4 max-w-lg text-lg text-slate-700">Altere as configurações de busca para achar imóveis diferentes</p>
                <div className="flex flex-col">
                    
                    {imoveis?.map(imovel => <ItemImovel key={imovel.id} imovel={imovel} />)}
                    {
                        (!loadingImoveis && (imoveis as unknown as any[]).length) ? <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm overflow-hidden" aria-label="Pagination">
                            {
                                page > 1 && <a
                            href="#"
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeftIcon onClick={() => setPage(page-1)} className="h-5 w-5" aria-hidden="true" />
                            </a>
                            }
                            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                            
                            {
                                page-3 > 0 && <a
                                href="#"
                                onClick={() => setPage(page-3)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page-3}
                                </a>
                            }
                            
                            {
                                page-2 > 0 && <a
                                href="#"
                                onClick={() => setPage(page-2)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page-2}
                                </a>
                            }
                            {
                                page-1 > 0 && <a
                                href="#"
                                onClick={() => setPage(page-1)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page-1}
                                </a>
                            }
                            
                            <span className="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            {page}
                            </span>
                            
                            {
                                !!count && (page+1 <= Math.ceil(count/pageSize)) && <a
                                href="#"
                                onClick={() => setPage(page+1)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page+1}
                                </a>
                            }
                            {
                                !!count && (page+2 <= Math.ceil(count/pageSize)) && <a
                                href="#"
                                onClick={() => setPage(page+2)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page+2}
                                </a>
                            }
                            {
                                !!count && (page+3 <= Math.ceil(count/pageSize)) && <a
                                href="#"
                                onClick={() => setPage(page+3)}
                                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                >
                                {page+3}
                                </a>
                            }
                            {
                                !!count && (page+1 <= Math.ceil(count/pageSize)) && <a
                                href="#"
                                onClick={() => setPage(page+1)}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                <span className="sr-only">Próxima</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                            }
                            
                        </nav>
                    </div>
                    : null    
                }
                </div>
            </div>
        </div>
    </BuscaContext.Provider>
}

const Icons = {
    'Banheiros': () => {
        return <svg className="mr-2.5 h-5 w-5 flex-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 20L5 21M18 20L19 21" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 12V13C3 16.2998 3 17.9497 4.02513 18.9749C5.05025 20 6.70017 20 10 20H14C17.2998 20 18.9497 20 19.9749 18.9749C21 17.9497 21 16.2998 21 13V12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 12V5.5234C4 4.12977 5.12977 3 6.5234 3C7.64166 3 8.62654 3.73598 8.94339 4.80841L9 5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 6L10.5 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    },
    'Vagas': () => {
        return <svg className="mr-2.5 h-5 w-5 flex-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 12L4.5 13" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.5 12.5L19.5 13" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17.5L8.24567 16.8858C8.61101 15.9725 8.79368 15.5158 9.17461 15.2579C9.55553 15 10.0474 15 11.0311 15H12.9689C13.9526 15 14.4445 15 14.8254 15.2579C15.2063 15.5158 15.389 15.9725 15.7543 16.8858L16 17.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17V19.882C2 20.2607 2.24075 20.607 2.62188 20.7764C2.86918 20.8863 3.10538 21 3.39058 21H5.10942C5.39462 21 5.63082 20.8863 5.87812 20.7764C6.25925 20.607 6.5 20.2607 6.5 19.882V18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 18V19.882C17.5 20.2607 17.7408 20.607 18.1219 20.7764C18.3692 20.8863 18.6054 21 18.8906 21H20.6094C20.8946 21 21.1308 20.8863 21.3781 20.7764C21.7592 20.607 22 20.2607 22 19.882V17" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8.5L21 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8.5L3 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 9L5.5883 5.73509C6.02832 4.41505 6.24832 3.75503 6.7721 3.37752C7.29587 3 7.99159 3 9.38304 3H14.617C16.0084 3 16.7041 3 17.2279 3.37752C17.7517 3.75503 17.9717 4.41505 18.4117 5.73509L19.5 9" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M4.5 9H19.5C20.4572 10.0135 22 11.4249 22 12.9996V16.4702C22 17.0407 21.6205 17.5208 21.1168 17.5875L18 18H6L2.88316 17.5875C2.37955 17.5208 2 17.0407 2 16.4702V12.9996C2 11.4249 3.54279 10.0135 4.5 9Z" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
    },
    'Area': () => {
        return <svg className="mr-2.5 h-5 w-5 flex-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.96967 4.03033C2.67678 3.73744 2.67678 3.26256 2.96967 2.96967C3.26256 2.67678 3.73744 2.67678 4.03033 2.96967L2.96967 4.03033ZM10.5303 9.46967C10.8232 9.76256 10.8232 10.2374 10.5303 10.5303C10.2374 10.8232 9.76256 10.8232 9.46967 10.5303L10.5303 9.46967ZM9.46967 10.5303L2.96967 4.03033L4.03033 2.96967L10.5303 9.46967L9.46967 10.5303Z" fill="#94a3b8"/>
            <path d="M2.96967 19.9697C2.67678 20.2626 2.67678 20.7374 2.96967 21.0303C3.26256 21.3232 3.73744 21.3232 4.03033 21.0303L2.96967 19.9697ZM10.5303 14.5303C10.8232 14.2374 10.8232 13.7626 10.5303 13.4697C10.2374 13.1768 9.76256 13.1768 9.46967 13.4697L10.5303 14.5303ZM9.46967 13.4697L2.96967 19.9697L4.03033 21.0303L10.5303 14.5303L9.46967 13.4697Z" fill="#94a3b8"/>
            <path d="M21.0303 4.03033C21.3232 3.73744 21.3232 3.26256 21.0303 2.96967C20.7374 2.67678 20.2626 2.67678 19.9697 2.96967L21.0303 4.03033ZM13.4697 9.46967C13.1768 9.76256 13.1768 10.2374 13.4697 10.5303C13.7626 10.8232 14.2374 10.8232 14.5303 10.5303L13.4697 9.46967ZM14.5303 10.5303L21.0303 4.03033L19.9697 2.96967L13.4697 9.46967L14.5303 10.5303Z" fill="#94a3b8"/>
            <path d="M21.0303 19.9697C21.3232 20.2626 21.3232 20.7374 21.0303 21.0303C20.7374 21.3232 20.2626 21.3232 19.9697 21.0303L21.0303 19.9697ZM13.4697 14.5303C13.1768 14.2374 13.1768 13.7626 13.4697 13.4697C13.7626 13.1768 14.2374 13.1768 14.5303 13.4697L13.4697 14.5303ZM14.5303 13.4697L21.0303 19.9697L19.9697 21.0303L13.4697 14.5303L14.5303 13.4697Z" fill="#94a3b8"/>
            <path d="M8 3.09779C8 3.09779 4.03374 2.74194 3.38783 3.38785C2.74191 4.03375 3.09783 8 3.09783 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 20.9022C8 20.9022 4.03374 21.2581 3.38783 20.6122C2.74191 19.9662 3.09783 16 3.09783 16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.09779C16 3.09779 19.9663 2.74194 20.6122 3.38785C21.2581 4.03375 20.9022 8 20.9022 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 20.9022C16 20.9022 19.9663 21.2581 20.6122 20.6122C21.2581 19.9662 20.9022 16 20.9022 16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    },
    'Quartos': () => {
        return <svg className="mr-2.5 h-5 w-5 flex-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 17.5H2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 21V16C22 14.1144 22 13.1716 21.4142 12.5858C20.8284 12 19.8856 12 18 12H6C4.11438 12 3.17157 12 2.58579 12.5858C2 13.1716 2 14.1144 2 16V21" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 12V10.2134C11 9.83272 10.9428 9.70541 10.6497 9.55538C10.0395 9.24292 9.29865 9 8.5 9C7.70135 9 6.96055 9.24292 6.35025 9.55538C6.05721 9.70541 6 9.83272 6 10.2134L6 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M18 12V10.2134C18 9.83272 17.9428 9.70541 17.6497 9.55538C17.0395 9.24292 16.2987 9 15.5 9C14.7013 9 13.9605 9.24292 13.3503 9.55538C13.0572 9.70541 13 9.83272 13 10.2134L13 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M21 12V7.36057C21 6.66893 21 6.32311 20.8079 5.99653C20.6157 5.66995 20.342 5.50091 19.7944 5.16283C17.5869 3.79978 14.8993 3 12 3C9.10067 3 6.41314 3.79978 4.20558 5.16283C3.65804 5.50091 3.38427 5.66995 3.19213 5.99653C3 6.32311 3 6.66893 3 7.36057V12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    },
    'Suites': () => {
        return <svg className="mr-2.5 h-5 w-5 flex-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 17.5H2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 21V16C22 14.1144 22 13.1716 21.4142 12.5858C20.8284 12 19.8856 12 18 12H6C4.11438 12 3.17157 12 2.58579 12.5858C2 13.1716 2 14.1144 2 16V21" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 12V10.6178C16 10.1103 15.9085 9.94054 15.4396 9.7405C14.4631 9.32389 13.2778 9 12 9C10.7222 9 9.53688 9.32389 8.5604 9.7405C8.09154 9.94054 8 10.1103 8 10.6178L8 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 12V7.36057C20 6.66893 20 6.32311 19.8292 5.99653C19.6584 5.66995 19.4151 5.50091 18.9284 5.16283C16.9661 3.79978 14.5772 3 12 3C9.42282 3 7.03391 3.79978 5.07163 5.16283C4.58492 5.50091 4.34157 5.66995 4.17079 5.99653C4 6.32311 4 6.66893 4 7.36057V12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>        
    }
}

const ItemImovel = ({ imovel }:{ imovel: Imovel & { fotos: { [url:string]: string }[] } }) => {
    const foto = imovel.fotos[0]
    // currency intl
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const { data: empresa, isLoading: isLoadingEmpresa } = api.empresa.getEmpresaById.useQuery({ id: imovel.empresaId })
    
    const { precoVenda, precoLocacao } = {
        precoVenda: imovel.precoVenda as unknown as number || 0,
        precoLocacao: imovel.precoLocacao as unknown as number || 0
    }
    const preco = formatter.format(precoVenda)

    const createEndereco = () => {
        const { cidade, bairro, rua, estado } = imovel
        return <div className="text-gray-600">
            {cidade}, {bairro}, {rua}
        </div>
    }
    
    const AnimatedLink= animated(Link)
    const [ref, springs] = useInView(() => ({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        delay: 250,
    }))
    return <AnimatedLink ref={ref} style={springs} href={`/imovel/${imovel.empresaId}/${imovel.id}`} className="flex-wrap sm:flex-rows flex-col hover:shadow-lg relative rounded-md border-[1px] border-gray-200 shadow-md bg-white mb-6 flex cursor-pointer overflow-hidden">
        { foto?.url ? <div 
                style={{ backgroundImage: `url(${foto.url})` }}
                className={`flex flex-col sm:w-64 w-[100%] sm:h-[100%] h-64 md:rounded-none bg-cover`}></div> : null }
        <div className={`flex flex-col ${!foto?.url ? 'w-[100%]': 'sm:w-[calc(100%_-_256px)] w-[100%]'} px-6 py-4`}>
            <div className=" tracking-tight flex flex-row justify-between">
                <div className="sm:text-3xl text-2xl text-slate-900 font-bold">{preco}</div>
                {
                    imovel.isPro && <span className="h-8 sm:text-[16px] box-border relative inline-flex items-center justify-center text-center no-underline leading-none whitespace-nowrap font-semibold rounded shrink-0 transition select-none overflow-hidden focus-ring bg-gray-800 hover:bg-gray-900 dark:bg-gray-50 border border-transparent text-gray-50 dark:text-gray-800 dark:hover:bg-white dark:hover:text-gray-900 cursor-pointer hover:text-white py-1.5 px-2">
                        Imóvel #PRO
                    </span>
                }
                
            </div>
            <div className="line-clamp-3 text-gray-600 my-1">
                {imovel.descricao}
            </div>
            <div className="mb-1 text-lg font-bold line-clamp-2">
                {createEndereco()}
            </div>
            <div className="flex sm:flex-row flex-col">
                <div className="flex flex-col gap-y-1 mt-2">
                    {
                        (!!imovel.quartos || 
                        !!imovel.suites || 
                        !!imovel.vagas || 
                        !!imovel.banheiros || 
                        !!imovel?.areaTotal && imovel?.areaTotal as unknown as string != '0') ?
                        <div className="sm:w-fit w-full justify-between rounded-md shadow-sm ring-1 ring-slate-700/10 overflow-hidden flex-col flex">
                            {!!imovel.quartos && <div className="justify-between border-slate-700/10 pointer-events-auto relative inline-flex bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"><div className="flex px-3 py-2">{Icons.Quartos()}Quartos</div><div className="border-l w-16 flex justify-center border-slate-400/20 px-2.5 py-2">{imovel.quartos}</div></div>}
                            {!!imovel.suites && <div className="justify-between border-t-[1px] border-slate-700/10 pointer-events-auto relative inline-flex bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"><div className="flex px-3 py-2">{Icons.Suites()}Suítes</div><div className="border-l w-16 flex justify-center border-slate-400/20 px-2.5 py-2">{imovel.suites}</div></div>}
                            {!!imovel.vagas && <div className="justify-between border-t-[1px] border-slate-700/10pointer-events-auto relative inline-flex bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"><div className="flex px-3 py-2">{Icons.Vagas()}Vagas</div><div className="border-l w-16 flex justify-center border-slate-400/20 px-2.5 py-2">{imovel.vagas}</div></div>}
                            {
                                !!imovel.banheiros &&
                                <div className="justify-between border-t-[1px] border-slate-700/10pointer-events-auto relative inline-flex bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"><div className="flex px-3 py-2">
                                    {Icons.Banheiros()}
                                    Banheiros
                                    </div>
                                    <div className="border-l w-16 flex justify-center border-slate-400/20 px-2.5 py-2">{imovel.banheiros}</div>
                                </div>
                            }
                            {
                                !!imovel?.areaTotal && imovel?.areaTotal as unknown as string != '0' ? <div className="justify-between border-t-[1px] border-slate-700/10pointer-events-auto relative inline-flex bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"><div className="flex px-3 py-2">{Icons.Area()}Área</div><div className="border-l w-16 flex justify-center border-slate-400/20 px-2.5 py-2">{imovel.areaTotal as unknown as number}m²</div></div> : null
                            }
                        </div> : null
                    }
                </div>
                <div className="mt-4 sm:mt-0 w-full text-right flex flex-wrap flex-col justify-end content-end">
                    <button onClick={(e) => {e.preventDefault();alert('Hello')}} className="pointer-events-auto rounded-md bg-primary-600 px-3 py-4 font-semibold leading-5 text-white hover:bg-primary-500">
                        Entrar em contato
                    </button>
                    {
                        isLoadingEmpresa || !empresa ? <div className="relative mt-4 flex items-center gap-x-4 w-full">
                        <div className="animate-pulse flex space-x-4 w-full">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 bg-slate-200 rounded"></div>
                            <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    : <Link href={`/empresa/${empresa.id}`} className="relative mt-4 flex items-center gap-x-4">
                            <img src={empresa.foto} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                            <div className="text-sm leading-6">
                                <p className="font-semibold text-gray-900">
                                <a href={'#'}>
                                    <span className="absolute inset-0" />
                                    {empresa.nome}
                                </a>
                                </p>
                                <p className="text-gray-600">{empresa.email || empresa.telefone}</p>
                            </div>
                        </Link>
                    }
                </div>
            </div>
        </div>
    </AnimatedLink>
}

const TiposRelate = {
    'Residential / Apartment': 'Apartamento',
    'Residential / Condo': 'Condomínio',
    'Residential / Home': 'Casa',
    'Residential / Land Lot': 'Terreno',
    'Residential / Penthouse': 'Cobertura',
}

function PrecosVendas() {
    const BuscaParams = useContext(BuscaContext)
    
    function extractDigits(str:string) {
        const regex = /\d+/g; // match one or more digits
        const digits = str.match(regex);
        return digits ? digits.join('') : ''; // join the matches together and return as a string
    }
    const onMin = (value:string) => {
        BuscaParams.setPrecoVendaMin(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }
    const onMax = (value:string) => {
        BuscaParams.setPrecoVendaMax(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }

    return <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <input value={!BuscaParams.precoVendaMin ? undefined : format(BuscaParams.precoVendaMin)} onChange={(e) => onMin(e.target.value)} type="text" placeholder="R$ 0" className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
                <span>até</span>                
                <input value={!BuscaParams.precoVendaMax ? undefined : format(BuscaParams.precoVendaMax)} onChange={(e) => onMax(e.target.value)} type="text" placeholder="R$ 0" className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
            </div>
        </div>
    </div>
}

function PrecosLocacao() {
    const BuscaParams = useContext(BuscaContext)
    
    function extractDigits(str:string) {
        const regex = /\d+/g; // match one or more digits
        const digits = str.match(regex);
        return digits ? digits.join('') : ''; // join the matches together and return as a string
    }
    const onMin = (value:string) => {
        BuscaParams.setPrecoLocacaoMin(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }
    const onMax = (value:string) => {
        BuscaParams.setPrecoLocacaoMax(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }

    return <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <input value={!BuscaParams.precoLocacaoMin ? undefined : format(BuscaParams.precoLocacaoMin)} onChange={(e) => onMin(e.target.value)} type="text" placeholder="R$ 0" className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
                <span>até</span>                
                <input 
                value={!BuscaParams.precoLocacaoMax ? undefined : format(BuscaParams.precoLocacaoMax)} 
                onChange={(e) => onMax(e.target.value)} 
                type="text" placeholder="R$ 0" 
                className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
            </div>
        </div>
    </div>
}

function Quartos() {
    const BuscaParams = useContext(BuscaContext)

    const isActive = (quartos: number) => {
        if (BuscaParams.quartos === quartos) {
            return 'bg-primary-600 text-white hover:bg-primary-700 ring-primary-200 ring-gray-300'
        } else {
            return 'bg-white hover:bg-gray-50 ring-gray-300'
        }
    }

    const setActive = (quartos: number) => {
        if (quartos === BuscaParams.quartos) {
            BuscaParams.setQuartos(0)
        } else {
            BuscaParams.setQuartos(quartos)
        }
    }

    return <OneToFourList setActive={setActive} isActive={isActive}/>
}

function Banheiros() {
    const BuscaParams = useContext(BuscaContext)

    const isActive = (banheiros: number) => {
        if (BuscaParams.banheiros === banheiros) {
            return 'bg-primary-600 text-white hover:bg-primary-700 ring-primary-200 ring-gray-300'
        } else {
            return 'bg-white hover:bg-gray-50 ring-gray-300'
        }
    }

    const setActive = (banheiros: number) => {
        if (banheiros === BuscaParams.banheiros) {
            BuscaParams.setBanheiros(0)
        } else {
            BuscaParams.setBanheiros(banheiros)
        }
    }

    return <OneToFourList setActive={setActive} isActive={isActive}/>
}

function Vagas() {
    const BuscaParams = useContext(BuscaContext)

    const isActive = (vagas: number) => {
        if (BuscaParams.vagas === vagas) {
            return 'bg-primary-600 text-white hover:bg-primary-700 ring-primary-200 ring-gray-300'
        } else {
            return 'bg-white hover:bg-gray-50 ring-gray-300'
        }
    }

    const setActive = (vagas: number) => {
        if (vagas === BuscaParams.vagas) {
            BuscaParams.setVagas(0)
        } else {
            BuscaParams.setVagas(vagas)
        }
    }

    return <OneToFourList setActive={setActive} isActive={isActive}/>
}

const OneToFourList = ({ setActive, isActive }: { setActive: (qtd:number) => void, isActive: (qtd:number) => string}) => {
    return <div className="w-full flex items-center flex-row justify-between">
        <div onClick={() => setActive(1)} className={`${isActive(1)} select-none cursor-pointer rounded-md w-[20%] text-sm font-semibold text-gray-900 shadow-sm ring-1 py-2 text-center`}>1</div>
        <div onClick={() => setActive(2)} className={`${isActive(2)} select-none cursor-pointer rounded-md w-[20%] text-sm font-semibold text-gray-900 shadow-sm ring-1 py-2 text-center`}>2</div>
        <div onClick={() => setActive(3)} className={`${isActive(3)} select-none cursor-pointer rounded-md w-[20%] text-sm font-semibold text-gray-900 shadow-sm ring-1 py-2 text-center`}>3</div>
        <div onClick={() => setActive(4)} className={`${isActive(4)} select-none cursor-pointer rounded-md w-[20%] text-sm font-semibold text-gray-900 shadow-sm ring-1 py-2 text-center`}>4+</div>
    </div>
}

function Tipos() {
    const BuscaParams = useContext(BuscaContext)
    const toggleAll = () => {
        if (BuscaParams.availableTipos.length === Object.keys(BuscaParams.tipos).length) {
            BuscaParams.setTipos({})
        } else {
            BuscaParams.setTipos(BuscaParams.availableTipos.reduce((acc:{ [tipo: string]: boolean }, tipo:string) => {
                acc[tipo] = true
                return acc
            }, {}))
        }
    }
    const actives: { [tipo:string]: true } = Object.entries(BuscaParams.tipos).filter(([key, value]) => value).reduce<{ [tipo:string]: true } >((acc:{ [tipo:string]: true } , [key, value]) => {
        acc[key] = true
        return acc
    }, {})
    return (
        <Menu as="div" className="relative inline-block text-left w-full">
        <div className="w-full">
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {
                    Object.keys(actives).length === 0 ? 
                    'Selecione um tipo' : 
                    BuscaParams.availableTipos.length === Object.keys(actives).length 
                    ? 'Todos os imóveis' 
                    : <span>
                        {TiposRelate[Object.keys(actives)[0] as 'Residential / Apartment']}
                        {Object.keys(actives).length > 1 && <span className="text-gray-400"> + {Object.keys(actives).length - 1}</span>}
                    </span>}
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
        </div>
  
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
                <div onClick={toggleAll} className="cursor-pointer hover:bg-gray-100">
                    <a className="text-gray-700 px-4 py-2 text-md flex font-medium align-center">
                        <SwitchComp
                        value={BuscaParams.availableTipos.length === Object.keys(actives).length}/>
                        <span className="ml-2">Todos os imóveis</span>
                        
                    </a>
                </div>
            </div>
            <div className="py-1">
                {
                    BuscaParams?.availableTipos?.map(tipo => {
                        return <div key={tipo} className="cursor-pointer hover:bg-gray-100" onClick={() => BuscaParams.setTipos({ ...BuscaParams.tipos, [tipo]: !BuscaParams.tipos[tipo] })}>
                            <span className="text-gray-700 px-4 py-2 text-md flex font-medium align-center">
                                <SwitchComp 
                                value={!!BuscaParams.tipos[tipo]} 
                                />
                                <span className="ml-2">{TiposRelate[tipo as 'Residential / Apartment']}</span>
                                
                            </span>
                        </div>
                    })
                }
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    )
}

function Area() {
    
    const BuscaParams = useContext(BuscaContext)
    
    function extractDigits(str:string) {
        const regex = /\d+/g; // match one or more digits
        const digits = str.match(regex);
        return digits ? digits.join('') : ''; // join the matches together and return as a string
    }
    const onMin = (value:string) => {
        BuscaParams.setAreaMin(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }
    const onMax = (value:string) => {
        BuscaParams.setAreaMax(Number(extractDigits((value).replaceAll(',', '').replaceAll('.', ''))))
    }

    return <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <input value={!BuscaParams.areaMin ? undefined : format(BuscaParams.areaMin)} onChange={(e) => onMin(e.target.value)} type="text" placeholder="0m²" className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
                <span>até</span>                
                <input value={!BuscaParams.areaMax ? undefined : format(BuscaParams.areaMax)} onChange={(e) => onMax(e.target.value)} type="text" placeholder="1000m²" className="outline-primary-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" />
            </div>
        </div>
    </div>
}

function SwitchComp({ value, toggleEnabled = () => {} }: { value: boolean, toggleEnabled?: () => void }) {
  
    return (
        <Switch
          checked={value}
          onChange={toggleEnabled}
          className={classNames(
            value ? 'bg-primary-600' : 'bg-gray-200',
            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
                value ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
            )}
          />
        </Switch>
    )
}

export default Busca