import React from "react";
import { Card, CardBody, CardHeader, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";
import { useTranslation } from "react-i18next";

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const { resetPassword } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get token from URL query params
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!token) {
      setError("Invalid reset token");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await resetPassword(token, password);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-content2/50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-8">
            <div className="bg-danger/10 rounded-full p-4 inline-flex mb-4">
              <Icon icon="lucide:alert-circle" className="text-danger text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Invalid Reset Link</h3>
            <p className="text-foreground-500 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Button 
              color="primary"
              onPress={() => history.push("/auth/forgot-password")}
              fullWidth
            >
              Request New Reset Link
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-content2/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 items-center">
            <div 
              className="bg-primary rounded-full p-3 mb-2 cursor-pointer"
              onClick={() => history.push("/")}
            >
              <Icon icon="lucide:lock" className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="text-foreground-500 text-center">
              Enter your new password below
            </p>
          </CardHeader>
          <CardBody>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-danger/10 text-danger p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  startContent={<Icon icon="lucide:lock" className="text-foreground-400" />}
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  startContent={<Icon icon="lucide:lock" className="text-foreground-400" />}
                />
                
                <Button 
                  type="submit" 
                  color="primary" 
                  fullWidth
                  isLoading={isSubmitting}
                  isDisabled={!password || !confirmPassword}
                >
                  Reset Password
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="bg-success/10 rounded-full p-4 inline-flex mb-4">
                  <Icon icon="lucide:check" className="text-success text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Password Reset Successful</h3>
                <p className="text-foreground-500 mb-6">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <Button 
                  color="primary"
                  onPress={() => history.push("/auth/sign-in")}
                  fullWidth
                >
                  Sign In
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};