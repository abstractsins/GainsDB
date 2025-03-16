import { useEffect, useState, useRef } from "react";
import { MdOutlineSort } from "react-icons/md";


interface ExerciseLegendProps {
    activeCategoryOverride: string | null;
    onCategorySelect: (category: string) => void;
    onResetExpansion: () => void;
}

export default function ExercisesLegend({ activeCategoryOverride, onCategorySelect, onResetExpansion }: ExerciseLegendProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isLegendVisible, setLegendVisible] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const legendRef = useRef<HTMLDivElement>(null);

    const categories = ["Upper Body", "Lower Body", "Core", "Cardio", "Other", "All"];

    useEffect(() => {
        if (activeCategoryOverride === null) {
            setActiveCategory(null);
        }
    }, [activeCategoryOverride]);

    const normalizedCategory = (category: string) => category.replace(/\s/g, '-').toLowerCase();

    const handleClick = (category: string) => {
        const normalizedCat = normalizedCategory(category);
        setActiveCategory(prev => (prev === normalizedCat ? null : normalizedCat));
        console.log(normalizedCat);
        onCategorySelect(normalizedCat);
        document.querySelectorAll(".exercise-card.active").forEach((el) => {
            el.classList.remove("active");
        });
        onResetExpansion();
        setLegendVisible(false);
        if (isLegendVisible) setLegendVisible(false);
    };

    const sortMenu = () => {
        setLegendVisible(prev => prev === true ? false : true);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (legendRef.current && !legendRef.current.contains(event.target as Node)) {
                setLegendVisible(false);
            }
        }

        // Add event listener when menu is open
        if (isLegendVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLegendVisible]);

    return (
        <div className="exercises-legend">
            {isMobile
                ? (
                    <div className="mobile-legend">
                        <label className="sort" onClick={sortMenu}>
                            Sort by Category
                            <MdOutlineSort className="m-2 text-[18pt]" />
                        </label>
                        <input onClick={() => handleClick('all')} disabled={!activeCategory} className={`${activeCategory && activeCategory !== 'all' ? '' : 'inactive'} clear-button`} type="button" value="Clear" />
                        <div
                            className={`${isLegendVisible ? 'active' : ''} mobile-legend-popout`}
                            ref={legendRef}
                        >
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    id={`${normalizedCategory(category)}-legend`}
                                    className={`exercises-legend-filter ${activeCategory === normalizedCategory(category) ? "active" : ""}`}
                                    onClick={() => handleClick(category)}
                                >
                                    <div className="exercises-legend-square" id={`${normalizedCategory(category)}-square`}></div>
                                    <div className="legend-label">{category}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category}
                            id={`${normalizedCategory(category)}-legend`}
                            className={`exercises-legend-filter ${activeCategory === normalizedCategory(category) ? "active" : ""}`}
                            onClick={() => handleClick(category)}
                        >
                            <div className="exercises-legend-square" id={`${normalizedCategory(category)}-square`}></div>
                            <div className="legend-label">{category}</div>
                        </div>
                    ))

                )
            }
        </div>
    );
}
