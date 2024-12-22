import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useColorModeValue,
  useToast, // Import for notifications
} from "@chakra-ui/react";

//import { Lottie } from "lottie-react";
import carAni from "../assets/car.json";
// Mock user data
const MOCK_USERS = [
];

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      // Login logic
      const user = MOCK_USERS.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (user) {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Store user session (you might want to use a more secure method in production)
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", formData.email);
        // Redirect to dashboard or home page
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // Registration logic
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Registration Failed",
          description: "Passwords do not match",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Here you would typically add the new user to your database
        toast({
          title: "Registration Successful",
          description: "You can now login with your credentials",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsLogin(true);
      }
    }

    setIsLoading(false);
  };

  // PayPal script logic (unchanged)
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        window.paypal.use(["login"], function (login) {
          login.render({
            appid:
            scopes: "openid",
            containerid: "loginButton",
            responseType: "code",
            locale: "en-us",
            authend: "sandbox",
            buttonType: "LWP",
            buttonShape: "pill",
            buttonSize: "sm",
            fullPage: "true",
            returnurl: "https://park-it-app.vercel.app/test",
          });
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      const paypalScript = document.querySelector(
      );
      if (paypalScript) {
        document.body.removeChild(paypalScript);
      }
    };
  }, []);

  return (
    <Container
      maxW="100vw"
      h="100vh"
      centerContent
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        p={8}
        mx="auto"
        mt={20}
        bg={bgColor}
        w="full"
        maxW="md"
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={4} align="stretch">
          <Heading mb={6} textAlign="center" color={textColor} fontSize="2xl">
            {isLogin ? "Login" : "Register"}
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  size="lg"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  size="lg"
                  borderRadius="md"
                />
              </FormControl>

              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                mt={4}
                isLoading={isLoading}
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </VStack>
          </form>

          <Text pt={4} textAlign="center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              color="blue.500"
              onClick={() => setIsLogin(!isLogin)}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {isLogin ? "Register here" : "Login here"}
            </Link>
          </Text>

          <Box
            id="loginButton"
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          />

          <Lottie animationData={carAni} loop={true} />
        </VStack>
      </Box>
    </Container>
  );
}

export default Login;
