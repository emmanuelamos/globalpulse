import { useEffect, useRef } from "react"; // <-- Import useRef
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc"; 

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const utils = trpc.useContext();
  
  // Create a ref to track if we've already fired the mutation
  const hasMutated = useRef(false);

  const googleMutation = trpc.auth.googleCallback.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      setLocation("/");
    },
    onError: (err) => {
      console.error("Google Auth Failed:", err.message);
      setLocation("/?error=google_auth_failed");
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Check the ref to make sure we haven't already fired this!
    if (code && state && !hasMutated.current) {
      hasMutated.current = true; // Lock the gate
      googleMutation.mutate({ code, state });
    } else if (!code && !hasMutated.current) {
      setLocation("/");
    }
  }, [googleMutation, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-300 font-medium">Securely logging you in...</p>
    </div>
  );
}