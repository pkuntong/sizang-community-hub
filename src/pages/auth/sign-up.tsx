import React, { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button, Link, Divider, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";

export const SignUpPage: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  
  // Validation states
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  
  // Check password match when either password changes
  React.useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);
  
  // Check password strength
  React.useEffect(() => {
    if (password) {
      // At least 8 characters, with at least one uppercase, one lowercase, and one number
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      setIsValidPassword(regex.test(password));
    } else {
      setIsValidPassword(true);
    }
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }
    
    if (!isValidPassword) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and number");
      return;
    }
    
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      navigate("/verification-sent");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      await googleLogin();
      navigate("/");
    } catch (error) {
      console.error("Google signup failed:", error);
      setError("Google sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-xl p-3 shadow-lg">
              <Icon icon="lucide:users" className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-foreground-500">Join the Sizang Community Hub</p>
        </div>
        
        <Card className="border border-divider/40 shadow-lg">
          <CardBody className="p-6">
            {error && (
              <div className="bg-danger-50 text-danger border border-danger-200 rounded-medium p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="bordered"
                  isRequired
                  startContent={<Icon icon="lucide:user" className="text-foreground-400" />}
                />
                
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  isRequired
                  startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                />
                
                <Input
                  label="Password"
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="bordered"
                  isRequired
                  isInvalid={!isValidPassword && password.length > 0}
                  errorMessage={!isValidPassword && password.length > 0 ? "Password must be at least 8 characters with uppercase, lowercase, and number" : ""}
                  startContent={<Icon icon="lucide:lock" className="text-foreground-400" />}
                />
                
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="bordered"
                  isRequired
                  isInvalid={!passwordsMatch && confirmPassword.length > 0}
                  errorMessage={!passwordsMatch && confirmPassword.length > 0 ? "Passwords do not match" : ""}
                  startContent={<Icon icon="lucide:lock" className="text-foreground-400" />}
                />
                
                <Checkbox
                  isSelected={agreeTerms}
                  onValueChange={setAgreeTerms}
                  size="sm"
                >
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link href="#" size="sm" className="text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" size="sm" className="text-primary">
                      Privacy Policy
                    </Link>
                  </span>
                </Checkbox>
                
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isLoading={isLoading}
                  isDisabled={!passwordsMatch || !isValidPassword || !agreeTerms}
                >
                  Sign Up
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-divider"></div>
                <span className="px-4 text-foreground-400 text-sm">OR</span>
                <div className="flex-grow border-t border-divider"></div>
              </div>
              
              <Button
                variant="flat"
                fullWidth
                onPress={handleGoogleSignUp}
                isLoading={isLoading}
                startContent={<Icon icon="logos:google-icon" className="text-lg" />}
              >
                Sign up with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-foreground-500 text-sm">
                Already have an account?{" "}
                <Link to="/auth/sign-in" className="text-primary font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};