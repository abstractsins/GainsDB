import { useEffect, useState } from "react";

interface ExerciseLegendProps {
    activeCategoryOverride: string | null;
    onCategorySelect: (category: string) => void;
    onResetExpansion: () => void;
}

export default function ExercisesLegend({ activeCategoryOverride, onCategorySelect, onResetExpansion }: ExerciseLegendProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
    };


    return (
        <div className="exercises-legend">
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
    );
}
