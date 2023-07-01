import styles from "@/styles/settings.module.css";

import EmptyMessage from "@/components/Containers/Empty";

import getUser from "@/services/getUser";
import { useTranslations } from "@/i18n/hooks";

export default async function Page({ params }: { params: {} }) {
	const t = useTranslations();
	const user = await getUser();

	const message = <EmptyMessage description={t.settings.wip} />;
	const NAME = `${user?.firstName} ${user?.lastName ?? ""}`;

	return <div className={styles.mainSection}>{message}</div>;
}
