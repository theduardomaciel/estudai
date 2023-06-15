import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';

import Modal from '..';
import { EmptyTasksMessage } from '../../../../old_pages/home';
import Input from '../../Input';
import { TranslateText } from '../../Translate';

import styles from "../preset.module.css";

interface Icon {
    categories: Array<string>;
    codepoint: number;
    name: string;
    popularity: number;
    sizes_px: Array<number>;
    tags: Array<string>;
    unsupported_families: []
    version: number;
}

const iconsData = require("/public/data/icons.json") as Array<Icon>;

const bannedIcons = [
    "emoji_emotions",
    "troubleshoot",
    "signal_cellular_connected_no_internet_4_bar",
    "play_circle_outlined",
    "pix",
    "person_add_alt_1",
    "catching_pokemon",
    "delivery_dining",
    "discount",
    "emoji_events",
    "fitbit",
    "fire_hydrant_alt",
    "highlight_alt",
    "miscellaneous_services",
    "moped",
    "motion_photos_on",
    "no_cell",
    "panorama_horizontal_select",
    "panorama_photosphere_select",
    "panorama_vertical_select",
    "panorama_wide_angle_select",
    "person_remove_alt_1",
    "delivery_dining",
    "discount",
    "play_circle_outline",
    "signal_wifi_statusbar_connected_no_internet_4",
    "play_circle_filled",
    'contact_emergency',
    'push_pin',
    'person_2',
    'person_3',
    'person_4',
    'shape_line',
    'unfold_less_double',
    'woman_2',
    'auto_fix_high',
    'auto_fix_normal',
    'auto_fix_off',
    'blind',
    'contact_emergency',
    'diversity_1',
    'diversity_2',
    'diversity_3',
    'fluorescent',
    'fmd_good',
    'video_chat',
    "add_home",
    "add_home_work"
]

// https://fonts.google.com/metadata/icons ou https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints

const filteredIcons = iconsData
    .filter((icon, index) => bannedIcons.includes(icon.name) ? false : true && !icon.name.includes("0") && !icon.name.includes("1") && !icon.name.includes("2") && !icon.name.includes("3") && !icon.name.includes("4") && !icon.name.includes("5") && !icon.name.includes("6") && !icon.name.includes("7") && !icon.name.includes("8") && !icon.name.includes("9")/* !icon.name.match(/^\d/) */)
// removemos os ícones banidos e os ícones que começam com número

export default function IconPickerModalPreset(setSelectedIcon: Dispatch<SetStateAction<string>>) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [search, setSearch] = useState('');

    // Dividimos a filtragem em duas etapas para que filtragens desnecessárias não ocorram a cada re-renderização
    const icons = filteredIcons
        .filter((icon, i) => search.length > 0 ? icon.name.includes(search) || icon.tags.includes(search) : true)

    function onSelect(iconName: string) {
        setSelectedIcon(iconName)
        setModalVisible(false)
        setSearch("")
    }

    return {
        IconPickerModal: <Modal
            isVisible={isModalVisible}
            toggleVisibility={() => setModalVisible(!isModalVisible)}
            color={`var(--primary-02)`}
            icon={'donut_large'}
            suppressReturnButton
            style={{ minWidth: "80vw" }}
            title={TranslateText("Select icon")}
            iconProps={{ size: "2.8rem", builtWithTitle: true, position: "flex-start" }}
        >
            <Input
                icon='search'
                placeholder={TranslateText("Search for an icon")}
                onChange={(event) => setSearch(event.currentTarget.value.replaceAll(' ', '_').toLowerCase())}
            />
            <ul className={`${styles.iconsContainer} ${icons.length < 7 ? styles.empty : ""}`}>
                {
                    icons.length > 0 ?
                        icons.map((icon, index) => {
                            return <li key={index} className={styles.icon} onClick={() => onSelect(icon.name)}>
                                <span className={`material-symbols-rounded static`}>
                                    {icon.name}
                                </span>
                                {/* <p>{icon.name}</p> */}
                                <p>{icon.name.replaceAll("_", " ")}</p>
                            </li>
                        })
                        :
                        <EmptyTasksMessage removeMargin description={TranslateText("We couldn't find icons that match your search.")} />
                }
            </ul>
        </Modal>,
        setIconPickerModalVisible: setModalVisible
    }
}