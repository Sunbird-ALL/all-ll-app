'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import Children from '../assests/Images/children-thumbnail.png'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'

// interface Props {
//   children: React.ReactNode
// }

const Links = ['Dashboard', 'Projects', 'Team']

const NavLink = () => {
  //const { children } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
    </Box>
  )
}

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };
  

  return (
    <>
      <Box pos={'absolute'} p={'20px'} h={'50px'} top={'0'} w="100%" style={{ background: "#fff", padding: "4px",  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", }} >
        <Flex mt={'10px'} h={20} alignItems={'center'} justifyContent={'space-between'}>
    
          <HStack spacing={8} alignItems={'center'} >
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link to={'/storylist'}>
              <button
             style={buttonStyle}
              >Home</button>
              </Link>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
                ))}
            </HStack>
          </HStack>
                <Box style={{color:"#000",fontSize: "28px" , fontWeight: '700', textAlign:'center' }}>{localStorage.getItem('storyTitle') === ''? "My Stories" : localStorage.getItem('storyTitle') }</Box>
          <Flex alignItems={'center'}>
            <Button className='btn btn-success'
              variant={'solid'}
              colorScheme={'teal'}
              onClick={onOpen}
              size={'sm'}
              mr={4}>
              My Profile : {localStorage.getItem('virtualID')}
            </Button>
            <Menu>
              <Avatar
                  size={'sm'}
                  src={
                    Children
                  }
                />
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}