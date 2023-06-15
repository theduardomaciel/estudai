import React, { useState } from 'react';

import Modal from '..';
import Input from '../../Input';

export default function EarlyAccessModalPreset() {
    const [code, setCode] = useState<undefined | string>(undefined);

    return <Modal
        isVisible={code !== "appestudai"}
        icon={"pending_actions"}
        color={`var(--primary-02)`}
        toggleVisibility={() => setCode(undefined)}
        suppressReturnButton
        title='Ainda não estamos 100% prontos.'
        description="Por isso, o estudaí ainda não está disponível para todos. Se você possui acesso antecipado, por favor insira o código no campo abaixo:"
    >
        <Input
            label='Código de acesso antecipado'
            onChange={(event) => setCode(event.currentTarget.value)}
        />
    </Modal>
}