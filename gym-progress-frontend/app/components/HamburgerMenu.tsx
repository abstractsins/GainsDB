interface Props {
    clickHandler: () => void;
}

export default function HamburgerMenu({ clickHandler }: Props) {
    return (
        <div className="hamburger-container" onClick={clickHandler}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
        </div>
    );
}