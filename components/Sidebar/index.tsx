"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Stylesheets
import styles from "./sidebar.module.css";

// Components
import Button from "@/components/ui/Button";

// Icons
import HomeIcon from "@material-symbols/svg-600/rounded/space_dashboard.svg";
import HomeIconFilled from "@material-symbols/svg-600/rounded/space_dashboard-fill.svg";

import GroupsIcon from "@material-symbols/svg-600/rounded/group.svg";
import GroupsIconFilled from "@material-symbols/svg-600/rounded/group-fill.svg";

import MarketplaceIcon from "@material-symbols/svg-600/rounded/local_library.svg";
import MarketplaceIconFilled from "@material-symbols/svg-600/rounded/local_library-fill.svg";

import ClubIcon from "/public/icons/club_outlined.svg";
import ClubIconFilled from "/public/icons/club.svg";

import SettingsIcon from "@material-symbols/svg-600/rounded/settings.svg";
import SettingsIconFilled from "@material-symbols/svg-600/rounded/settings-fill.svg";

const SECTIONS = [
    {
        href: "home",
        aliases: ["new"],
        icon: HomeIcon,
        iconFilled: HomeIconFilled,
    },
    {
        href: "groups",
        icon: GroupsIcon,
        iconFilled: GroupsIconFilled,
    },
    {
        href: "marketplace",
        icon: MarketplaceIcon,
        iconFilled: MarketplaceIconFilled,
    },
    /* {
		href: "club",
		icon: ClubIcon,
		iconFilled: ClubIconFilled,
	}, */
    {
        href: "settings",
        icon: SettingsIcon,
        iconFilled: SettingsIconFilled,
    },
];

interface Props {
    isAuthenticated?: boolean;
}

const BLOCK_PADDING = 5;
const GAP = 5;
const ICON_SIZE = 3.2;

export default function Sidebar({ isAuthenticated }: Props) {
    const pathname = usePathname();
    const purePathname = pathname.split("/")[2]; // We use index 2 to match locale on pathname

    const currentActive = SECTIONS.findIndex(
        (section) =>
            section.href === purePathname ||
            section.aliases?.includes(purePathname)
    );

    return (
        <>
            <nav
                className={`${styles.container} pulse ${
                    !isAuthenticated ? styles.unauthenticated : ""
                }`}
                style={{
                    paddingTop: isAuthenticated ? `${BLOCK_PADDING}rem` : 0,
                    paddingBottom: isAuthenticated ? `${BLOCK_PADDING}rem` : 0,
                    gap: isAuthenticated ? `${GAP}rem` : 0,
                }}
            >
                <div className={styles.authenticationWarning}>
                    <h6>Organize your study flow.</h6>
                    <div className={styles.row}>
                        <p>
                            Create an account at <span>estudaí</span> to take
                            advantage of all the functions of the platform.
                        </p>
                    </div>
                    <div className={styles.row}>
                        <Link href={`/login`}>
                            <Button
                                title={"Sign in"}
                                style={{
                                    border: "1px solid var(--neutral)",
                                    borderRadius: "5rem",
                                    padding: "0.75rem 2.25rem",
                                    width: "100%",
                                }}
                            />
                        </Link>
                        <Link href={`/register`}>
                            <Button
                                title={"Sign up"}
                                style={{
                                    border: "1px solid var(--neutral)",
                                    borderRadius: "5rem",
                                    padding: "0.75rem 2.25rem",
                                    width: "100%",
                                    backgroundColor: "var(--neutral)",
                                    color: "var(--primary-02",
                                }}
                            />
                        </Link>
                    </div>
                </div>

                {isAuthenticated && (
                    <>
                        {SECTIONS.map((section, index) => {
                            return (
                                <Link
                                    href={`/${section.href}`}
                                    id={section.href}
                                    className={styles[section.href]}
                                    key={index}
                                >
                                    {currentActive === index ? (
                                        <section.iconFilled
                                            fontSize={ICON_SIZE * 10}
                                            color="var(--neutral)"
                                            className={"icon click"}
                                        />
                                    ) : (
                                        <section.icon
                                            fontSize={ICON_SIZE * 10}
                                            color="var(--neutral)"
                                            className={"icon click"}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </>
                )}

                <div
                    id="sidebarSectionBar"
                    className={styles.sectionBar}
                    style={{
                        top:
                            currentActive !== SECTIONS.length - 1
                                ? `${
                                      BLOCK_PADDING +
                                      (GAP + ICON_SIZE) * currentActive
                                  }rem`
                                : `calc(100% - ${
                                      BLOCK_PADDING + ICON_SIZE
                                  }rem)`,
                    }}
                />
            </nav>
        </>
    );
}
