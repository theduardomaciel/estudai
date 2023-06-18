"use client";

import { AxiosError } from "axios";
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

// Drag 'n drop
import { useMultiDrop } from "react-dnd-multi-backend";

// API
import { api } from "@/lib/api";

// Hooks
import useScreenSize from "@/hooks/useScreenSize";

// Components
import { Tag, TagProps } from "../Tag";
import Spinner from "@/components/Spinner";

// Types
import type { Attachment } from "@prisma/client";

// Stylesheets
import styles from "./styles.module.css";

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";
import ImgAttachment from "/public/icons/attachment/img.svg";

function divideFileInChunks(fileData: File) {
	const fileChunks = [];
	const maxBlob = 256 * 10 * 1024; // each chunk size (2.5MB)
	let offset = 0;
	while (offset < fileData.size) {
		const chunkSize = Math.min(maxBlob, fileData.size - offset);
		fileChunks.push({
			blob: fileData.slice(offset, offset + chunkSize),
			start: offset,
			end: offset + chunkSize,
		});
		offset += chunkSize;
	}
	return fileChunks;
}

async function uploadFile(
	fileData: File,
	setGoogleAuthentication: Dispatch<SetStateAction<boolean>>,
	setProgress: Dispatch<SetStateAction<number>>
) {
	const meta = {
		name: fileData.name,
		mimeType: fileData.type,
		/* parents: ['appDataFolder'], */
		copyRequiresWriterPermission: false,
	};

	const fileChunks = divideFileInChunks(fileData); // divide the file into chunks

	const percentageIncrement = 100 / fileChunks.length;

	// Caso o arquivo seja pequeno, iniciamos um carregamento falso
	if (fileChunks.length < 3) {
		setProgress(99.9);
	}

	async function uploadChunks(googleSessionUrl: string, length: string) {
		for (let i = 0; i < fileChunks.length; i += 1) {
			const formData = new FormData();

			formData.append("blob", fileChunks[i].blob /* , 'blobChunk' */);
			formData.append("start", fileChunks[i].start.toString());
			formData.append("end", fileChunks[i].end.toString());
			formData.append("sessionUrl", googleSessionUrl);
			formData.append("length", length);

			console.log("Enviando chunk...", formData);

			const chunkUpload = await api.post(
				`/upload/sendChunksToDrive`,
				formData,
				{
					headers: {
						"Content-type": "multipart/form-data; boundary=XXX",
					},
				}
			);

			if (fileChunks.length > 2) {
				setProgress(percentageIncrement * i);
			}

			if (chunkUpload.status === 200) {
				console.log(`${i + 1} Chunk Uploaded of ${fileChunks.length}`);
			} else if (chunkUpload.status === 201) {
				console.log("Upload concluído.");
				return chunkUpload.data;
			}
		}
	}

	try {
		const response = await api.post(
			`/upload/getGoogleSessionUrl`,
			JSON.stringify({ meta }),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		console.log("Google Session Data URL: ", response.data);
		if (response.data) {
			const result = await uploadChunks(
				response.data,
				fileData.size.toString()
			);
			console.warn(result, "Arquivo enviado para o Drive com sucesso!");
			return result;
		}
	} catch (err: any) {
		const error = err as AxiosError;
		console.log(error);
		if (error.response?.status === 401) {
			setGoogleAuthentication(false);
			return false;
		} else {
			return false;
			/* return "server_error" */
		}
	}
}

type Props = React.LiHTMLAttributes<HTMLLIElement> & {
	attachmentIndex: number;
	attachments: Attachment[];
	setAttachments: Dispatch<SetStateAction<Attachment[]>>;
	/* attachments: MutableRefObject<Attachment[]>; */
};

export default function File({
	attachmentIndex,
	attachments,
	setAttachments,
	...rest
}: Props) {
	const [
		[dropProps],
		{
			html5: [html5DropProps, html5Drop],
			touch: [touchDropProps, touchDrop],
		},
	] = useMultiDrop({
		accept: "card",
		drop: (item: TagProps) => {
			const alreadyHasTag =
				attachments[attachmentIndex].tags.filter((value, index) => {
					return value === item.tagId;
				}).length > 0;
			console.log(alreadyHasTag);
			if (!alreadyHasTag) {
				console.log(item);
				let array = [...attachments];
				const oldTags = array[attachmentIndex].tags;

				array[attachmentIndex].tags = oldTags.concat(item.tagId);

				setAttachments(array);
				console.log("Tag adicionada com sucesso!");
			}
		},
		collect: (monitor) => {
			return {
				hoverObject: monitor.getItem(),
				isActive: monitor.canDrop() && monitor.isOver(),
			};
		},
	});

	const { isScreenWide } = useScreenSize();

	const tagObject = html5DropProps.hoverObject || touchDropProps.hoverObject;
	const isHovered = html5DropProps.isActive || touchDropProps.isActive;

	const onTagClick = (
		event: React.MouseEvent<HTMLLIElement, MouseEvent>,
		tagIndex: number
	) => {
		let array = [...attachments];
		array[attachmentIndex].tags.splice(tagIndex, 1);
		setAttachments(array);

		console.log("Tag removida com sucesso!");
	};

	const { setGoogleAuthentication, setUploading } = {
		setGoogleAuthentication: true,
		setUploading: true,
	};
	const [progress, setProgress] = useState(0);

	const fileInfo = useRef(attachments[attachmentIndex].fileId); // precisa ser fixo pois será trocado pelo id do objeto após o envio para o Google Drive
	const tags = attachments[attachmentIndex].tags;

	async function deleteFile() {
		const fileId = attachments[attachmentIndex].fileId;
		if (typeof fileId === "string") {
			setProgress(-5);
			const deleteResponse = await api.delete(`/upload/${fileId}`);

			if (deleteResponse.status === 200) {
				let array = [...attachments];
				array.splice(attachmentIndex, 1);
				setAttachments(array);
				console.log(`Anexo ${attachmentIndex} removido com sucesso.`);
			} else {
				console.log("Não foi possível deletar o arquivo.");
				setProgress(-2);
			}
		} else {
			console.log(
				"O arquivo ainda não foi enviado, por isso, é impossível excluí-lo."
			);
		}
	}

	const calledUpload = useRef(false);
	useEffect(() => {
		async function upload() {
			// setUploading(true);

			const uploadedFile = await uploadFile(
				fileInfo.current,
				setGoogleAuthentication,
				setProgress
			);
			if (uploadedFile) {
				let array = [...attachments];
				array[attachmentIndex].fileId = uploadedFile.id;
				array[attachmentIndex].downloadLink = uploadedFile.downloadLink;
				array[attachmentIndex].viewLink = uploadedFile.viewLink;

				setAttachments(array);
				console.log(
					"Id do arquivo alterado nos attachments com sucesso!"
				);

				setProgress(100);
			} else {
				setProgress(-1);
			}
			setUploading(false);
		}
		if (calledUpload.current === false) {
			calledUpload.current = true;
			console.log("Enviando");
			upload();
		}
	}, []);

	return (
		<li
			key={attachmentIndex}
			className={`${styles.attachment} ${
				isHovered ? styles.hovered : ""
			}`}
			ref={isScreenWide ? html5Drop : touchDrop}
		>
			<div className={styles.header}>
				{fileInfo.current.type === "application/pdf" ? (
					<PDFAttachment className={styles.icon} />
				) : fileInfo.current.type === "image/png" ||
				  fileInfo.current.type === "image/jpg" ||
				  fileInfo.current.type === "image/jpeg" ? (
					<ImgAttachment className={styles.icon} />
				) : (
					<DocAttachment className={styles.icon} />
				)}
				{progress === -5 ? (
					<Spinner color="var(--primary-02)" />
				) : (
					<span
						className={`material-icons-rounded ${styles.close}`}
						onClick={deleteFile}
					>
						close
					</span>
				)}
			</div>
			<p className={styles.fileName}>{fileInfo.current.name}</p>
			{progress >= 0 && progress !== 100 ? (
				<div
					className={`${styles.progressBar} ${
						progress === -3 ? styles.fakeLoading : ""
					}`}
				>
					<div style={{ width: `${progress}%` }} />
					<div />
				</div>
			) : progress === 100 ? (
				<p
					className={styles.fileName}
					style={{ color: "var(--primary-04)" }}
				>
					arquivo enviado
				</p>
			) : progress === -5 ? (
				<p
					className={styles.fileName}
					style={{ color: "var(--red-01)" }}
				>
					excluindo arquivo...
				</p>
			) : progress === -2 ? (
				<p
					className={styles.fileName}
					style={{ color: "var(--red-01)" }}
				>
					erro ao deletar
				</p>
			) : (
				<p
					className={styles.fileName}
					style={{ color: "var(--red-01)" }}
				>
					erro no upload
				</p>
			)}
			<div className={styles.classes}>
				<ul key={"tagsList"}>
					{tags.length > 0 &&
						tags.map((tag, tagIndex) => {
							//console.log(tag, attachments[index].tags)
							return (
								<Tag
									key={tagIndex}
									tagId={tag}
									index={tagIndex}
									style={{ cursor: "pointer" }}
									tagType={"placed_card"}
									onClick={(event) =>
										onTagClick(event, tagIndex)
									}
								/>
							);
						})}
					{isHovered && (
						<Tag
							index={"hover_preview_tag"}
							tagId={tagObject.tagId}
							style={{ opacity: 0.25 }}
						/>
					)}
				</ul>
			</div>
			{/* <style jsx>{`
                .${styles.progressBar} div:nth-child(1) {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                
                    width: 0%;
                    height: 100%;
                
                    transition: 0.35s;
                
                    border-radius: 2.5rem;
                    background-color: var(--primary-03);
                
                    background-image: repeating-linear-gradient(45deg,
                            transparent,
                            transparent ${barRef.current ? barRef.current.offsetWidth / 11.5 : 15}px,
                            var(--primary-04) ${barRef.current ? barRef.current.offsetWidth / 11.5 : 15}px,
                            var(--primary-04) ${barRef.current ? barRef.current.offsetWidth / 6 : 15}px);
                
                    animation: slide 5s linear infinite;
                    will-change: background-position;
                }
                
                @keyframes slide {
                    from {
                        background-position-x: 0;
                    }
                
                    to {
                        background-position-x: ${barRef.current ? barRef.current.offsetWidth * 3 : 300}px;
                    }
                }
            `}</style> */}
		</li>
	);
}
