import prisma from '../lib/prisma';

export default async function getUser(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id as string,
            }
        })
        if (user) {
            console.log(user, "🐶 Usuário obtido com sucesso!")
            return user
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}