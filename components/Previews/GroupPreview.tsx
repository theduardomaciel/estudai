import Image from "next/image";

// Icons
import VerifiedIcon from "@material-symbols/svg-600/rounded/new_releases.svg";
import PersonIcon from "@material-symbols/svg-600/rounded/person-fill.svg";
import GenericIcon from "@material-symbols/svg-600/rounded/motion_mode.svg";

export default function GroupPreview() {
	return (
		<li className="flex flex-col items-center justify-start relative p-0 border border-primary-03 rounded-lg shadow-md overflow-hidden min-w-[28rem]">
			<div className="flex flex-col min-h-[15rem]"></div>
			<div className="flex items-center justify-center p-4 bg-primary-02 rounded-base absolute top-[12.5rem] left-[2rem]">
				<GenericIcon
					className="icon"
					fontSize={"2.4rem"}
					color="var(--neutral)"
				/>
			</div>
			<div className="flex flex-col items-center justify-start px-6 pt-8 pb-5 bg-primary-02 gap-4">
				<div className="flex flex-col items-start justify-start gap-2.5">
					<header className="flex flex-row items-center justify-start gap-2">
						<h6 className="font-raleway font-extrabold text-left text-neutral text-lg leading-tight">
							Cálculo Básico
						</h6>
						<VerifiedIcon
							className="icon min-w-[1.25rem]"
							fontSize={"1.25rem"}
							color="var(--neutral)"
						/>
					</header>
					<p className="font-normal text-sm text-neutral text-left">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Curabitur sollicitudin metus at elit pharetra dapibus.
					</p>
				</div>
				<footer className="flex flex-row items-center justify-between w-full">
					<ul className="flex flex-row items-center justify-start">
						{Array(5)
							.fill(0)
							.map((_, index) => (
								<Image
									width={20}
									height={20}
									className="rounded-full"
									style={{
										marginLeft: index === 0 ? 0 : -2.5,
									}}
									src="https://github.com/theduardomaciel.png"
									alt="Profile picture"
								/>
							))}
					</ul>
					<div className="flex flex-row items-center justify-center gap-1">
						<PersonIcon
							className="icon min-w-[1.5rem]"
							fontSize={"1.5rem"}
							color="var(--neutral)"
						/>
						<p className="text-neutral whitespace-nowrap text-[10px] font-light">
							55 participantes
						</p>
					</div>
				</footer>
			</div>
		</li>
	);
}
