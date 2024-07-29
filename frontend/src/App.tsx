// src/App.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import CSVComposer from './composers/CSVComposer';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Container>
      <Header />
      <Box my={10}>
        <CSVComposer />
      </Box>
    </Container>
  );
};

export default App;
