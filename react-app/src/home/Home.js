import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Footer from "../layout/Footer.js";
import Banner from "../layout/Banner.js";


const ADYEN_GREEN = "#0abf53";

const mockLegalEntities = [
    {
        id: "LE322JV223224T5K3Q72F6X42",
        legalName: "Green Grocers BV",
        type: "organization",
        country: "NL",
        status: "active",
    },
    {
        id: "LE0000000000000002",
        legalName: "Ekin's Café",
        type: "soleProprietorship",
        country: "DE",
        status: "pending",
    },
    {
        id: "LE0000000000000003",
        legalName: "Hackathon Merch Ltd",
        type: "organization",
        country: "GB",
        status: "inactive",
    },
];

function Home() {
    const navigate = useNavigate();
    const [legalEntities, setLegalEntities] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isMock, setIsMock] = React.useState(false);

    const loadLegalEntities = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsMock(false);

        try {
            const response = await fetch('/api/legalEntities', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch legal entities (${response.status})`);
            }

            const data = await response.json();

            const entities = Array.isArray(data) ? data : data?.data;
            if (!Array.isArray(entities)) {
                throw new Error('Unexpected response shape');
            }

            setLegalEntities(entities);
        } catch (e) {
            setLegalEntities(mockLegalEntities);
            setIsMock(true);
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadLegalEntities();
    }, [loadLegalEntities]);

    return (
        <div>
            <Container maxWidth="xl">
                <Grid container justifyContent="center">
                    <Banner/>
                </Grid>

                <br/>

                <Container maxWidth="xl" sx={{display: "flex", justifyContent: "center"}}>
                    <Box sx={{ width:"70%"}}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Legal Entities
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {isMock ? "Showing mock data (backend not available)." : "Fetched from your backend."}
                                </Typography>
                                {error ? (
                                    <Typography variant="body2" color="text.secondary">
                                        {error}
                                    </Typography>
                                ) : null}
                            </Box>

                            <Button
                                variant="contained"
                                onClick={loadLegalEntities}
                                disabled={isLoading}
                                sx={{ backgroundColor: ADYEN_GREEN, color: "white", "&:hover": { backgroundColor: "green" } }}
                            >
                                {isLoading ? "Loading..." : "Refresh"}
                            </Button>
                        </Stack>

                        <Grid container spacing={3}>
                            {(legalEntities || []).map((entity) => (

                                <Grid item xs={12} md={6} lg={4} key={entity.id || entity.legalEntityId || entity.legalName}>
                                    <Card>
                                        <CardActionArea
                                            onClick={() => {
                                                const id = entity.id || entity.legalEntityId;
                                                if (!id) {
                                                    return;
                                                }

                                                navigate(`/backoffice/submerchant/${id}`);
                                            }}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {entity.legalName || entity.name || "Unnamed legal entity"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>ID:</strong> {entity.id || entity.legalEntityId || "-"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Type:</strong> {entity.type || "-"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Country:</strong> {entity.country || entity.countryCode || "-"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Status:</strong> {entity.status || "-"}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {!isLoading && (legalEntities || []).length === 0 ? (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No legal entities found.
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                </Container>

            </Container>

            <Footer/>

        </div>
    );

}

export default Home;