
import React from 'react';
import { Button, Tooltip } from '@mui/material';

const TestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <Tooltip title="This is a tooltip" arrow>
        <Button variant="contained">Hover Over Me</Button>
      </Tooltip>
    </div>
  );
};

export default TestPage;
