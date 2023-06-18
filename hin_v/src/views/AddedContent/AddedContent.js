import React, { useState, useEffect } from 'react';

import content_list from '../../utils/Const/Const';

function AddedContent() {
  return <p>{localStorage.getItem('contents')} </p>;
}

export default AddedContent;
