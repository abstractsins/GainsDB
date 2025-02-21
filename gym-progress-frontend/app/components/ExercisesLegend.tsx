import { useState } from "react";

interface ExerciseLegendProps {
    onCategorySelect: (category: string) => void;
}

export default function ExercisesLegend({ onCategorySelect }: ExerciseLegendProps) {

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const categories = ["Upper Body", "Lower Body", "Core", "Cardio", "Other", "All"];

    const handleClick = (category: string) => {
        setActiveCategory(prev => (prev === category ? null : category)); 
        onCategorySelect(category);
    };

    const normalizedCategory = (category: string) => {
        category = category.replace(/\s/g, '-');
        category = category.toLowerCase();
        return category;
    }

    return (
        <div className="exercises-legend">

            {categories.map((category) => (
                <div
                    key={category}
                    id={`${normalizedCategory(category)}-legend`}
                    className={`exercises-legend-filter ${activeCategory === category ? "active" : ""}`}
                    onClick={() => handleClick(category)} 
                >
                    <div className="exercises-legend-square" id={`${category.toLowerCase().replace(" ", "-")}-square`}></div>
                    <div className="legend-label">{category}</div>
                </div>
            ))}
        </div>
    );
}