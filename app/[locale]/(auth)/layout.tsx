import React from "react";

// Styles
import styles from "./styles.module.css";

import { GoogleProvider } from "./components/Google";

// Components
import Device from "@/components/Landing/Device";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GoogleProvider>
			<main className={styles.holder}>
				<div id="authMainContainer" className={styles.container}>
					{children}
				</div>
				<Device additionalClass={styles.device} />
			</main>
		</GoogleProvider>
	);
}
