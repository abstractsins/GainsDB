import SuggestionBoard from "@/app/components/coming-soon/SuggestionBoard"
import SuggestionForm from "./SuggestionForm";
import { useState } from "react";

export default function SuggestionModule() {

    const [refresh, setRefresh] = useState(false);

    const refreshSuggestions = () => setRefresh(prev=> prev === true ? false : true);

    const refreshTrigger = () => {};

    return (
        <div className="coming-soon-module" id="suggestions">

            <h2>Have a suggestion or comment?</h2>

            <SuggestionForm onSubmission={refreshSuggestions}/>

            <SuggestionBoard trigger={refreshTrigger}/>

        </div>)
}