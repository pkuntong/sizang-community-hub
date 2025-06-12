import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";

export const VerificationSentPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const { resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Get the email from the unverified user in localStorage
    try {
      const unverifiedUser = JSON.parse(localStorage.getItem("sizang_unverified_user") || "null");
      if (unverifiedUser && unverifiedUser.email) {
        setEmail(unverifiedUser.email);
      }
    } catch (error) {
      console.error("Error getting unverified user:", error);
    }
  }, []);
  
  const handleResend = async () => {
    try {
      await resendVerificationEmail();
    } catch (error) {
      // Error is handled in the auth context
    }
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
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Icon icon="lucide:mail" className="text-primary text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Email Sent</h2>
              <p className="text-foreground-600 mb-6">
                We've sent a verification email to <span className="font-semibold">{email}</span>.
                Please check your inbox and click the verification link to complete your registration.
              </p>
              <div className="bg-content2 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Icon icon="lucide:info" className="mr-2 text-primary" />
                  What's next?
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground-600">
                  <li>Check your email inbox for the verification link</li>
                  <li>If you don't see it, check your spam or junk folder</li>
                  <li>Click the verification link in the email</li>
                  <li>Once verified, you can sign in to your account</li>
                </ul>
              </div>
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
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};