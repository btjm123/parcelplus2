import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Text, useToast, VStack, Spinner } from "@chakra-ui/react";
import settlePayment from "../services/payment.js";
// import Lottie from "lottie-react";
import animation from "../assets/lottie.json";
import { Link, useNavigate } from "react-router-dom";

export function BoxConditionChecker() {
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  // 1. Handle dropped files
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // We assume single file
      const file = acceptedFiles[0];
      if (!file) return;

      setIsLoading(true);

      try {
        // Convert the file to Base64
        const base64 = await fileToBase64(file);
        setUploadedImage(base64);

        // 2. Send request to ChatGPT
        const responseData = await checkBoxConditionWithChatGPT(base64);

        // 3. Parse the response and show a toast
        handleAPIResponse(responseData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong while checking the box condition.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  // React Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Helper: Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper: Send a request to the ChatGPT API
  const checkBoxConditionWithChatGPT = async (base64Image) => {
    console.log(base64Image);
    console.log("yuheng");
    const prompt = `
      You are given an image of cardboard box.
      Please determine whether the box appears to be in good condition
      (free of tears, blemishes, kinks, or other visible damage) and can be used to store items.

      Return a single JSON object with the following properties:

      answer: Either "yes" or "no".
      confidence: A floating-point number between 0 and 1 that indicates your level of confidence in this assessment.
      description: A brief explanation of why you arrived at this conclusion.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Is this cardboard box in good condition (free of tears, blemishes, kinks, or other visible damage) and can it be used to store items? Please respond with a JSON object containing: answer (yes/no), confidence (0-1), and description.",
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],

        temperature: 0.0,
      }),
    });

    const data = await response.json();
    console.log("yuhng", data);
    // The assistant's reply is usually in data.choices[0].message.content
    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content.trim();
    }
    throw new Error("No valid response from ChatGPT");
  };

  // Parse the returned text as JSON and show toast
  const handleAPIResponse = (apiResponse, base64Image) => {
    try {
      // 1. Locate the first '{' and the last '}' to isolate the JSON portion
      const firstBraceIndex = apiResponse.indexOf("{");
      const lastBraceIndex = apiResponse.lastIndexOf("}");

      // If either index is -1, we couldn't find valid JSON braces
      if (firstBraceIndex === -1 || lastBraceIndex === -1) {
        throw new Error("No valid JSON found in response");
      }

      // 2. Extract the substring that should be valid JSON
      const jsonString = apiResponse.substring(
        firstBraceIndex,
        lastBraceIndex + 1,
      );

      // 3. Parse the JSON
      const result = JSON.parse(jsonString);

      // 4. Check for "answer" and "confidence"
      if (result.answer && result.answer.toLowerCase() === "yes") {
        toast({
          title: "Box Condition: Good",
          description: `Confidence: ${result.confidence}`,
          status: "success",
          duration: 8000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/map");
        }, 8000);
      } else {
        toast({
          title: "Box Condition: Not Good",
          description: `Confidence: ${result.confidence || "N/A"}`,
          status: "error",
          duration: 8000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Failed to parse JSON from response:", error);
      toast({
        title: "Item is not valid for recycling",
        description: "Please choose a valid item.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? "teal.500" : "gray.300"}
        p={8}
        textAlign="center"
        cursor="pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the image here...</Text>
        ) : (
          <Text>Drag & drop an image here, or click to select</Text>
        )}
      </Box>

      {isLoading && (
        <Box textAlign="center">
          <Spinner />
          <Text mt={2}>Processing image...</Text>
        </Box>
      )}

      {/* {isLoading && <DaSpinner />} */}

      {uploadedImage && (
        <Button
          onClick={() => {
            setUploadedImage(null);
          }}
        >
          Remove Uploaded Image
        </Button>
      )}
      {/* <Lottie animationData={animation} loop={true} autoplay={true} /> */}
    </VStack>
  );
}

//"Invalid type for 'messages[1].content[1].image_url.url': expected a base64-encoded data URL, but got an object instead."
