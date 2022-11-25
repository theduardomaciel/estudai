import prisma from '../lib/prisma';

export default async function getUserIdByToken(token: string) {
    if (!token) {
        return null
    }
    try {
        const account = await prisma.account.findFirst({
            where: {
                access_token: token
            },
            include: {
                user: true
            }
        })
        if (account && account !== null) {
            const id = account.user.id;

            //console.log("ID do usuário obtido com sucesso!")
            return id;
        } else {
            console.log("❌ Não foi possível obter o ID do usuário.")
            return null;
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}