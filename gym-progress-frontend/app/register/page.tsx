"use client";

import App from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

import { useFooter } from "@/contexts/FooterContext";


export default function Register() {
    const router = useRouter();
    const [validForm, setValidForm] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date(),
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const server = process.env.NEXT_PUBLIC_BACKEND;

    const { setIsInRegistration } = useFooter();

    interface FormData {
        date: Date;
        username: string;
        password: string;
        confirmPassword: string;
    }

    // Validate the form whenever fields change
    useEffect(() => {
        const isValidUsername = formData.username.length > 0;
        const isConfirmPasswordValid =
            confirmPasswordError === "" &&
            formData.confirmPassword === formData.password;

        setValidForm(isValidUsername && passwordValid && isConfirmPasswordValid);
    }, [formData, passwordValid, confirmPasswordError]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsRegistering(true);
        if (formData.username.length < 3) {
            alert('Username must be at least 3 characters');
        } else {

            const payload = {
                username: formData.username,
                password: formData.password,
                date: formData.date,
            };

            try {


                const res = await fetch(`${server}/api/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    alert("Account successfully created!\n\nNavigating to login page");
                    setIsRegistering(false);
                    setIsRedirecting(true);
                    setIsInRegistration(false);
                    setTimeout(() => router.push('/'), 2000);
                } else {
                    const errorResult = await res.json();
                    console.log(errorResult);
                    // Here errorResult.message might contain "error, user name taken"
                    alert(errorResult.error || "Registration failed. Please try again.");
                    setIsRegistering(false);
                }
            } catch (e) {

                console.error(e);
                alert("Connection to database failed.");
                setIsRegistering(false);

            }
        }
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Username validation: Only letters (a-z, A-Z) and numbers (0-9), max 15 chars
        const validUsernamePattern = /^[a-zA-Z0-9]*$/;
        if (name === "username") {
            if (!validUsernamePattern.test(value)) return; // Block invalid input
            if (value.length > 15) return; // Enforce max length of 15
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value, // Update the field
        }));

        // Validate password field
        if (name === "password") {
            validatePassword(value);
        }

        // Validate confirm password field
        if (name === "confirmPassword") {
            validateConfirmPassword(value);
        }
    };

    // Password validation function
    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let asciiRange = true;
        for (let i = 0; i < password.length; i++) {
            if (password.charCodeAt(i) < 33 || password.charCodeAt(i) > 126) {
                asciiRange = false;
                break;
            }
        }

        if (!minLength) {
            setPasswordError("Password must be at least 8 characters");
            setPasswordValid(false);
        } else if (!hasUppercase) {
            setPasswordError("Password must contain at least one uppercase letter");
            setPasswordValid(false);
        } else if (!hasSpecialChar) {
            setPasswordError("Password must contain at least one special character");
            setPasswordValid(false);
        } else if (asciiRange === false) {
            setPasswordError("Password characters must be in ASCII range 33 -   126");
            setPasswordValid(false);
        } else {
            setPasswordError(""); // No errors
            setPasswordValid(true); // Password is valid
        }
    };

    // Confirm password validation function
    const validateConfirmPassword = (confirmPassword: string) => {
        if (confirmPassword !== formData.password) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    return (
        <div className="non-dash-page">
            <div className="header">
                <h1 className="page-header">Register</h1>
            </div>
            <div className="registration-body">
                {isRegistering && <Loader msg={'Registering'}></Loader>}
                {isRedirecting && <Loader msg={'Redirecting'}></Loader>}
                <div className="body-header">
                    <ul>
                        <li>We store only the data you enter.</li>
                        <li>No email or personal info required.</li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit} id="registration-form">
                    <div className="registration-inputs">
                        {/* Username Field */}
                        <div className="registration-form-module">
                            <div className="module-label">
                                <span>Username</span>
                            </div>
                            <div className="module-field">
                                <input
                                    type="text"
                                    autoFocus
                                    name="username"
                                    id="registration-username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    maxLength={15}
                                />
                                <p className="field-subtitle">3 - 15 characters, alphanumeric only</p>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="registration-form-module">
                            <div className="module-label">
                                <span>Password</span>
                            </div>
                            <div className="module-field">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {passwordError
                                    ? <p className="field-subtitle error">{passwordError}</p>
                                    : <p className="field-subtitle"></p>}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="registration-form-module">
                            <div className="module-label">
                                <span>Confirm Password</span>
                            </div>
                            <div className="module-field">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    disabled={!passwordValid} // Disable until password is valid
                                />
                                {confirmPasswordError
                                    ? <p className="field-subtitle error">{confirmPasswordError}</p>
                                    : <p className="field-subtitle"></p>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Register Button */}
                    <div className="registration-footer">
                        <button
                            className={`register-button ${validForm ? 'active' : ''} ${isRegistering ? 'disabled' : ''}`}
                            type="submit"
                            disabled={!validForm || isRegistering}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
