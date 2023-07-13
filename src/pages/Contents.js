import React from 'react';
import { VStack, Button, ButtonGroup, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormLabel, Select, ModalBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import { Menu } from '../component/Menus';
import { destroy, getAll, publishDataOnServer } from '../services/contentServices';

import SampleContent from '../utils/Const/SampleContent_Hari';

export default function Contents() {
  const navigate = useNavigate();
  const [dataContents, setDataContents] = React.useState();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setDataContents(getAll());
  };

  const addData = () => {
    navigate('/content/add');
  };

  let contentItemList = JSON.parse(localStorage.getItem("contents"));
  
  return (
    <Layout
      _header={{
        title: 'Contents',
        rightComponent: (
          <>
            {(JSON.stringify(contentItemList) === '{}' || contentItemList === null)  && (
              <Button
                size={'sm'}
                colorScheme={'green'}
                rounded="3xl"
                px="6"
                onClick={() => {
                  localStorage.setItem('contents', JSON.stringify(SampleContent));
                  window.location.reload();
                }}
              >
                Add Sample Content
              </Button>
            )}
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
        <ListComponent data={dataContents} getData={getData} />
      </VStack>
    </Layout>
  );
}

const ListComponent = ({ data, getData }) => {
  const navigate = useNavigate();
  const [obejctData, setObejctData] = React.useState();
  const [filter_type, setfilter_type] = React.useState('');
  const deleteData = async (item) => {
    if (item.id) {
      await destroy(item.id); // Add 'await' keyword before destroy
      setObejctData(null); // Reset the selected item
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
		image: item.image,
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

  const handleDelete = (item) => {
    setObejctData(item); // Set the selected item
    setModalContent({
      title: `Delete ${item.title}`,
      message: `Are you sure you want to delete ${item.title}?`,
      action: async () => {
        setIsOpen(false); // Close the modal
        setModalContent(null); // Reset the modal content
        await deleteData(item); // Call the deleteData function with the item
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
              <Button colorScheme="red" onClick={() => handleDelete(item)}>
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
