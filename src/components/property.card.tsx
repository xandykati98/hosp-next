import { Imovel } from "@prisma/client"
import { useInView, animated } from "@react-spring/web"
import { api } from "~/utils/api"

const PropertyCard = ({ property }: { property: Imovel }) => {
    
    const [ref, springs] = useInView(
        () => ({
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
        },
        })
    )

    const { data: fotos, isLoading: isLoadingFotos } = api.imovel.getPropertyPhotos.useQuery({ imovelId: property.id, limit: 1 })
    const { data: empresa, isLoading: isLoadingEmpresa } = api.empresa.getEmpresaById.useQuery({ id: property.empresaId })

    return <animated.article ref={ref} style={springs} key={property.id} className="flex max-w-xl flex-col items-start justify-between pb-4">
        {
            isLoadingFotos || !fotos ? <a href={'#'} className="w-[100%] h-64 mb-4 rounded-md bg-gray-500 animate-pulse"></a>
            : <a href={'#'} className="w-[100%] h-64 mb-4 rounded-md">
                <div 
                style={{ backgroundImage: `url(${fotos[0]?.url})` }}
                className={`rounded-md w-[100%] h-64 bg-cover shadow-md ring-1 ring-gray-900/10 hover:ring-gray-900/20`}>
                    
                </div>
            </a>
        }
        
        <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={property.updatedAt.toLocaleDateString(undefined, { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' })} className="text-gray-500">
            {property.updatedAt.toLocaleDateString(undefined, { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <a
            href={"#"}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
        >
            {property.tipo}
        </a>
        </div>
        <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <a href={'#'}>
            <span className="absolute inset-0" />
            {property.titulo}
            </a>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{property.descricao}</p>
        </div>
        {
            isLoadingEmpresa || !empresa ? <div className="relative mt-8 flex items-center gap-x-4 w-[100%]">
            <div className="animate-pulse flex space-x-4 w-[100%]">
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
          : <div className="relative mt-8 flex items-center gap-x-4">
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
            </div>
        }
        
    </animated.article>
}
export default PropertyCard