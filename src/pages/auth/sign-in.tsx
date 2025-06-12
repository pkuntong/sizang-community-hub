import React, { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button, Link, Divider, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/auth-context";

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      await googleLogin();
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-content2/50">
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-foreground-500">Sign in to continue to Sizang Community Hub</p>
        </div>
        
        <Card className="border border-divider/40 shadow-lg">
          <CardBody className="p-6">
            {error && (
              <div className="bg-danger-50 text-danger border border-danger-200 rounded-medium p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
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
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="bordered"
                  isRequired
                  startContent={<Icon icon="lucide:lock" className="text-foreground-400" />}
                />
                
                <div className="flex justify-between items-center">
                  <Checkbox
                    isSelected={rememberMe}
                    onValueChange={setRememberMe}
                    size="sm"
                  >
                    Remember me
                  </Checkbox>
                  
                  <div className="flex-grow border-t border-divider"></div>
                  
                  <Link 
                    color="primary" 
                    size="sm" 
                    className="cursor-pointer"
                    onPress={() => navigate("/auth/forgot-password")} // Add link to forgot password page
                  >
                    {t('auth.signIn.forgotPassword')}
                  </Link>
                </div>
                
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign In
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
                onPress={handleGoogleSignIn}
                isLoading={isLoading}
                startContent={<Icon icon="logos:google-icon" className="text-lg" />}
              >
                Sign in with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-foreground-500 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};