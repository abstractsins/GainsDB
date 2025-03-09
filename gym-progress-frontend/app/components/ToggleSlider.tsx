import styles from "./ToggleSlider.module.css";

interface Props {
    disabled: boolean;
    defaultColor: string | undefined;
    selectionColor: string | undefined;
    defaultSetting: () => void;
    selectionSetting: () => void;
}


export default function ToggleSlider({ disabled, defaultColor, selectionColor, defaultSetting, selectionSetting }: Props) {

    if (!defaultColor) {
        defaultColor = 'rgb(10, 10, 10)';
    }

    if (!selectionColor) {
        selectionColor = 'rgb(216, 50, 238)';
    }

    // styles['toggle-button']['toggle-checkbox:checked + &'] 

    return (
        <div className="toggle-slider">
            <div className={styles['toggle-wrapper']}>
                <input disabled={disabled} className={styles['toggle-checkbox']} type="checkbox" />
                <div className={styles['toggle-container']}>
                    <div className={styles['toggle-button']}>
                        <div className={styles['toggle-button-circles-container']}>
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className={styles['toggle-button-circle']}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}