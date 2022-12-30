import { decode } from 'jsonwebtoken';
import prisma from '../lib/prisma';

export default async function getUser(token: string, groupsComplexity?: 'basic' | 'full' | boolean, tasksComplexity?: 'basic' | 'full' | boolean) {
    const decodePayload = decode(token) as { email: string };

    if (!decodePayload) return null;

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

    const fullTasksQuery = {
        include: {
            interactedBy: true,
            group: true,
            subjects: true
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: decodePayload?.email
            },
            include: {
                tasks: tasksComplexity === "full" ? fullTasksQuery : tasksComplexity === "basic" ? true : false,
                groups: groupsComplexity === 'full' ? fullGroupsQuery : groupsComplexity === 'basic' ? true : false
            }
        })
        if (user && user !== null) {
            //console.log("Usuário obtido com sucesso!")
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