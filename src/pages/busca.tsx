import { useState, Fragment, createContext, useContext, useEffect } from "react"
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Switch } from '@headlessui/react'
import { api } from "~/utils/api"
import { Imovel } from "@prisma/client"

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
    availableTipos: [] as string[]
})

const Busca = () => {
    const [ transacao, setTransacao ] = useState('Comprar')
    const [ tipos, setTipos ] = useState({})
    const { data:tiposDistinct, isLoading: loadingTipos } = api.busca.getTipos.useQuery()
    const { data:imoveisQuery, isLoading: loadingImoveis} = api.busca.getImoveisPage.useQuery({ page: 1 })
    useEffect(() => {
        if (tiposDistinct) {
            const activate: { [tipo:string]: boolean } = {}
            for (const { tipo } of tiposDistinct) {
                activate[tipo] = true
            }
            setTipos(activate)
        }
    }, [tiposDistinct])
    

    // grid-template-columns: 296px 1fr
    return <BuscaContext.Provider value={{
        transacao, setTransacao,
        loadingTipos,
        tipos, setTipos,
        availableTipos: (tiposDistinct || []).map(({ tipo }: { tipo: string }) => tipo)
    }}>
        <div className="sm:grid-cols-[296px_1fr] relative mx-auto mt-16 grid w-full max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8 xl:mt-32">
            <div className="bg-gray-100 text-gray-600 flex flex-col items-center justify-center rounded-md py-4 px-6">
                <div className="mb-2">O que você precisa?</div>
                <div className="pointer-events-auto w-full justify-center flex divide-x divide-slate-400/20 rounded-md bg-white text-[1.0125rem] font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
                    <div onClick={() => setTransacao('Comprar')} className={`${transacao === 'Comprar' ? 'bg-primary-600 hover:bg-primary-700 text-gray-50 hover:text-gray-50' : 'hover:bg-slate-50 hover:text-slate-900'} select-none rounded-r-none text-center rounded-md ring-primary-200 w-full px-6 py-3 cursor-pointer hover:ring-2 `}>Comprar</div>
                    <div onClick={() => setTransacao('Alugar')} className={`${transacao === 'Alugar' ? 'bg-primary-600 hover:bg-primary-700 text-gray-50 hover:text-gray-50' : 'hover:bg-slate-50 hover:text-slate-900'} select-none rounded-l-none text-center rounded-md ring-primary-200 w-full px-6 py-3 cursor-pointer hover:ring-2`}>Alugar</div>
                </div>
                <div className="bg-gray-200 h-[1px] w-full my-6"></div>
                <div className="mb-2">Qual tipo?</div>
                <Tipos/>
            </div>
            <div className="ml-6 flex flex-col" >
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
                <div className="flex flex-col">
                    {imoveisQuery?.map(imovel => <ItemImovel key={imovel.id} imovel={imovel} />)}
                </div>
            </div>
            <div>3</div>
        </div>
    </BuscaContext.Provider>
}

const ItemImovel = ({ imovel }:{ imovel: Imovel }) => {
    return <div className="rounded-md shadow-sm bg-white mb-6 flex cursor-pointer">
        {imovel.titulo}
    </div>
}

const TiposRelate = {
    'Residential / Apartment': 'Apartamento',
    'Residential / Condo': 'Condomínio',
    'Residential / Home': 'Casa',
    'Residential / Land Lot': 'Terreno',
    'Residential / Penthouse': 'Cobertura',
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
    return (
        <Menu as="div" className="relative inline-block text-left w-full">
        <div className="w-full">
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {
                    Object.keys(BuscaParams.tipos).length === 0 ? 
                    'Selecione um tipo' : 
                    BuscaParams.availableTipos.length === Object.keys(BuscaParams.tipos).length 
                    ? 'Todos os imóveis' 
                    : <span>
                        {TiposRelate[Object.keys(BuscaParams.tipos)[0] as 'Residential / Apartment']}
                        {Object.keys(BuscaParams.tipos).length > 1 && <span className="text-gray-400"> + {Object.keys(BuscaParams.tipos).length - 1}</span>}
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
                        value={BuscaParams.availableTipos.length === Object.keys(BuscaParams.tipos).length}/>
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