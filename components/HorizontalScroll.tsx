"use client";

import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import { useEffect, useId } from "react";

interface Props {
	children: React.ReactNode;
	className?: string;
}

export default function HorizontalScroll({ children, className }: Props) {
	const id = useId();
	const { setHorizontalScroll } = useHorizontalScroll();

	useEffect(() => {
		// setHorizontalScroll(id);

		const slider = document.getElementById(id);
		let isDown = false;
		let startX = 0;
		let scrollLeft = 0;

		if (!slider) return;

		const mouseDown = (e: MouseEvent) => {
			isDown = true;
			slider.classList.add("active");
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
		};

		slider.addEventListener("mousedown", mouseDown);

		const mouseLeave = () => {
			isDown = false;
			slider.classList.remove("active");
		};

		slider.addEventListener("mouseleave", mouseLeave);

		const mouseUp = () => {
			isDown = false;
			slider.classList.remove("active");
		};

		slider.addEventListener("mouseup", mouseUp);

		const mouseMove = (e: MouseEvent) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1; //scroll-fast
			slider.scrollLeft = scrollLeft - walk;
			console.log(walk);
		};

		slider.addEventListener("mousemove", mouseMove);

		return () => {
			slider.removeEventListener("mousedown", mouseDown);
			slider.removeEventListener("mouseleave", mouseLeave);
			slider.removeEventListener("mouseup", mouseUp);
			slider.removeEventListener("mousemove", mouseMove);
		};
	});

	return (
		<ul className={`${className} grabbable`} id={id}>
			{children}
		</ul>
	);
}
