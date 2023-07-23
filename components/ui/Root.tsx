import { cn } from "@/lib/ui";

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

const Root = ({ className, children, ...props }: RootProps) => {
    return (
        <div
            className={cn(
                "flex flex-col gap-1.5 items-start relative w-full min-h-fit",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
Root.displayName = "Root";

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

const Label = ({ className, children, ...props }: LabelProps) => {
    return (
        <label
            className={cn(
                "font-karla font-bold text-sm text-primary-03 select-none pointer-events-none max-w-full",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
};
Label.displayName = "Label";

export { Root, Label };
