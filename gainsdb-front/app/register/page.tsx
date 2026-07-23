"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Waiter";

import { useFooter } from "@/contexts/FooterContext";

export default function Register() {
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

  return (
    <div className="non-dash-page">
      <div className="header">
        <h1 className="page-header">Register</h1>
      </div>
    </div>
  );
}
