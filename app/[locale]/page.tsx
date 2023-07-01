import Link from "next/link";

// Sections
import LandingHeader from "@/components/Landing/Header";
import LandingFooter from "@/components/Landing/Footer";

// Stylesheets
import styles from "styles/Landing.module.css";

// Components
import Note from "@/components/Landing/Note";
import Anchor from "@/components/ui/Button/Anchor";
import Device from "@/components/Landing/Device";

// Icons
import StarIcon from "/public/landing/star.svg";
import PiIcon from "/public/landing/pi.svg";
import EnergyIcon from "/public/landing/energy.svg";
import PaperPlaneIcon from "/public/landing/paper_plane_blur.svg";
import BaskharaIcon from "/public/landing/baskhara.svg";

import Logo from "/public/logo.svg";
import ArrowRightIcon from "@material-symbols/svg-600/rounded/arrow_right_alt.svg";
import PaperPlaneIcon_alt from "/public/landing/paper_plane.svg";
import PathLines from "/public/landing/path_lines.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

// Fonts
import { karla } from "../fonts";

// Internationalization
import { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/hooks";
import { cn } from "@/lib/ui";

export const metadata = {
	title: "estudaí",
	description:
		"Uma plataforma de organização de estudos online que o ajudará a revisar e manter suas matérias em dia. Chega de esquecimentos.",
};

export default async function Landing({
	params: { lang },
}: {
	params: { lang: Locale };
}) {
	const dict = useTranslations();
	const t = dict.landing;

	return (
		<main className={`${styles.holder} ${karla.variable}`}>
			<LandingHeader>
				<Note
					showOnlyInDesktop={true}
					tag={{
						landscape: `${t.early_access_new} v0.1`,
						portrait: "v0.1",
					}}
					description={{
						landscape: t.early_access_landscape,
						portrait: t.early_access_portrait,
					}}
				/>
			</LandingHeader>

			<div className="flex w-full h-screen absolute overflow-hidden pointer-events-none select-none">
				<StarIcon className={styles.star} />
				<PiIcon className={styles.pi} />
				<EnergyIcon className={styles.energy} />
				<PaperPlaneIcon className={styles.paperPlane} />
				<BaskharaIcon className={styles.baskhara} />
				<StarIcon className={styles.star2} />
			</div>

			<div className={styles.container}>
				<Note
					showOnlyInMobile={true}
					tag={{
						landscape: `${t.early_access_new} v0.1`,
						portrait: "v0.1",
					}}
					description={{
						landscape: t.early_access_landscape,
						portrait: t.early_access_portrait,
					}}
				/>
				<div className={styles.title}>
					<h1>{t.title}</h1>
					<p>{t.subtitle}</p>
					<Anchor href={"/register"} className="px-4 py-3 group">
						{t.button}
						<ArrowRightIcon
							className="icon group-hover:translate-x-0.5 transition-transform"
							fontSize={20}
						/>
					</Anchor>
				</div>
				<Device />
			</div>

			<div
				className={`${styles.section_type1} -mt-[25rem] lg:-mt-[41.5rem]`}
			>
				<div className={styles.content}>
					<header>
						<h3>{t.section1.header.title}</h3>
						<h5>{t.section1.header.subtitle}</h5>
					</header>

					<div className="flex items-center flex-col lg:flex-row lg:justify-between w-full gap-25">
						<div className="flex flex-col items-start justify-start flex-1 gap-9 w-full lg:max-w-[35%]">
							<div className="relative">
								<ul className="scrollBarHidden flex flex-row items-center justify-start p-0 gap-2.5 overflow-x-scroll">
									{t.section1.features.map(
										(feature, index) => (
											<Tag key={index} label={feature} />
										)
									)}
								</ul>
								<div className="flex w-96 h-full absolute right-0 top-0 bg-gradient-to-l from-primary-03 to-transparent" />
							</div>
							<p className="font-sans font-medium text-lg text-neutral whitespace-pre-line text-left w-full">
								{formatString(t.section1.description)}
							</p>
							<Call>{formatString(t.section1.call)}</Call>
						</div>
						<div className="flex flex-row items-center justify-center lg:flex-1 relative mt-36 lg:mt-0 lg:h-fit">
							<Section1Card
								icon={EventIcon}
								title="Criar evento"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in turpis sit amet augue ullamcorper egestas."
								className="absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-[65%] lg:translate-x-0 lg:right-0 z-30"
							/>
							<Section1Card
								icon={TestIcon}
								title="Criar avaliação"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in turpis sit amet augue ullamcorper egestas."
								className="absolute -top-12 -translate-y-1/2 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-[25%] -rotate-6 z-20"
							/>
							<Section1Card
								icon={ActivityIcon}
								title="Criar atividade"
								description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in turpis sit amet augue ullamcorper egestas."
								className="absolute -top-24 -translate-y-1/2 right-1/2 translate-x-1/3 lg:translate-x-0 lg:right-[50%] -rotate-6 z-10"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-start justify-start w-full py-[12.5rem] gap-16">
				<div className="flex flex-row items-center justify-between flex-wrap gap-7 px-[var(--wrapper)]">
					<h3 className="font-bold text-4xl text-primary-02 text-left whitespace-pre-line lg:max-w-[40vw]">
						{t.section2.header.title}
					</h3>
					<h5 className="font-medium text-lg text-primary-03 text-right lg:w-1/2">
						{t.section2.header.subtitle}
					</h5>
				</div>
				<div className="flex flex-col items-start justify-start w-full gap-6">
					<h4 className="font-bold text-2xl text-primary-02 text-left pl-[var(--wrapper)]">
						{t.section2.highlights.title}
					</h4>
					<HorizontalScroll className="scrollBarHidden flex flex-row items-center justify-start w-full gap-2.5 overflow-x-scroll px-[var(--wrapper)]">
						{Array.from({ length: 8 }).map((_, index) => (
							<GroupPreview key={index} />
						))}
					</HorizontalScroll>
				</div>
				<div className="px-[var(--wrapper)] w-full">
					<div className="box-border flex flex-row items-center justify-center px-2.5 py-3 border w-full bg-neutral border-light-gray rounded-base">
						<p className="font-medium text-lg text-font-light text-center">
							<Link href={`/register`}>
								<span className="font-bold underline text-primary-02 inline-block mr-2 cursor-pointer">
									{t.section2.call.link}
								</span>
							</Link>
							{t.section2.call.text}
						</p>
					</div>
				</div>
			</div>

			<div className={`${styles.section_type1}`}>
				<div className={styles.content}>
					<header>
						<h3>{t.section3.header.title}</h3>
						<h5>{t.section3.header.subtitle}</h5>
					</header>

					<div className="flex items-center flex-col lg:flex-row lg:justify-between w-full gap-12.5">
						<div className="flex flex-row items-start justify-start gap-2.5 w-full lg:w-fit">
							<Section3File name="lista-de-exercicios.pdf" />
							<Section3File name="crase_e_pontuacao.pdf" />
						</div>
						<div className="flex flex-col items-start justify-start flex-1 gap-9 w-full lg:max-w-[45%]">
							<p className="font-sans font-medium text-lg text-neutral whitespace-pre-line text-left w-full">
								{t.section3.row1.description}
							</p>
							<Call className="-left-[200%]">
								{t.section3.row1.call}
							</Call>
						</div>
					</div>

					<div className="flex items-center flex-col lg:flex-row lg:justify-between w-full gap-12.5">
						<div className="flex flex-col items-start justify-start flex-1 gap-9 w-full lg:max-w-[35%]">
							<p className="font-sans font-medium text-lg text-neutral whitespace-pre-line text-left w-full">
								{t.section3.row2.description}
							</p>
						</div>
						<div className="flex flex-row items-start justify-start gap-2.5 w-full lg:w-fit">
							{/* <LinkAttachment
								className="h-full"
								index={0}
								link="https://www.notion.so/meninocoiso/Revisa-4a28264fd113411fb3544e92165288c3"
							/>
							<LinkAttachment
								className="h-full"
								index={0}
								link="https://theduardomaciel.vercel.app/"
							/>
							<LinkAttachment
								className="h-full"
								index={0}
								link="https://open.spotify.com/user/72adqyozv5b4kkz8l1xsmiroi?si=5e86ac8738b448c0"
							/> */}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-start justify-start w-full px-[var(--wrapper)] py-[12.5rem] gap-12.5 relative overflow-x-clip">
				<div className="flex flex-row items-center justify-between gap-25 grow">
					<div className="flex flex-col items-start justify-start gap-13">
						<header className="flex flex-col items-start justify-start gap-5">
							<h2 className="font-bold font-sans text-5xl text-font-dark text-left leading-tight">
								{t.section4.header.title}
							</h2>
							<h3 className="font-medium text-lg text-font-light text-left">
								{t.section4.header.subtitle}
							</h3>
						</header>
						<Call suppressPattern>
							{formatString(t.section4.header.call)}
						</Call>
						<div className="flex flex-col items-start justify-start gap-5">
							<p className="font-medium text-lg text-font-light text-left whitespace-pre-line">
								{t.section4.content.description.substring(
									0,
									t.section4.content.description.indexOf(`{{`)
								)}
								<Link
									href={`https://twitter.com/appestudai`}
									target="_blank"
								>
									<span className="underline text-primary-02 cursor-pointer">
										{t.section4.content.description.match(
											/\{{(.*?)\}}/
										)![1] ?? ""}
									</span>
								</Link>
								{t.section4.content.description.substring(
									t.section4.content.description.indexOf(
										`}}`
									) + 2,
									t.section4.content.description.length
								)}
							</p>
						</div>

						<Anchor
							href={`https://github.com/theduardomaciel/estudai`}
							/* target="_blank" */
							className="px-8 py-2.5 text-base"
						>
							<GitHubLogoIcon
								fontSize={`1.8rem`}
								color="var(--neutral)"
							/>
							{t.section4.content.button}
						</Anchor>
					</div>
					<div className="hidden lg:block clear-both w-full flex-1 min-w-[30vw] items-center justify-center relative h-full">
						<PaperPlaneIcon_alt
							className={`${styles.paper_plane} mr-0`}
						/>
					</div>
				</div>
				<PathLines className="absolute bottom-[5%] scale-125 right-0 z-50 pointer-events-none select-none" />
			</div>

			<div className="flex flex-col items-start justify-start w-full px-[var(--wrapper)] pb-[12.5rem] gap-12.5 relative">
				<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-9 py-12 lg:px-19 lg:py-13 gap-20 bg-primary-03 rounded-3xl w-full overflow-hidden relative">
					<div className="flex flex-col items-start justify-start gap-7 w-full lg:w-1/2 z-50">
						<h2 className="font-bold text-5xl text-left leading-none text-neutral">
							{t.section5.title}
						</h2>
						<p className="font-medium text-lg text-left text-neutral whitespace-pre-line">
							{t.section5.description}
						</p>
						<div className="flex flex-row items-center justify-start gap-2.5 w-fit">
							<Anchor
								href={`/register`}
								preset="neutral"
								className="px-6 py-2 font-karla font-bold text-primary-03 whitespace-nowrap gap-4 text-lg group"
							>
								{t.register}
								<ArrowRightIcon
									className="icon group-hover:translate-x-0.5 transition-transform"
									fontSize={"2.4rem"}
									color="var(--primary-03)"
								/>
							</Anchor>
							{Array.from({ length: 25 }).map((_, index) => (
								<ArrowRightIcon
									key={index}
									className="icon"
									style={{
										opacity: 1 / (index + 1),
									}}
									fontSize={"2.4rem"}
									color="var(--neutral)"
								/>
							))}
						</div>
					</div>
					<div className="flex items-center justify-center p-16 w-full flex-1 z-50">
						<Logo width={"17.5rem"} fill="var(--neutral)" />
					</div>
					<Pattern
						linesAmount={5}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[40%] rotate-90 z-30 gap-2.5 opacity-5"
						lineClassName="text-4xl"
					/>
				</div>
			</div>

			<LandingFooter />
		</main>
	);
}

// Format string and put 'estudaí' words in a span with custom styles
// Check for text between '**' and '**' and put it in a span with custom styles (bold)

const formatString = (str: string) => {
	const words = str.split(" ");
	const formattedWords = words.map((word, index) => {
		if (word === "estudaí") {
			return (
				<span key={index} className={`${styles.estudai}`}>
					{word}
				</span>
			);
		}

		if (word.startsWith("**") && word.endsWith("**")) {
			return (
				<span key={index} className={`font-bold`}>
					{word.replace(/\*/g, "").replaceAll("_", " ")}
				</span>
			);
		}

		return <span key={index}>{word}</span>;
	});

	return (
		<>
			{formattedWords.map((word, index) => (
				<span key={index}>{word} </span>
			))}
		</>
	);
};

function Tag({ label }: { label: string }) {
	return (
		<div className="flex flex-row items-center justify-center px-2.5 py-0.5 bg-primary-04 rounded-3xl min-w-fit">
			<p className="font-karla font-medium text-lg text-neutral whitespace-nowrap">
				{label}
			</p>
		</div>
	);
}

function PatternLine({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex flex-row items-center justify-center w-screen gap-3 select-none",
				className
			)}
		>
			{Array.from({ length: 25 }).map((_, index) => (
				<p
					className={cn(
						"font-serif font-black text-lg text-neutral",
						className
					)}
					style={{
						transform: `scaleX(${index % 2 === 0 ? 1 : -1})`,
					}}
					aria-hidden="true"
				>
					estudaí
				</p>
			))}
		</div>
	);
}

function Pattern({
	linesAmount,
	className,
	lineClassName,
}: {
	linesAmount?: number;
	className?: string;
	lineClassName?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-0 opacity-10 -z-10",
				className
			)}
		>
			{Array.from({ length: linesAmount || 3 }).map((_, index) => (
				<PatternLine className={lineClassName} />
			))}
		</div>
	);
}

interface CallProps {
	children: React.ReactNode;
	className?: string;
	suppressPattern?: boolean;
}

function Call({ children, className, suppressPattern }: CallProps) {
	return (
		<div className="flex flex-row items-center justify-center px-6 py-2.5 bg-primary-02 rounded-base relative">
			<p className="font-medium text-base text-neutral text-center w-full">
				{children}
			</p>
			{!suppressPattern && (
				<Pattern
					className={cn(
						"absolute top-1/2 -translate-y-1/2 left-0",
						className
					)}
				/>
			)}
		</div>
	);
}

// Icons
import ActivityIcon from "@material-symbols/svg-600/rounded/book.svg";
import TestIcon from "@material-symbols/svg-600/rounded/hotel_class.svg";
import EventIcon from "@material-symbols/svg-600/rounded/local_activity.svg";
import React from "react";
//import LinkAttachment from "@/components/AttachmentLoader/Link";

interface Section1CardProps {
	icon: React.FC<React.SVGProps<HTMLOrSVGElement>>;
	title: string;
	description: string;
	className?: string;
}

function Section1Card({
	icon: Icon,
	title,
	description,
	className,
}: Section1CardProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-start justify-start bg-neutral border-2 border-primary-02 p-4 gap-3 z-30 w-[25rem] rounded-xl",
				className
			)}
		>
			<div className="flex items-center justify-center p-4 rounded-base bg-background-01">
				<Icon
					className="icon"
					fontSize={"2.4rem"}
					color="var(--primary-03)"
				/>
			</div>
			<div className="flex flex-col items-start justify-start gap-1">
				<h6 className="font-semibold text-sm text-left text-font-dark-02">
					{title}
				</h6>
				<p className="font-medium text-xs text-left text-font-light">
					{description}
				</p>
			</div>
		</div>
	);
}

interface Section3FileProps {
	fileInfo: React.MutableRefObject<File>;
}

import PDFFileIcon from "/public/icons/attachment/pdf.svg";
import fileStyles from "@/components/AttachmentLoader/File/styles.module.css";
import GroupPreview from "@/components/Previews/GroupPreview";
import HorizontalScroll from "@/components/HorizontalScroll";

function Section3File({ name }: { name: string }) {
	return (
		<li className={`${fileStyles.attachment}`}>
			<div className={fileStyles.header}>
				<PDFFileIcon className={fileStyles.icon} />
			</div>
			<p className={fileStyles.fileName}>{name}</p>
		</li>
	);
}
