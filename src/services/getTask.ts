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
                        uploadedBy: true,
                        markedBy: true,
                    },
                },
                group: true,
                interactedBy: true,
            }
        })
        if (task) {
            console.log("🏃‍♂️ A tarefa foi encontrada com sucesso!")
            return task;
        } else {
            console.log("❌ Não foi possível retornar a tarefa.")
        }
    } catch (error) {
        console.log(error)
    }
}