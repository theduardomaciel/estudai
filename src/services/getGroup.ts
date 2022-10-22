import prisma from '../lib/prisma';

export default async function getGroup(id: number) {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: id
            },
            include: {
                users: true
            }
        })
        if (group) {
            console.log("🏃‍♂️ O grupo foi encontrado com sucesso!")
            return group;
        } else {
            console.log("❌ Não foi possível retornar o grupo.")
        }
    } catch (error) {
        console.log(error)
    }
}