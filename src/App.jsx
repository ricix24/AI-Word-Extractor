import React, {useState} from "react";
import { Container, Box } from '@chakra-ui/react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import TextInput from "./components/TextInput";
import KeywordsModel from "./components/KeywordsModel";

function App() {
  const [keywords, setKeywords] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function extractKeywords(text) {
    setLoading(true);
    setIsOpen(true);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: 'Extract keywords from this text. Make the first letter of every word uppercase and separate with commas:\n\n' +
        text +
        '',
        temperature: 0.5,   //this is for the API to show high precised result and 0.5 is good for it
        max_tokens: 60,    //this will be the maximum words that would be extracted
        frequency_penalty: 0.8   //(can vary from (-2.0)-to-(+2.0))the higher it is gives the word repitative words OR phrases less
      }),
    };

    const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, options);

    const json = await response.json();     //this will provide us array of the choices

    const data = json.choices[0].text.trim();

    console.log(data);
    setKeywords(data);
    setLoading(false);

  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Box bg="blue.600" color='white' height='100vh' padding={130} >
      <Container maxW='3xl' centerContent >
        <Header />
        <TextInput extractKeywords={extractKeywords} />
        <Footer />
      </Container>
      <KeywordsModel 
        keywords={keywords} 
        loading={loading} 
        isOpen={isOpen} 
        closeModal={closeModal}
      />
    </Box>
  )
}


export default App;