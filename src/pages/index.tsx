import { useInView, animated } from "@react-spring/web"
import Link from "next/link"
import Empresas from "~/components/empresas"
import SomeProperties from "~/components/property.some"

function Count() {
  const stats = [
    { id: 1, name: 'Imóveis disponíveis', value: '12 milhões' },
    { id: 2, name: 'Fotos de imóveis', value: '68 milhões' },
    { id: 3, name: 'Imobiliárias/Corretores', value: '16.027' },
  ]
  
  const [ref, springs] = useInView(
    () => ({
      from: {
        opacity: 0
      },
      to: {
        opacity: 1
      },
    })
  )

  const [ref_withY, springs_withY] = useInView(
    () => ({
      from: {
        opacity: 0,
        y: 80,
      },
      to: {
        opacity: 1,
        y: 0,
      },
    })
  )

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <animated.dt style={springs_withY} ref={ref_withY} className="text-base leading-7 text-gray-600">{stat.name}</animated.dt>
              <animated.dd style={springs} ref={ref} className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </animated.dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
    <div className="bg-[url(/1.jpg)] bg-cover">
      <div className="bg-white/80 ">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Experimente nosso sistema de busca feito com IA.{' '}
                <a href="#" className="font-semibold text-primary-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Saiba mais <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="animate-fade text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Imóveis de qualidade para você!
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Descubra a casa dos seus sonhos com a nossa seleção de imóveis de alta qualidade, que combinam conforto, elegância e segurança
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/busca"
                  className="active:ring-2 ring-primary-400 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Começar sua busca
                </Link>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                  Saiba mais <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Count/>
    <SomeProperties limit={3}/>
    <Empresas/>
    
    </>
  )
}