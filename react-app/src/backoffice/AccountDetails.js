import React, {useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Footer from "../layout/Footer";

const statusToColor = (status) => {
    switch (status) {
        case "Booked":
            return "success";
        case "Pending":
            return "warning";
        case "Failed":
            return "error";
        default:
            return "default";
    }
};

function AccountDetails() {
    const {id} = useParams();
    const navigate = useNavigate();

    const transactions = useMemo(() => {
        const suffix = (id || "").slice(-4) || "0000";

        return [
            {
                id: `txn_${suffix}_001`,
                createdAt: "2026-01-30 12:41",
                type: "Payment",
                amount: 129.95,
                currency: "EUR",
                status: "Booked",
                reference: `ORDER-${suffix}-A1`,
            },
            {
                id: `txn_${suffix}_002`,
                createdAt: "2026-01-30 11:12",
                type: "Refund",
                amount: -29.99,
                currency: "EUR",
                status: "Pending",
                reference: `REFUND-${suffix}-B2`,
            },
            {
                id: `txn_${suffix}_003`,
                createdAt: "2026-01-29 18:22",
                type: "Payout",
                amount: -250.0,
                currency: "EUR",
                status: "Booked",
                reference: `PAYOUT-${suffix}-C3`,
            },
            {
                id: `txn_${suffix}_004`,
                createdAt: "2026-01-29 16:05",
                type: "Chargeback",
                amount: -59.0,
                currency: "EUR",
                status: "Failed",
                reference: `CB-${suffix}-D4`,
            },
        ];
    }, [id]);

    return (
        <div>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Stack spacing={2} sx={{mb: 3}}>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between">
                        <Box>
                            <Typography variant="h4" component="h1">
                                Account detail
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Account ID: {id || "-"}
                            </Typography>
                        </Box>

                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </Stack>
                </Stack>

                <Paper elevation={1} sx={{p: 3}}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Transactions</Typography>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Reference</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((txn) => (
                                    <TableRow key={txn.id} hover>
                                        <TableCell>
                                            <Typography variant="body2">{txn.createdAt}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {txn.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{txn.type}</TableCell>
                                        <TableCell>{txn.reference}</TableCell>
                                        <TableCell align="right">
                                            {txn.amount.toFixed(2)} {txn.currency}
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="small" label={txn.status} color={statusToColor(txn.status)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Stack>
                </Paper>
            </Container>

            <Footer />
        </div>
    );
}

export default AccountDetails;
