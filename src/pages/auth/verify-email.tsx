import React, { useState } from "react";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";

export const VerifyEmailPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  
  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setError("No verification token provided");
        return;
      }
      
      try {
        await verifyEmail(token);
        setIsSuccess(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Verification failed");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token, verifyEmail]);
  
  const handleResend = async () => {
    try {
      await resendVerificationEmail();
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setIsVerifying(true);
      const searchParams = new URLSearchParams(location.search);
      const oobCode = searchParams.get("oobCode");
      if (!oobCode) {
        throw new Error("No verification code provided");
      }
      await verifyEmail(oobCode);
      navigate("/sign-in");
    } catch (err) {
      setError("Failed to verify email");
    }
    setIsVerifying(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-content2">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-divider/40 shadow-lg">
          <CardBody className="p-8 text-center">
            {isVerifying ? (
              <div className="flex flex-col items-center py-8">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-foreground-600">Verifying your email...</p>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="lucide:check" className="text-success text-3xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                <p className="text-foreground-600 mb-6">
                  Your email has been successfully verified. You can now access all features of the Sizang Community Hub.
                </p>
                <Button 
                  color="primary" 
                  onPress={() => navigate("/")}
                >
                  Go to Homepage
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="lucide:x" className="text-danger text-3xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                <p className="text-danger mb-2">{error}</p>
                <p className="text-foreground-600 mb-6">
                  The verification link may have expired or is invalid. Please try again or request a new verification email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    color="primary" 
                    onPress={handleResend}
                  >
                    Resend Verification Email
                  </Button>
                  <Button 
                    variant="flat" 
                    onPress={() => navigate("/auth/sign-in")}
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};