import { ComponentProps } from "kix";
import { StrongPairPaige } from "./page/calculate-pairs/strong-pair";
import { Chart } from "./page/chart";

export const chooseRoutes = [
    {
        label: "Chart",
        Component: Chart
    },
    {
        label: "Strong pair",
        Component: StrongPairPaige
    }
] as const
export type StateChooseRouteType = {
    path: string
    value: string
    label: string
}
interface AddPageButtonIProps {
    onAdd: (newRoutes: StateChooseRouteType) => void
}
export const AddPageButton = (args: AddPageButtonIProps) => {
    let open = false;
    const onClose = () => {
        open = false;
    }
    const toggleOpen = () => {
        open = !open;
    }
    const onChoose = (label: string) => {
        const newPage = chooseRoutes.find(el => (el.label === label));
        if (newPage) {
            args.onAdd({ ...newPage, value: label, path: `/${label}/${Date.now()}` });
        }
    }

    return <button onClick={toggleOpen} onBlur={onClose} class="p-10 relative margin-0 border-none pointer z-index-3">Add +
        {open && <div class="absolute top-100 left-0 flex column">
            {chooseRoutes.map(item => {
                return <div class="nowrap hover-button txt-left p-10 pointer" style="background-color: #b7b7b7;"
                    onClick={() => {
                        onChoose(item.label)
                    }}>
                    {item.label}
                </div>
            })}
        </div>}
    </button>
}