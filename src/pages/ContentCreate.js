import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import Mic from '../component/Mic';
import { create, getOne, update } from '../services/contentServices';
import { blobToBase64 } from '../utils/helper';

const languageCore = [
  { text: 'English', value: 'en' },
  /*{ text: 'Hindi - हिंदी', value: 'hi' },*/
  { text: 'Tamil - தமிழ்', value: 'ta' },
];

export default function ContentCreate() {
  const [data, setData] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [languages, setLanguages] = React.useState(['en']);
  const [languageOptions, setLanguageOptions] = React.useState([]);
  const [addButton, setAddButton] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      const newData = getOne(id);
      const keys = Object.keys(newData);
      const lanData = languageCore
        .filter(e => keys.includes(e.value))
        .map(e => e.value);
      setLanguages(lanData);
      setData(newData);
    }
  }, [id]);

  React.useEffect(() => {
    const dataOption = languageCore.filter(e => !languages.includes(e.value));
    setLanguageOptions(dataOption);
    setAddButton(dataOption?.length);
  }, [languages]);

  const handleChange = e => {
    if (e.target.type === 'file') {
      blobToBase64(e.target.files[0], url => {
        setData({ ...data, image: url });
      });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (id) {
      update(data);
    } else {
      create(data);
    }
    navigate(-1);
  };

  return (
    <Layout
      _header={{
        title: 'Contents',
      }}
      _body={{ title: 'Create content' }}
    >
      <VStack>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="Title"
            type="text"
            name="title"
            value={data?.title ? data?.title : ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Select Type</FormLabel>
          <Select
            placeholder="Select Type"
            name="type"
            value={data?.type ? data?.type : ''}
            onChange={handleChange}
          >
            <option value="Word">Word</option>
            <option value="Sentence">Sentence</option>
            <option value="Paragraph">Paragraph</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Image</FormLabel>
          {data?.image ? (
            <VStack>
              <FaTimes
                onClick={e => setData({ ...data, image: null })}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 0,
                  padding: '3px',
                  background: '#e53e3e',
                  color: '#fff',
                  borderRadius: '100%',
                }}
              />
              <img src={data?.image} alt="" />
            </VStack>
          ) : (
            <Input type="file" name="image" onChange={handleChange} />
          )}
        </FormControl>
        <Card width={'100%'}>
          {languages.map((e, key) => {
            return (
              <CardBody key={key}>
                {key ? (
                  <hr style={{ marginBottom: '16px' }} />
                ) : (
                  <React.Fragment />
                )}
                <MoreInput {...{ data, setData }} name={e} />
              </CardBody>
            );
          })}
        </Card>
        {addButton ? (
          <Button width={'100%'} onClick={e => setIsOpen(true)}>
            Add more
          </Button>
        ) : (
          <React.Fragment />
        )}
        <Button width={'100%'} onClick={handleSubmit} colorScheme="green">
          Submit
        </Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={e => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Select language</FormLabel>
              <Select
                placeholder="Select language"
                name="Language"
                value={data?.language ? data?.language : ''}
                onChange={e => {
                  const value = e.target.value;
                  const data = languages.filter(e => e !== value);
                  setLanguages([...data, value]);
                  setIsOpen(false);
                }}
              >
                {languageOptions.map((e, key) => (
                  <option key={key} value={e?.value}>
                    {e?.text}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

const MoreInput = ({ name, data, setData }) => {
  const [width, setWidth] = React.useState(null);
  const confetiRef = React.useRef(null);
  React.useEffect(() => {
    setWidth(confetiRef.current.clientWidth);
  }, []);
  const title = languageCore.find(e => e.value === name);

  const handleChange = (nameCore, value) => {
    const dataCore = data?.[name] ? data?.[name] : {};
    const valueData = { ...dataCore, [nameCore]: value };
    setData({
      ...data,
      [name]: valueData,
    });
  };

  return (
    <VStack spacing={4} ref={confetiRef}>
      <Text>{title?.text}</Text>
      <FormControl isRequired>
        <Input
          placeholder="Text"
          type="text"
          value={data?.[name]?.text ? data?.[name]?.text : ''}
          onChange={e => handleChange('text', e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <Mic
          name={name}
          onStop={value => {
            handleChange('audio', `${value}`);
          }}
          {...{
            width: width,
            height: 50,
            value: data?.[name]?.audio ? data?.[name]?.audio : null,
          }}
        />
      </FormControl>
    </VStack>
  );
};
