import React, { useState } from 'react';

import Modal from '..';

import { useAuth } from '../../../contexts/AuthContext';
import { TranslateText } from '../../Translate';

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
            title={TranslateText("Are you sure you want to quit?")}
            description={TranslateText("You will need to sign in with your account again to be able to access the platform.")}
            actionProps={{
                buttonText: "LOG-OUT",
                function: logout
            }}
            isLoading={isLoading}
        />,
        setLogoutModalVisible: setModalVisible
    }
}