import { normalizeDate } from "@/utils/utils";

interface Props {
    id: string;
    date: string;
    name: string;
    suggestion: string;
}

export default function Suggestion({ id, date, name, suggestion }: Props) {

    date = normalizeDate(date, false);

    return (
        <div className="suggestion-container" id={id}>
            <div className="header">
                <span className="username">{name}</span>
                <span className="date">{date}</span>
            </div>
            <div className="suggestion-body">
                <p>{suggestion}</p>
            </div>
        </div>
    );
}