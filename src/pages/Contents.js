import {
  Button,
  ButtonGroup,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import { Menu } from '../component/Menus';
import { destroy, getAll } from '../services/contentServices';

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

  return (
    <Layout
      _header={{
        title: 'Contents',
        rightComponent: (
          <Button
            size={'sm'}
            colorScheme={'red'}
            rounded="3xl"
            px="6"
            onClick={addData}
          >
            Add
          </Button>
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
  const deleteData = () => {
    if (obejctData.id) {
      destroy(obejctData.id);
      setObejctData();
      getData();
    }
  };

  return (
    <VStack w="100%">
      {data?.map((item, key) => (
        <Menu
          {...{ key, item }}
          _card={{ size: 'sm', borderWidth: 1, borderColor: 'gray.300' }}
          rightComponent={
            <ButtonGroup size={'xs'}>
              <Button
                colorScheme="green"
                onClick={e => navigate(`/content/${item?.id}`)}
              >
                Edit
              </Button>
              <Button colorScheme="red" onClick={e => setObejctData(item)}>
                Delete
              </Button>
            </ButtonGroup>
          }
        />
      ))}
      <Modal isOpen={obejctData?.id} onClose={e => setObejctData()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure to delete {obejctData?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={e => deleteData()} colorScheme="red">
                delete
              </Button>
              <Button onClick={e => setObejctData()}>Cancel</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
