interface Props {
    style?: React.CSSProperties;
    orientation?: 'horizontal' | 'vertical';
}

export default function Separator({ orientation = "vertical", style }: Props) {
    return (
        <div
            style={{
                ...{
                    backgroundColor: "var(--primary-04)",
                    borderRadius: 5,
                    minHeight: orientation === "vertical" ? 12.5 : 1,
                    height: orientation === "vertical" ? "100%" : 1,
                    width: orientation === "vertical" ? 1 : "100%",
                },
                ...style,
            }}
        />
    );
}