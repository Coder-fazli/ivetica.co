"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../auth.css";


export default function SignUpPage(){
    const {signUp, isLoaded, setActive} = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isLoaded) return;
     

        
     if(!isLoaded) return;
     setLoading(true);
     setError("");

     try {
        const result = await signUp.create({
            emailAddress: email,
            password,
        });
   
          if (result.status === "complete") {
             await setActive({session: result.createdSessionId });
             router.push("/admin")
          }

     } catch (erro: unknown) {
        const clerkError = error as { errors?: { message: string }[] };
        setError(clerkError.errors?.[0]?.message || "Something wen wrong");
} finally {
    setLoading(false);  
} }
 
return (
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register to access
  the dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label 
  className="auth-label">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
  setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          {error && <div 
  className="auth-error">{error}</div>}

          <button type="submit" disabled={loading} 
  className="auth-btn">
            {loading ? "Creating account..." : "CreateAccount"}
          </button>
        </form>
      </div>
    );

}