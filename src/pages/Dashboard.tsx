import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/editor/pages')
      .then((res) => res.json())
      .then((pages) => setPages(pages));
  });

  return (
    <Box>
      {pages.map((page) => (
        <Box key={page}>
          <Link to={`/editor/${page}`}>{page}</Link>
        </Box>
      ))}
    </Box>
  );
};
