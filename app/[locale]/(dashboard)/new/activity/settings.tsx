"use client";

import { Input } from "@/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

export default function NewActivitySettings() {
    return (
        <div className="flex flex-1 h-full w-full">
            <Input.Root>
                <Input.Label>Pontuação máxima</Input.Label>
                <Input
                    numberControl
                    maxLength={4}
                    fixedUnit="pontos"
                    placeholder="[nenhuma pontuação máxima]"
                />
                <Select.Root>
                    <Select.Label>Privacidade</Select.Label>
                    <Select defaultValue="PRIVATE">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a privacidade" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="PRIVATE">
                                Somente você pode acessar
                            </SelectItem>
                            <SelectItem value="PUBLIC">
                                Qualquer um com o link pode acessar
                            </SelectItem>
                            <SelectItem value="PUBLIC_ATTACHMENTS">
                                Qualquer um pode inserir anexos
                            </SelectItem>
                            <SelectItem value="PUBLIC_FULL">
                                Qualquer um pode editar e inserir anexos
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </Select.Root>
            </Input.Root>
        </div>
    );
}
