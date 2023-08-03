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
