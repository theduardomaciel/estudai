"use client";
import React, { useState } from "react";

import Modal from "..";

import ExitIcon from "@material-symbols/svg-600/rounded/exit_to_app.svg";

import { Translations } from "@/i18n/hooks";
import { signOut } from "@/lib/auth";

interface LogoutModalProps {
	dict: Translations["modal"];
}

export default function LogoutModalPreset({ dict: t }: LogoutModalProps) {
	const [isModalVisible, setModalVisible] = useState(false);
	const [isLoading, setLoading] = useState(false);

	async function logout() {
		setLoading(true);
		signOut();
	}

	return {
		LogoutModal: (
			<Modal
				isVisible={isModalVisible}
				toggleVisibility={() => setModalVisible(!isModalVisible)}
				icon={ExitIcon}
				color={`var(--primary-02)`}
				title={t.logout.title}
				description={t.logout.description}
				actionProps={{
					buttonText: t.logout.button,
					function: logout,
				}}
				dict={t.default}
				isLoading={isLoading}
			/>
		),
		setLogoutModalVisible: setModalVisible,
	};
}
