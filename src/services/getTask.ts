import prisma from '../lib/prisma';

export default async function getTask(id: number) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: id
            },
            include: {
                createdBy: true,
                attachments: {
                    include: {
                        markedBy: true
                    },
                },
                interactedBy: true,
            }
        })
        if (task) {
            console.log("🏃‍♂️ A tarefa foi encontrada com sucesso!")
            return task;
        } else {
            console.log("❌ Não foi possível retornar as tarefa.")
        }
    } catch (error) {
        console.log(error)
    }
}