"use client";

import React, { useState } from "react";

import Modal from "..";

import { signOut } from "@/lib/auth";

import ExitIcon from "@material-symbols/svg-600/rounded/exit_to_app.svg";

interface LogoutModalProps {
	dict: {
		title: string;
		description: string;
		buttonText: string;
	};
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
				title={t.title}
				description={t.description}
				actionProps={{
					buttonText: t.buttonText,
					function: logout,
				}}
				isLoading={isLoading}
			/>
		),
		setLogoutModalVisible: setModalVisible,
	};
}
