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
        legalName: "Bruce's Café",
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
    const [page, setPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [totalElements, setTotalElements] = React.useState(0);
    const pageSize = 10;

    const loadLegalEntities = React.useCallback(async (pageNum = 0) => {
        setIsLoading(true);
        setError(null);
        setIsMock(false);

        try {
            const response = await fetch(`/api/accountHolders?page=${pageNum}&size=${pageSize}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch account holders (${response.status})`);
            }

            const data = await response.json();

            // Handle paginated response
            if (data.content && Array.isArray(data.content)) {
                setLegalEntities(data.content);
                setPage(data.page);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } else {
                throw new Error('Unexpected response shape');
            }
        } catch (e) {
            setLegalEntities(mockLegalEntities);
            setIsMock(true);
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadLegalEntities(page);
    }, [loadLegalEntities, page]);

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
                                    Account Holders
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {isMock ? "Showing mock data (backend not available)." : `Showing ${legalEntities.length} of ${totalElements} account holders`}
                                </Typography>
                                {error ? (
                                    <Typography variant="body2" color="text.secondary">
                                        {error}
                                    </Typography>
                                ) : null}
                            </Box>

                            <Button
                                variant="contained"
                                onClick={() => loadLegalEntities(page)}
                                disabled={isLoading}
                                sx={{ backgroundColor: ADYEN_GREEN, color: "white", "&:hover": { backgroundColor: "green" } }}
                            >
                                {isLoading ? "Loading..." : "Refresh"}
                            </Button>
                        </Stack>

                        {!isMock && totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0 || isLoading}
                                >
                                    Previous
                                </Button>
                                <Typography variant="body1">
                                    Page {page + 1} of {totalPages}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1 || isLoading}
                                >
                                    Next
                                </Button>
                            </Box>
                        )}

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