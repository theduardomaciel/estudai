"use client";

// Components
import { Input } from "@/components/ui/Input";
import { Label, Root } from "@/components/ui/Root";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Switch } from "@/components/ui/Switch";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/Collapsible";

export default function NewActivitySettings() {
    return (
        <div className="flex flex-col items-center justify-start gap-2 flex-1 h-full w-full">
            <Root>
                <Label>Privacidade</Label>
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
            </Root>
            <Accordion type="single" collapsible className="flex w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-bold text-sm text-primary-02">
                        Configurações Adicionais
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col items-center justify-start gap-4 flex-1 h-full w-full">
                        <Root>
                            <Label>Pontuação máxima</Label>
                            <Input
                                numberControl
                                maxLength={4}
                                fixedUnit="pontos"
                                placeholder="[sem pontuação]"
                            />
                        </Root>
                        <Root>
                            <Label>Como a atividade deve ser feita?</Label>
                            <RadioGroup defaultValue="INDIVIDUAL">
                                <RadioGroupItem
                                    id="INDIVIDUAL"
                                    value="INDIVIDUAL"
                                >
                                    individual
                                </RadioGroupItem>
                                <RadioGroupItem id="GROUP" value="GROUP">
                                    em grupo
                                </RadioGroupItem>
                            </RadioGroup>
                        </Root>
                        <Root className="flex-row justify-between">
                            <Label>A atividade é obrigatória?</Label>
                            <Switch />
                        </Root>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
