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
            setIsVisible={setModalVisible}
            color={`var(--primary-02)`}
            Icon={'exit_to_app'}
            title={"Tem certeza que deseja sair?"}
            description={"Será necessário entrar com sua conta novamente para poder acessar a plataforma."}
            buttonText="LOG-OUT"
            actionFunction={logout}
            isLoading={isLoading}
            zIndex={25}
        />,
        setLogoutModalVisible: setModalVisible
    }
}