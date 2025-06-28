import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (result?.error) {
    setError(result.error);
  } else {
    setError("");
    router.push("/"); // or wherever you want after login
  }
}

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h1 className="text-2xl mb-4">LOGIN </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Sign In
        </button>
      </form>
      <button onClick={()=> router.push("/auth/email")}>Send otp</button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
