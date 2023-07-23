export default function Teste() {
    return (
        <div className="w-[571px] h-[451px] p-[50px] bg-gray-100 rounded-[15px] flex-col justify-start items-center gap-[35px] inline-flex">
            <div className="self-stretch h-[140px] flex-col justify-start items-center gap-[25px] flex">
                <div className="p-5 bg-violet-700 rounded-[5px] justify-center items-center inline-flex">
                    <div className="w-9 h-9 relative">
                        <div className="w-9 h-9 left-0 top-0 absolute bg-zinc-300" />
                    </div>
                </div>
                <div className="text-violet-700 text-[32px] font-bold tracking-wider">
                    Sair da plataforma
                </div>
            </div>
            <div className="self-stretch text-violet-700 text-base font-medium tracking-wide">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                hendrerit velit at volutpat laoreet.
            </div>
            <div className="self-stretch h-[103px] flex-col justify-start items-start gap-[15px] flex">
                <div className="self-stretch px-[15px] py-2.5 bg-white rounded-[5px] border border-zinc-300 justify-center items-center gap-2.5 inline-flex">
                    <div className="w-6 h-6 relative" />
                    <div className="text-center text-neutral-500 text-sm font-semibold">
                        CANCELAR
                    </div>
                </div>
                <div className="self-stretch px-[15px] py-2.5 bg-violet-700 rounded-[5px] justify-center items-center gap-2.5 inline-flex">
                    <div className="w-6 h-6 relative">
                        <div className="w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
                    </div>
                    <div className="text-center text-white text-sm font-semibold">
                        DESLOGAR
                    </div>
                </div>
            </div>
        </div>
    );
}
