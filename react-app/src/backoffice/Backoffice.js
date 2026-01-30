import React, { useState } from "react";
import axios from "axios";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from '@mui/material/Link';

import { useNavigate } from 'react-router-dom';

import Footer from "../layout/Footer.js";
import SmallBanner from "../layout/SmallBanner.js";
import ErrorMessage from "../util/ErrorMessage.js";

function Backoffice() {

    return (
        <div>
            <Container maxWidth="sm">
                <h1> HI BHAVESH </h1>
            </Container>
            <Footer/>
        </div>
  );
}


export default Backoffice;