// import { useState } from "react";
// import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
// import axios from "axios";
// import { initializeApp } from "firebase/app";


// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
// };


// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export default function Home() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [confirmResult, setConfirmResult] = useState<any>(null);
//   const [message, setMessage] = useState("");

// const setUpRecaptcha = () => {
//   const verifier = new RecaptchaVerifier(
//     auth,
//     "recaptcha-container", // container ID in your JSX
//     {
//       size: "invisible",
//       callback: () => sendOtp(),
//     }
//   );
//   (window as any).recaptchaVerifier = verifier;
// };


//   const sendOtp = async () => {
//     setUpRecaptcha();

//     const verifier = (window as any).recaptchaVerifier;
//     try {
//       const result = await signInWithPhoneNumber(auth, phone, verifier);
//       setConfirmResult(result);
//       setMessage("OTP sent successfully!");
//     } catch (error) {
//       setMessage("Failed to send OTP.");
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const result = await confirmResult.confirm(otp);
//       const idToken = await result.user.getIdToken();

//       const res = await axios.post("/api/verify-otp", { idToken });

//       setMessage("OTP verified successfully!");
//     } catch (error) {
//       setMessage("Invalid OTP");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">OTP Login</h2>

//         <input
//           type="text"
//           placeholder="Enter phone number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />

//         <button
//           onClick={sendOtp}
//           className="w-full bg-blue-500 text-white py-2 rounded mb-4"
//         >
//           Send OTP
//         </button>

//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />

//         <button
//           onClick={verifyOtp}
//           className="w-full bg-green-500 text-white py-2 rounded"
//         >
//           Verify OTP
//         </button>

//         {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

//         <div id="recaptcha-container"></div>
//       </div>
//     </div>
//   );
// }
// pages/auth/email.tsx
import { useEffect, useState } from "react";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function EmailOTPLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSendLink = async () => {
    const actionCodeSettings = {
      url: "/auth/email", // Change to your deployed domain in production
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage(" Check your email inbox.");
    } catch (error: any) {
      console.error("Error sending email link:", error);
      setMessage("Failed to send magic link.");
    }
  };

  // Handle login when user clicks link in email
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
            .then(async () => {
    setMessage("Signed in successfully!");


    const idToken = await auth.currentUser?.getIdToken();

    await fetch("/api/firebase-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    });

    window.localStorage.removeItem("emailForSignIn");

    router.push("/"); // redirect to home or bookings
  })
  .catch(() => setMessage("Invalid or expired link"));
      } else {
        setMessage("No email found in storage.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Email OTP Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button
          onClick={handleSendLink}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Send OTP Link
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
