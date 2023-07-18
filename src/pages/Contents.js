import React from 'react';
import { useState, useEffect } from 'react';
import { VStack, Button, ButtonGroup, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormLabel, Select, ModalBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import { Menu } from '../component/Menus';
import { destroy, getAll, publishDataOnServer } from '../services/contentServices';
import axios from 'axios';

export default function Contents() {
  const navigate = useNavigate();
  const [dataContents, setDataContents] = React.useState([]);

  React.useEffect(() => {
    // Fetch data from API and save it to localStorage
    getData();
  }, []);

  const getData = async () => {
  try {
    const response = await fetch("https://all-content-respository-backend.onrender.com/v1/WordSentence", {
      method: "get",
      headers: {
        'ngrok-skip-browser-warning': 6124
      }
    });

    const dataFromAPI = await response.json();

    // Get the content from localStorage
    //~ const storedContent = Object.values(JSON.parse(localStorage.getItem('contents')) || {});
    const storedContent = Object.values(getAll() || {});

    // Create a Map to store unique records based on their ids
    const idMap = new Map();

    // Add the records from storedContent to the Map
    storedContent.forEach((record) => {
      idMap.set(record.id, record);
    });

    // Loop through each object in the "data" array from the API
    for (let i = 0; i < dataFromAPI.data.length; i++) {
      const obj = dataFromAPI.data[i];
      const { en, ta } = obj.data[0];

      // Create the converted object
      const convertedObj = {
        id: obj._id,
        title: obj.title,
        type: obj.type,
        image: obj.image,
        en,
        ta
      };

      // Add the converted object to the Map, overwriting any existing records with the same id
      idMap.set(convertedObj.id, convertedObj);
    }

    // Convert the Map back to an array of unique records
    const combinedContent = Array.from(idMap.values());

    setDataContents(combinedContent);

    // Save the combined content in localStorage
    localStorage.setItem('contents', JSON.stringify(combinedContent));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  const addData = () => {
    navigate('/content/add'); // Navigate to the addData route
  };

  return (
    <Layout
      _header={{
        title: 'Contents',
        rightComponent: (
          <>
            {/*<Button
              size={'sm'}
              colorScheme={'green'}
              rounded="3xl"
              px="6"
              onClick={() => {
                const storedContent = JSON.parse(localStorage.getItem('contents')) || [];
                setDataContents(storedContent);
              }}
            >
              Add Sample Content
            </Button>*/}
            <Button
              size={'sm'}
              colorScheme={'red'}
              rounded="3xl"
              px="6"
              onClick={addData}
            >
              Add
            </Button>
          </>
        ),
      }}
      _body={{ title: 'Manage Content', _body: { p: 0 } }}
    >
      <VStack p="4">
        <ListComponent data={dataContents} addData={addData} getData={getData} />
      </VStack>
    </Layout>
  );
}

const ListComponent = ({ data, getData }) => {
  const navigate = useNavigate();
  const [obejctData, setObejctData] = React.useState();
  const [filter_type, setfilter_type] = React.useState('');
  const deleteData = async (item, key) => {
    if (key) {
      await destroy(key);
      setObejctData();
      getData();
    }
  };
  
  const publishData = async (item) => {
    if (item.id) {
      await publishDataOnServer(item); // Add 'await' keyword before destroy
      setObejctData(null); // Reset the selected item
      getData();
    }
  };

  const [isOpen, setIsOpen] = React.useState(false); // State to control modal visibility
  const [modalContent, setModalContent] = React.useState(null); // State to store modal content

  const handlePublish = (item) => {
    setObejctData(item); // Set the selected item
	const newItemValue = {
		id: item.id,
		publishedBy: "anonymous",
		collectionId: "",
		title: item.title,
		type: item.type,
		image: item.image || "" ,
		data: {},
		status: 1,
	};

	if (item.en && (item.en.text || item.en.audio)) {
		newItemValue.data.en = {
			text: item.en.text,
			audio: item.en.audio,
		};
	}

	if (item.ta && (item.ta.text || item.ta.audio)) {
		newItemValue.data.ta = {
			text: item.ta.text,
			audio: item.ta.audio,
		};
	}

	if (item.hi && (item.hi.text || item.hi.audio)) {
		newItemValue.data.hi = {
			text: item.hi.text,
			audio: item.hi.audio,
		};
	}

    setModalContent({
      title: `Publish ${item.title}`,
      message: `Are you sure you want to publish ${item.title}?`,
      action: async () => {
        // Code to handle publish action
        setIsOpen(false); // Close the modal
        setModalContent(null); // Reset the modal content
        await publishData(newItemValue); // Call the publishData function with the item
      },
      actionName: 'publish', // Add the action name 'publish'
    });
    setIsOpen(true); // Open the modal
  };

  const handleDelete = (item, key) => {
    setObejctData(item); // Set the selected item
    console.log(item);
    setModalContent({
      title: `Delete ${item.title}`,
      message: `Are you sure you want to delete ${item.title}?`,
      action: async () => {
        setIsOpen(false); // Close the modal
        setModalContent(null); // Reset the modal content
        await deleteData(item, key); // Call the deleteData function with the item
      },
      actionName: 'delete', // Add the action name 'delete'
    });
    setIsOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsOpen(false); // Close the modal
    setModalContent(null); // Reset the modal content
  };

  return (
    <VStack w="100%">
      {data?.map((item, key) => (
        <Menu
          {...{ key, item }}
          _card={{ size: 'sm', borderWidth: 1, borderColor: 'gray.300' }}
          rightComponent={
            <ButtonGroup size={'xs'}>
              <Button colorScheme="blue" onClick={() => handlePublish(item)}>
                Publish
              </Button>
              <Button
                colorScheme="green"
                onClick={e => navigate(`/content/${item?.id}`)}
              >
                Edit
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(item, key)}>
                Delete
              </Button>
            </ButtonGroup>
          }
        />
      ))}
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalContent?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>{modalContent?.message}</p>
          </ModalBody>
          <ModalFooter>
          <ButtonGroup>
             <Button onClick={handleCloseModal}>Cancel</Button>
                {modalContent && modalContent.actionName === 'publish' && (
                  <Button colorScheme="blue" onClick={modalContent.action}>
                  Publish
                  </Button>
                )}
                {modalContent && modalContent.actionName === 'delete' && (
                  <Button colorScheme="red" onClick={modalContent.action}>
                  Delete
                  </Button>
                )}
             </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
