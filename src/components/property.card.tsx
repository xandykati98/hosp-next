import { Imovel } from "@prisma/client"
import { useInView, animated } from "@react-spring/web"

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

    return <animated.article ref={ref} style={springs} key={property.id} className="flex max-w-xl flex-col items-start justify-between pb-4">
        <a href={'#'} className="w-[100%] h-64 mb-4 ">
            <div className="bg-[url(/2.jpg)] rounded-md w-[100%] h-64 bg-cover shadow-md ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                
            </div>
        </a>
        <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={'Mar 16, 2020'} className="text-gray-500">
            {'Mar 16, 2020'}
        </time>
        <a
            href={'Casa'}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
        >
            {'Casa'}
        </a>
        </div>
        <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <a href={'#'}>
            <span className="absolute inset-0" />
            {property.titulo}
            </a>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{property.desc}</p>
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
        <img src={'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
        <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
            <a href={'#'}>
                <span className="absolute inset-0" />
                {'Michael Foster'}
            </a>
            </p>
            <p className="text-gray-600">{'Co-Founder / CTO'}</p>
        </div>
        </div>
    </animated.article>
}
export default PropertyCard