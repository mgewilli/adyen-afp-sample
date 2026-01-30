import React, { useState, useEffect } from "react";
import axios from "axios";

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from "@mui/material/Grid";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DashboardHeader from "./DashboardHeader.js";
import DashboardDrawer from "./DashboardDrawer.js";

export default function AccountHolder() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [suspendResponse, setSuspendResponse] = useState(null);
    const [suspendError, setSuspendError] = useState(null);
    const [activateLoading, setActivateLoading] = useState(false);
    const [activateResponse, setActivateResponse] = useState(null);
    const [activateError, setActivateError] = useState(null);

    const handleActivate = () => {
        setActivateLoading(true);
        setActivateResponse(null);
        setActivateError(null);
        axios.get('/api/dashboard/activateAccountHolder')
            .then((response) => {
                setActivateResponse(response.data);
                setActivateLoading(false);
                setData(response.data);
            })
            .catch((error) => {
                console.error('Activate API error:', error);
                setActivateError('Failed to activate Account Holder');
                setActivateLoading(false);
            });
    };

    const handleSuspend = () => {
        setSuspendLoading(true);
        setSuspendResponse(null);
        setSuspendError(null);
        axios.get('/api/dashboard/suspendAccountHolder')
            .then((response) => {
                setSuspendResponse(response.data);
                setSuspendLoading(false);
                setData(response.data);
            })
            .catch((error) => {
                console.error('Suspend API error:', error);
                setSuspendError('Failed to suspend Account Holder');
                setSuspendLoading(false);
            });
    };

    useEffect(() => {
        axios.get('/api/dashboard/getAccountHolder')
          .then((response) => {
            setData(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('API request error:', error);
            setError('Failed to fetch Account Holder data');
            setLoading(false);
          });
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>

            <DashboardHeader/>

            <DashboardDrawer/>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                sx={{ p: 3 }}
            >

                <Toolbar />

                <Divider sx={{ padding: 1 }}>
                    <Chip label="Account Holder" variant="elevated" sx={{ minWidth: 100, fontSize: "20px", backgroundColor: "#0abf53", color: "white" }}/>
                </Divider>

                <br/>

                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress sx={{ color: "#0abf53" }} />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '60%' }}>{error}</Alert>
                )}

                {data && !loading && !error && (
                    <Box style={{ width: '60%', height: '50%'}} textAlign="left" >
                        <Grid container padding={1} >
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    ID:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.id}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Description:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.description || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Legal Entity ID:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.legalEntityId}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Balance Platform:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.balancePlatform}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Status:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.status}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} padding={1}>
                            <Grid item xs={4} >
                                <Typography variant="body" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Reference:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body" color="textSecondary">
                                    {data.reference || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleActivate}
                                disabled={activateLoading}
                            >
                                {activateLoading ? 'Activating...' : 'Activate Account Holder'}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleSuspend}
                                disabled={suspendLoading}
                            >
                                {suspendLoading ? 'Suspending...' : 'Suspend Account Holder'}
                            </Button>
                        </Box>

                        {activateError && (
                            <Alert severity="error" sx={{ mt: 2 }}>{activateError}</Alert>
                        )}

                        {activateResponse && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Account Holder activated successfully. New status: {activateResponse.status}
                            </Alert>
                        )}

                        {suspendError && (
                            <Alert severity="error" sx={{ mt: 2 }}>{suspendError}</Alert>
                        )}

                        {suspendResponse && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Account Holder suspended successfully. New status: {suspendResponse.status}
                            </Alert>
                        )}
                    </Box>
                )}

            </Box>
        </Box>
    );
}
