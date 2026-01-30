import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Footer from "../layout/Footer";

const defaultFields = [
    { label: "Legal name", value: "Luna Bistro BV" },
    { label: "Merchant category", value: "5812 · Eating Places" }
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

const accounts = [
    {
        id: "acc_001",
        type: "Bank account",
        iban: "NL91 ABNA 0417 1643 00",
        status: "Active",
        currency: "EUR",
        cards: [
            {
                id: "card_013",
                type: "Business card",
                last4: "3941",
                status: "Active",
                holder: "Sofia Nguyen"
            }
        ]
    },
    {
        id: "acc_002",
        type: "Payout account",
        iban: "NL12 RABO 0101 3129 74",
        status: "Pending review",
        currency: "EUR",
        cards: []
    }
];

function SubmerchantDetail() {
    const navigate = useNavigate();

    const handleRowNavigate = (type, id) => {
        navigate(`/backoffice/${type}/${id}`);
    };

    return (
        <div>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Sub-merchant detail
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                        <Chip color="success" label="Operational" />
                        <Typography variant="body1" color="text.secondary">
                            Most important status: Active for processing, payouts enabled.
                        </Typography>
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Sub-merchant information
                                </Typography>
                                <Stack spacing={1.5}>
                                    {defaultFields.map((field) => (
                                        <Box key={field.label}>
                                            <Typography variant="caption" color="text.secondary">
                                                {field.label}
                                            </Typography>
                                            <Typography variant="body1">{field.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>

                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Capabilities
                                </Typography>
                                <Stack spacing={2}>
                                    {Object.entries(capabilities).map(([capability, details]) => (
                                        <Box key={capability}>
                                            <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                                                {capability.replace(/([A-Z])/g, " $1")}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
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
                                                <Chip size="small" label={`Verification: ${details.verificationStatus}`} />
                                            </Stack>
                                            {details.transferInstruments && (
                                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                                    {details.transferInstruments.map((instrument) => (
                                                        <Box key={instrument.id} sx={{ pl: 1 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Transfer instrument {instrument.id}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} sx={{ mt: 0.3, flexWrap: "wrap" }}>
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
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Stack spacing={2}>
                                <Typography variant="h6">Accounts</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Identifier</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Card attached</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {accounts.map((account) => {
                                            const hasCards = account.cards && account.cards.length > 0;

                                            return (
                                                <React.Fragment key={account.id}>
                                                    <TableRow
                                                        hover
                                                        sx={{ cursor: "pointer" }}
                                                        onClick={() => handleRowNavigate("accounts", account.id)}
                                                    >
                                                        <TableCell>{account.type}</TableCell>
                                                        <TableCell>
                                                            <Stack spacing={0.3}>
                                                                <Typography variant="body2">{account.iban}</Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {account.currency}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={account.status} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={hasCards ? "Yes" : "No"}
                                                                color={hasCards ? "success" : "default"}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                <Button size="small" variant="outlined">
                                                                    Review
                                                                </Button>
                                                                <Button size="small" variant="text">
                                                                    Disable
                                                                </Button>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                                                            {hasCards ? (
                                                                <Stack spacing={1} sx={{ mt: 0.5 }}>
                                                                    {account.cards.map((card) => (
                                                                        <Stack
                                                                            key={card.id}
                                                                            direction={{ xs: "column", sm: "row" }}
                                                                            spacing={2}
                                                                            alignItems="center"
                                                                            sx={{ flexWrap: "wrap" }}
                                                                        >
                                                                            <Typography variant="body2">
                                                                                {card.type} •••• {card.last4}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {card.holder}
                                                                            </Typography>
                                                                            <Chip size="small" label={card.status} />
                                                                        </Stack>
                                                                    ))}
                                                                </Stack>
                                                            ) : (
                                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                    No cards attached to this account.
                                                                </Typography>
                                                            )}
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

                <Box sx={{ mt: 3 }}>
                    <Link href="/backoffice" underline="hover">
                        Back to backoffice
                    </Link>
                </Box>
            </Container>
            <Footer />
        </div>
    );
}


export default SubmerchantDetail;