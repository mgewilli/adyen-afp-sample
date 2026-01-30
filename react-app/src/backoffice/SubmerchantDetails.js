import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";

import {useNavigate, useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Footer from "../layout/Footer";

const defaultFields = [
    {label: "Legal name", value: "Luna Bistro BV"},
    {label: "Merchant category", value: "5812 · Eating Places"}
];

const capabilities = {
    sendToTransferInstrument: {
        allowed: false,
        requested: true,
        transferInstruments: [
            {
                allowed: false,
                id: "SE322KH223222F5GXZFNM3BGP",
                requested: true,
                verificationStatus: "pending"
            }
        ],
        verificationStatus: "pending"
    },
    receivePayments: {
        allowed: false,
        requested: true,
        verificationStatus: "pending"
    },
    sendToBalanceAccount: {
        allowed: false,
        requested: true,
        verificationStatus: "pending"
    },
    receiveFromPlatformPayments: {
        allowed: false,
        requested: true,
        verificationStatus: "pending"
    },
    receiveFromBalanceAccount: {
        allowed: false,
        requested: true,
        verificationStatus: "pending"
    }
};

function SubmerchantDetail() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [submerchant, setSubmerchant] = useState(null);
    const [paymentInstruments, setPaymentInstruments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const handleRowNavigate = (type, id) => {
        navigate(`/backoffice/${type}/${id}`);
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        axios.get(`/api/accountHolders/${id}`)
            .then((response) => {
                setSubmerchant(response.data);
            })
            .catch((e) => {
                console.error("API request error:", e);
                setError("Failed to load sub-merchant details.");
            })
            .finally(() => {
                setLoading(false);
            });
        axios.get(`/api/dashboard/listAccounts/${id}`)
            .then((response) => {
                setPaymentInstruments(response.data);
            })
            .catch((e) => {
                console.error("API request error:", e);
                setError("Failed to load sub-merchant details.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        setTransactionsLoading(true);

        axios.get(`/api/accountHolders/${id}/transactions`)
            .then((response) => {
                setTransactions(response.data || []);
            })
            .catch((e) => {
                console.error("Failed to load transactions:", e);
            })
            .finally(() => {
                setTransactionsLoading(false);
            });
    }, [id]);

    const capabilitiesData = submerchant?.capabilities || capabilities;

    const submerchantInfoFields = useMemo(() => {
        const getValue = (...values) => values.find((v) => v !== undefined && v !== null && v !== "") ?? "-";
        const fallbackMap = new Map(defaultFields.map((f) => [f.label, f.value]));

        return [
            {label: "ID", value: getValue(submerchant?.legalEntityId, id)},
            {
                label: "Name",
                value: getValue(submerchant?.description, submerchant?.legalName, fallbackMap.get("Legal name"))
            },
            {
                label: "Country",
                value: getValue(submerchant?.country, submerchant?.countryCode, fallbackMap.get("Country"))
            },
            {
                label: "Status",
                value: getValue(submerchant?.status, submerchant?.verificationStatus)
            }
        ];
    }, [id, submerchant]);

    return (
        <div>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Stack direction={{xs: "column", sm: "row"}} spacing={2}
                       alignItems={{xs: "flex-start", sm: "center"}}
                       justifyContent="space-between">
                    <Box>
                        <Typography variant="h4" component="h1">
                            Sub-merchant details
                        </Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Stack>

                <Box sx={{borderBottom: 1, borderColor: 'divider', mt: 3}}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Overview" />
                        <Tab label="Transactions" />
                        <Tab label="Actions" />
                    </Tabs>
                </Box>

                {currentTab === 0 && (
                <Grid container spacing={3} sx={{mt: 1}}>
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            <Paper elevation={1} sx={{p: 3}}>
                                <Typography variant="h6" sx={{mb: 2}}>
                                    Sub-merchant information
                                </Typography>
                                {loading && (
                                    <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
                                        <CircularProgress size={24}/>
                                    </Box>
                                )}
                                {error && <Alert severity="error">{error}</Alert>}
                                <Stack spacing={1.5}>
                                    {submerchantInfoFields.map((field) => (
                                        <Box key={field.label}>
                                            <Typography variant="caption" color="text.secondary">
                                                {field.label}
                                            </Typography>
                                            <Typography variant="body1">{field.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>

                            <Paper elevation={1} sx={{p: 3}} style={{display: "none"}}>
                                <Typography variant="h6" sx={{mb: 2}}>
                                    Capabilities
                                </Typography>
                                <Stack spacing={2}>
                                    {Object.entries(capabilitiesData).map(([capability, details]) => (
                                        <Box key={capability}>
                                            <Typography variant="subtitle2" sx={{textTransform: "capitalize"}}>
                                                {capability.replace(/([A-Z])/g, " $1")}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{mt: 0.5, flexWrap: "wrap"}}>
                                                <Chip
                                                    size="small"
                                                    label={details.allowed ? "Allowed" : "Not allowed"}
                                                    color={details.allowed ? "success" : "default"}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={details.requested ? "Requested" : "Not requested"}
                                                    color={details.requested ? "warning" : "default"}
                                                />
                                                <Chip size="small"
                                                      label={`Verification: ${details.verificationStatus}`}/>
                                            </Stack>
                                            {details.transferInstruments && (
                                                <Stack spacing={0.5} sx={{mt: 1}}>
                                                    {details.transferInstruments.map((instrument) => (
                                                        <Box key={instrument.id} sx={{pl: 1}}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Transfer instrument {instrument.id}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1}
                                                                   sx={{mt: 0.3, flexWrap: "wrap"}}>
                                                                <Chip
                                                                    size="small"
                                                                    label={instrument.allowed ? "Allowed" : "Not allowed"}
                                                                />
                                                                <Chip
                                                                    size="small"
                                                                    label={instrument.requested ? "Requested" : "Not requested"}
                                                                />
                                                                <Chip
                                                                    size="small"
                                                                    label={`Verification: ${instrument.verificationStatus}`}
                                                                />
                                                            </Stack>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper elevation={1} sx={{p: 3}}>
                            <Stack spacing={2}>
                                <Typography variant="h6">Accounts</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Identifier</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentInstruments?.filter((acc) => acc.bankAccount)
                                            .map((account) => (
                                                <React.Fragment>
                                                    <TableRow
                                                        hover
                                                        sx={{cursor: "pointer"}}
                                                        onClick={() => handleRowNavigate("accounts", account.id)}
                                                    >
                                                        <TableCell>
                                                            {account?.bankAccount?.iban}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={account.status}/>
                                                        </TableCell>
                                                        <TableCell align="right">

                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        {paymentInstruments?.filter((acc) => acc.card)
                                            .map((account) => {

                                            return (
                                                <React.Fragment key={account.id}>
                                                    <TableRow
                                                        hover
                                                        sx={{cursor: "pointer"}}
                                                        onClick={() => handleRowNavigate("accounts", account.id)}
                                                    >
                                                        <TableCell>
                                                            {account?.card?.number}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={account.status}/>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={1}
                                                                   justifyContent="flex-end">
                                                                <Button size="small" variant="outlined">
                                                                    Review
                                                                </Button>
                                                                <Button size="small" variant="text">
                                                                    Disable
                                                                </Button>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
                )}

                {currentTab === 1 && (
                    <Box sx={{mt: 3}}>
                        <Paper elevation={1} sx={{p: 3}}>
                            <Typography variant="h6" sx={{mb: 2}}>
                                Transactions
                            </Typography>
                            {transactionsLoading && (
                                <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
                                    <CircularProgress size={24}/>
                                </Box>
                            )}
                            {!transactionsLoading && transactions.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    No transactions found for this account holder.
                                </Typography>
                            )}
                            {!transactionsLoading && transactions.length > 0 && (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Transaction ID</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Type</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow key={transaction.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {transaction.created || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {transaction.id || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{
                                                        color: transaction.type === 'Incoming' ? 'success.main' : 'error.main',
                                                        fontWeight: 'medium'
                                                    }}>
                                                        {transaction.amount || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={transaction.status || 'Unknown'} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {transaction.type || '-'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Paper>
                    </Box>
                )}

                {currentTab === 2 && (
                    <Box sx={{mt: 3}}>
                        <Paper elevation={1} sx={{p: 3}}>
                            <Typography variant="h6" sx={{mb: 2}}>
                                Actions
                            </Typography>
                            <Stack spacing={1.5}>
                                <Button variant="outlined" onClick={() => axios.get(`/api/dashboard/suspendAccountHolder/${id}`)}>
                                    Suspend sub-merchant
                                </Button>
                                <Button variant="outlined" onClick={() => axios.get(`/api/dashboard/activateAccountHolder/${id}`)}>
                                    Activate sub-merchant
                                </Button>
                                <Button variant="outlined" onClick={() => console.log("123")}>
                                    Close account
                                </Button>
                            </Stack>
                        </Paper>
                    </Box>
                )}
            </Container>
            <Footer/>
        </div>
    );
}


export default SubmerchantDetail;