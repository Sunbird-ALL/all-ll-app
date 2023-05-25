//assests
import leena_audio from '../../assests/Audio/leena_audio.m4a';
import long_para from '../../assests/Audio/long_para.m4a';

// const SchemaData = localStorage.getItem("contents");
// const content_list = SchemaData ? JSON.parse(SchemaData) : {};

const SchemaData = localStorage.getItem('contents');
const data = SchemaData;
// localStorage.removeItem('contents');
const content_list = data ? JSON.parse(data) : {};
export default content_list;

export const getContentList = () => {
  const SchemaData = localStorage.getItem('contents');
  return SchemaData ? JSON.parse(SchemaData) : {};
};
