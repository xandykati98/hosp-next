import type { Imovel } from "@prisma/client";
import type { NextPageContext } from "next";
import { prisma } from "~/server/db";

const ImovelPage = (props:{ wstrdates_imovel:Imovel }) => {
    const imovel:Imovel = {
        ...props.wstrdates_imovel,
        createdAt: new Date(props.wstrdates_imovel.createdAt),
        updatedAt: new Date(props.wstrdates_imovel.updatedAt)
    }
    return <>
        <div className="mt-12">{JSON.stringify(imovel)}</div>
    </>
}


export const getServerSideProps = async (context:NextPageContext): Promise<{ props?: { wstrdates_imovel: Imovel; }; notFound?: boolean; }> => {
    const { empresa_id, imovel_id } = context.query
    const imovel = await prisma.imovel.findFirst({
        where: {
            id: imovel_id as string,
            empresaId: empresa_id as string
        }})
    console.log(imovel)
    if (!imovel) return { notFound: true }
    return {
        props: { 
            wstrdates_imovel: JSON.parse(JSON.stringify(imovel)) as unknown as Imovel
        }
    }
}

export default ImovelPage