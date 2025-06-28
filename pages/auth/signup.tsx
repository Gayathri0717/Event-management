// pages/auth/signup.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
    } else {
      setMessage("Account created! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 2000);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-green-600 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
}
