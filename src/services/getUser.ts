import prisma from '../lib/prisma';

export default async function getUser(id: number) {
    console.log(id)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        if (user && user !== null) {
            console.log(user, "🐶 Usuário obtido com sucesso!")
            return user;
        } else {
            console.log("❌ Não foi possível obter o usuário.")
            return null;
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}