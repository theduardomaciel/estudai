import prisma from "../lib/prisma";

export default async function getAllAnnouncements() {
	try {
		const announcements = await prisma.announcement.findMany({
			take: 25,
			include: {
				user: true,
			},
		});
		if (announcements && announcements !== null) {
			return announcements;
		} else {
			console.log("❌ Não foi possível retornar os anúncios.");
		}
	} catch (error) {
		console.log(error);
	}
}
