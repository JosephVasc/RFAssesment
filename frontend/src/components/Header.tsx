import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from '../assets/recorded_future.png';

function Header() {
  return (
    <AppBar sx={{ backgroundColor: '#2C2C2C' }}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <img
            src={logo}
            alt="Logo"
            style={{ marginRight: '1em', height: '2rem' }}
          />
          <Typography variant="h6" sx={{ marginLeft: '0.5em' }}>
            CSV Matching Tool Assesment
          </Typography>
          <Link
            href="https://github.com/JosephVasc/RFAassessment"
            target="_blank"
            rel="noopener"
            color="inherit"
            sx={{ textDecoration: 'none', marginLeft: 'auto' }}
          >
            <GitHubIcon />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
