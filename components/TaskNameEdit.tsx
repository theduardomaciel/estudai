"use client";

export default function TaskNameEdit() {
    return (
        <input
            placeholder="Nova atividade"
            defaultValue={"Nova atividade"}
            onFocus={(e) => e.target.select()}
            onBlur={(e) =>
                e.target.value || (e.target.value = "Nova atividade")
            }
            maxLength={50}
            className="bg-transparent text-2xl placeholder:text-primary-02 text-primary-02 w-fit"
        />
    );
}
