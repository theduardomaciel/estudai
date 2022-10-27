import prisma from '../lib/prisma';

export default async function getGroup(id?: number, inviteLink?: string) {
    try {
        let group;

        if (id) {
            group = await prisma.group.findUnique({
                where: {
                    id: id
                },
                include: {
                    users: true,
                    tasks: true
                }
            })
        } else if (inviteLink) {
            group = await prisma.group.findUnique({
                where: {
                    shareLink: inviteLink,
                },
                include: {
                    users: true,
                    tasks: true
                }
            })
        }

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