import React, { useEffect, useState } from 'react';
import { Box, HStack, useRadio, useRadioGroup } from "@chakra-ui/react"
import { render } from "@testing-library/react"
import { Navigate } from "react-router-dom"

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}


function TabCard(props) {
  const options = ['Discover', 'Validate', 'Practice'];

  const tabs =
  [
    { name: 'Discover', link: '/discoverylist' },
    { name: 'Validate', link: '/validate' },
    { name: 'Practice', link: '/practice' },
  ];

  const [activeTab, setActiveTab] = useState(localStorage.getItem('tabIndex'));

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',  
    defaultValue: activeTab || 'Discover',
    onChange: function(a){
        localStorage.setItem('tabIndex', a)
        const tab = tabs.find((tab) => tab.name === a);
        props.naviagteTo(tab.link)
        setActiveTab(a);
    },
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export default TabCard;