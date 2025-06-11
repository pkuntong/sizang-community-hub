import React from "react";
import { Card, CardBody, CardHeader, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";
import { useTranslation } from "react-i18next";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { requestPasswordReset } = useAuth();
  const history = useHistory();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="text-foreground-500 text-center">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </CardHeader>
          <CardBody>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  variant="bordered"
                  startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                />
                
                <Button 
                  type="submit" 
                  color="primary" 
                  fullWidth
                  isLoading={isSubmitting}
                  isDisabled={!email}
                >
                  Send Reset Link
                </Button>
                
                <div className="flex justify-center">
                  <Link 
                    color="primary" 
                    className="cursor-pointer"
                    onPress={() => history.push("/auth/sign-in")}
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="bg-success/10 rounded-full p-4 inline-flex mb-4">
                  <Icon icon="lucide:check" className="text-success text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                <p className="text-foreground-500 mb-6">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <Button 
                  color="primary" 
                  variant="flat"
                  onPress={() => history.push("/auth/sign-in")}
                  fullWidth
                >
                  Return to Sign In
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};