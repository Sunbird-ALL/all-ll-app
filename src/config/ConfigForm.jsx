import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Radio, RadioGroup, Button, VStack, HStack, useToast } from '@chakra-ui/react';
import completionCriteria from './practiceConfig';

const initialCriteria = completionCriteria;

const ConfigForm = () => {
  const [criteria, setCriteria] = useState(initialCriteria[localStorage.getItem('userCurrentLevel') || 'm1']);
  const toast = useToast()

  useEffect(() => {
    // Retrieve criteria from localStorage on component mount
    const storedCriteria = JSON.parse(localStorage.getItem('criteria'));
    if (storedCriteria) {
      setCriteria(storedCriteria);
    }
  }, []);

  const handleInputChange = (index, value) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], template: value };
    setCriteria(updatedCriteria);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Save criteria to localStorage
    localStorage.setItem('criteria', JSON.stringify(criteria));
    toast({
      position: 'top',
      title: 'Practice Configuration Applied',
      description: 'Remember to click "Save" to apply and save the configuration.',
      duration: 2000,
      status: 'success'
    })
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="start">
          {criteria.map((item, index) => (
            
            <FormControl key={index} mb={4}>
              <HStack>
              <FormLabel>{item.title}</FormLabel>
              <RadioGroup
                onChange={(value) => handleInputChange(index, value)}
                value={criteria[index]?.template || ''}
              >
               <HStack> <Radio value='spell-and-check'>spell&check</Radio>
                <Radio value='simple'>Simple</Radio></HStack>
              </RadioGroup>
              </HStack>
            </FormControl>
            
          ))}
        </VStack>

        <Button type="submit" colorScheme="teal" mt={4}>
          Apply Practice Config
        </Button>
      </form>
    </Box>
  );
};

export default ConfigForm;
