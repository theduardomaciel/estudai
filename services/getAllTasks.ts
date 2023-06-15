import prisma from '../lib/prisma';

export default async function getAllTasks() {
    try {
        const tasks = await prisma.task.findMany({
            take: 100
        })
        if (tasks && tasks !== null) {
            console.log("🐶 As 100 primeiras tarefas foram retornadas com sucesso!")
            return tasks;
        } else {
            console.log("❌ Não foi possível retornar as tarefas")
        }
    } catch (error) {
        console.log(error)
    }
}