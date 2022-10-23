import prisma from '../lib/prisma';

export default async function getUser(id: number, includeGroups?: 'basic' | 'full') {
    const fullGroupsQuery = {
        include: {
            users: true,
            tasks: {
                include: {
                    interactedBy: true
                }
            }
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                tasks: {
                    include: {
                        interactedBy: true,
                    }
                },
                groups: includeGroups === 'full' ? fullGroupsQuery : includeGroups === 'basic' ? true : false
            }
        })
        if (user && user !== null) {
            console.log('user', "🐶 Usuário obtido com sucesso!")
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