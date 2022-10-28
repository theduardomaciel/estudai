import React, { useState } from 'react';

import Modal from '..';

import { useAuth } from '../../../contexts/AuthContext';

export default function LogoutModalPreset() {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const { signOut } = useAuth();

    async function logout() {
        setLoading(true)
        await signOut()
    }

    return {
        LogoutModal: <Modal
            isVisible={isModalVisible}
            toggleVisibility={() => setModalVisible(!isModalVisible)}
            color={`var(--primary-02)`}
            icon={'exit_to_app'}
            title={"Tem certeza que deseja sair?"}
            description={"Será necessário entrar com sua conta novamente para poder acessar a plataforma."}
            actionProps={{
                buttonText: "LOG-OUT",
                function: logout
            }}
            isLoading={isLoading}
        />,
        setLogoutModalVisible: setModalVisible
    }
}