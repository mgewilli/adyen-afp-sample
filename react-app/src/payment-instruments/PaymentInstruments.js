import React, { useState } from "react";
import axios from "axios";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import Footer from "../layout/Footer.js";
import SmallBanner from "../layout/SmallBanner.js";

function PaymentInstruments() {

    const [balanceAccountCode, setBalanceAccountCode] = useState("");
    const [paymentInstruments, setPaymentInstruments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPaymentInstruments(null);

        axios.get(`/api/balance-accounts/${balanceAccountCode}/payment-instruments`)
            .then((response) => {
                setPaymentInstruments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Request error:', error);
                setError(error.response?.data?.message || 'Failed to fetch payment instruments');
                setLoading(false);
            });
    };

    return (
        <div>
            <Container maxWidth="md">
                <Grid container justify="center">
                    <SmallBanner/>
                </Grid>
                <br/>
                <Box textAlign="center">
                    <Typography variant="h4" style={{ fontWeight: "bold" }} color="textSecondary">
                        Payment Instruments
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2, mt: 3 }}>
                        <TextField
                            label="Balance Account Code"
                            name="balanceAccountCode"
                            value={balanceAccountCode}
                            onChange={(e) => setBalanceAccountCode(e.target.value)}
                            fullWidth
                            required
                            placeholder="e.g., BA3222Z223226D5K3LQ7N6M8B"
                        />
                    </Box>

                    <Box textAlign="right">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ backgroundColor: "#0abf53", color: "white", "&:hover": {backgroundColor: "green"} }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Payment Instruments"}
                        </Button>
                    </Box>
                </form>

                {error && (
                    <Box sx={{ mt: 3 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {paymentInstruments && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Results: {paymentInstruments.paymentInstruments?.length || 0} instrument(s) found
                        </Typography>

                        {paymentInstruments.paymentInstruments && paymentInstruments.paymentInstruments.length > 0 ? (
                            paymentInstruments.paymentInstruments.map((instrument, index) => (
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary">
                                            {instrument.type || 'Unknown Type'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>ID:</strong> {instrument.id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Status:</strong> {instrument.status}
                                        </Typography>
                                        {instrument.description && (
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Description:</strong> {instrument.description}
                                            </Typography>
                                        )}
                                        {instrument.card && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2">
                                                    <strong>Brand:</strong> {instrument.card.brand?.toUpperCase()} {instrument.card.brandVariant && `(${instrument.card.brandVariant})`}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Number:</strong> {instrument.card.number}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Expiry:</strong> {instrument.card.expiration?.month}/{instrument.card.expiration?.year}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Cardholder:</strong> {instrument.card.cardholderName}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Form Factor:</strong> {instrument.card.formFactor}
                                                </Typography>
                                            </Box>
                                        )}
                                        {instrument.bankAccount && (
                                            <Box sx={{ mt: 1 }}>
                                                {instrument.bankAccount.iban && (
                                                    <Typography variant="body2">
                                                        <strong>IBAN:</strong> {instrument.bankAccount.iban}
                                                    </Typography>
                                                )}
                                                {instrument.bankAccount.accountNumber && (
                                                    <Typography variant="body2">
                                                        <strong>Account Number:</strong> {instrument.bankAccount.accountNumber}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2">
                                                    <strong>Type:</strong> {instrument.bankAccount.type}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Form Factor:</strong> {instrument.bankAccount.formFactor}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Alert severity="info">No payment instruments found for this balance account.</Alert>
                        )}
                    </Box>
                )}
            </Container>
            <Footer/>
        </div>
    );
}

export default PaymentInstruments;
