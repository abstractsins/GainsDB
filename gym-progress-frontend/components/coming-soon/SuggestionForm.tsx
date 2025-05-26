import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


interface SuggestionForm {
    date: Date | null;
    name: string;
    suggestion: string;
}

interface Props {
    onSubmission: () => void;
}

export default function SuggestionForm({onSubmission}: Props) {
    const [validForm, setValidForm] = useState(false);
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);

    const server = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000'
    const token = session?.user?.authToken || localStorage.getItem("token");

    const [formData, setFormData] = useState<SuggestionForm>({
        date: null,
        name: "",
        suggestion: "",
    });

    const validateForm = (formData: SuggestionForm) => {
        if ((typeof (formData.name) === 'string' && formData.name.length > 0)
            && (typeof (formData.suggestion) === 'string' && formData.suggestion.length > 0)) {
            if (formData.suggestion.split(' ').every(word => word.length < 30) === true) {
                setValidForm(true);
            } else {
                setValidForm(false);
            }
        } else {
            setValidForm(false);
        }
    }

    const clearForm = () => setFormData({ date: null, name: "", suggestion: "" });

    const submissionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setError("No authentication session found. Please log in.");
            return;
        }

        const payload: SuggestionForm = {
            date: new Date(),
            name: formData.name,
            suggestion: formData.suggestion
        };
        console.log("🟢 Final Payload:", payload);

        const res = await fetch(`${server}/api/suggestions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const responseData = await res.json();
        console.log("🔵 API Response:", responseData);

        if (res.ok) {
            alert("Your suggestion has been posted!");
            clearForm();
            onSubmission();
        } else {
            alert("Error posting suggestion.");
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(()=> {
        validateForm(formData);
    }, [formData]);

    if (error) {
        return <p>{error}</p>
    }

    return (
        <form onSubmit={submissionHandler}>
            <div className="flex">
                <input
                    className="suggestion-name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    maxLength={30}
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className={`submit ${validForm ? 'valid' : ''}`}
                    disabled={!validForm}
                    type="submit"
                    value="Submit"
                />
                <input
                    className="clear-button"
                    type="button"
                    value="Clear"
                    onClick={clearForm}
                />
            </div>
            <div className="flex">
                <textarea
                    className="suggestion-text"
                    placeholder="300 character limit"
                    maxLength={300}
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
}