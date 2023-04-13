import { Imovel } from "@prisma/client"
import PropertyCard from "./property.card"

const mock_properties:Imovel[] = [
    {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        desc: 'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        empresaId: '2',
        rua: 'Rua de Testes',
        bairro: 'Bairro de Testes',
        cidade: 'Cidade de Testes',
        estado: 'RS',
        precoVenda: 100000,
        precoLocacao: 1000,
        isAtivo: true,
        isVenda: true,
        isLocacao: false,
        numero: '321',
        cep: '12345-678',
        titulo: 'Este é o título do imóvel',
        isPro: true,
        isUltra: false,
        precoDescontoLocacao: null,
        precoDescontoVenda: null,
    },
    {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        desc: 'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        empresaId: '2',
        rua: 'Rua de Testes',
        bairro: 'Bairro de Testes',
        cidade: 'Cidade de Testes',
        estado: 'RS',
        precoVenda: 100000,
        precoLocacao: 1000,
        isAtivo: true,
        isVenda: true,
        isLocacao: false,
        numero: '321',
        cep: '12345-678',
        titulo: 'Este é o título do imóvel',
        isPro: true,
        isUltra: false,
        precoDescontoLocacao: null,
        precoDescontoVenda: null,
    },
    {
        id: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
        desc: 'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        empresaId: '2',
        rua: 'Rua de Testes',
        bairro: 'Bairro de Testes',
        cidade: 'Cidade de Testes',
        estado: 'RS',
        precoVenda: 100000,
        precoLocacao: 1000,
        isAtivo: true,
        isVenda: true,
        isLocacao: false,
        numero: '321',
        cep: '12345-678',
        titulo: 'Este é o título do imóvel',
        isPro: true,
        isUltra: false,
        precoDescontoLocacao: null,
        precoDescontoVenda: null,
    },
]
const posts = [
    {
        id: 1,
        title: 'Este é o título do imóvel',
        href: '#',
        description:
            'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        date: 'Mar 16, 2020',
        datetime: '2020-03-16',
        category: { title: 'Marketing', href: '#' },
        author: {
            name: 'Michael Foster',
            role: 'Co-Founder / CTO',
            href: '#',
            imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        id: 2,
        title: 'Este é o título do imóvel',
        href: '#',
        description:
            'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        date: 'Mar 16, 2020',
        datetime: '2020-03-16',
        category: { title: 'Marketing', href: '#' },
        author: {
            name: 'Michael Foster',
            role: 'Co-Founder / CTO',
            href: '#',
            imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        id: 3,
        title: 'Este é o título do imóvel',
        href: '#',
        description:
            'Este belíssimo apartamento está localizado em um bairro tranquilo e arborizado, a apenas alguns minutos do centro da cidade. Com três quartos espaçosos e uma ampla sala de estar, o imóvel é perfeito para famílias ou para quem deseja espaço para trabalhar em casa. A cozinha moderna possui acabamentos em mármore e equipamentos de última geração, tornando-a ideal para preparar refeições gourmet.',
        date: 'Mar 16, 2020',
        datetime: '2020-03-16',
        category: { title: 'Marketing', href: '#' },
        author: {
            name: 'Michael Foster',
            role: 'Co-Founder / CTO',
            href: '#',
            imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    // More posts...
  ]
  
function SomeProperties() {
    return (
      <div className="bg-white mb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Alguns dos nossos imóveis</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
                Descubra a variedade de propriedades que temos a oferecer.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-10 sm:mt-8 sm:pt-0 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {mock_properties.map((imv) => (
              <PropertyCard key={imv.id} property={imv}/>
            ))}
          </div>
        </div>
      </div>
    )
}
export default SomeProperties