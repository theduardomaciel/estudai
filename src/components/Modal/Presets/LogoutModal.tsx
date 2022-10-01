import React, { useState } from 'react';

import DashboardModal from '..';

import { useAuth } from '../../../contexts/AuthContext';

export default function LogoutModalPreset() {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const { signOut } = useAuth();

    async function logout() {
        setLoading(true)

        signOut()
    }

    return {
        LogoutModal: <DashboardModal
            isVisible={isModalVisible}
            setIsVisible={setModalVisible}
            color={`var(--primary-02)`}
            Icon={'exit_to_app'}
            title={"Tem certeza que deseja sair?"}
            description={<p>Será necessário entrar com sua conta novamente para poder acessar a plataforma.</p>}
            buttonText="LOG-OUT"
            actionFunction={logout}
            isLoading={isLoading}
        />,
        setLogoutModalVisible: setModalVisible
    }
}