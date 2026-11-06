import SuggestionBoard from "@/components/coming-soon/SuggestionBoard"
import SuggestionForm from "./SuggestionForm";
import { useState } from "react";

export default function SuggestionModule() {
    const [refresh, setRefresh] = useState(false);
    const refreshSuggestions = () => setRefresh((prev) => !prev);

    return (
        <div className="coming-soon-module" id="suggestions">

            <h2>Have a suggestion or comment?</h2>

            <SuggestionForm onSubmission={refreshSuggestions}/>

            <SuggestionBoard trigger={refresh}/>

        </div>)
}