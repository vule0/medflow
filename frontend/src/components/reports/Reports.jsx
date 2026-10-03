import { useEffect, useState } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Stack,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import apiClient from "../../api/client";

import LowChargeCard from "./LowChargeCard";
import ReliabilityMetricsCard from "./ReliabilityMetricsCard";
import HospitalMaintenanceCard from "./HospitalMaintenanceCard";
import SupervisorLines from "./SupervisorLines";
import DiscrepancyDataGrid from "./DiscrepanciesDataGrid";
function Reports() {
    const [lowChargeEquipment, setLowChargeEquipment] = useState([]);
    const [reliabilityMetrics, setReliabilityMetrics] = useState([]);
    const [maintenanceHospitals, setMaintenanceHospitals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [chargeThreshold, setChargeThreshold] = useState(20);

    async function fetchReports() {
        setLoading(true);

        try {
            const [
                lowChargeResponse,
                reliabilityMetricsResponse,
                maintenanceResponse,
            ] = await Promise.all([
                apiClient.get(
                    `/reports/low-charge-equipment?charge_level=${chargeThreshold}`
                ),
                apiClient.get("/reports/reliability"),
                apiClient.get("/reports/hospital-maintenance-flags"),
            ]);

            setLowChargeEquipment(lowChargeResponse.data);
            setReliabilityMetrics(reliabilityMetricsResponse.data);
            setMaintenanceHospitals(maintenanceResponse.data);

            setError(null);
        } catch (err) {
            console.error(err);
            setError("Could not load reports");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReports();
    }, [chargeThreshold]);

    return (
        <Box
            sx={{
                justifyContent: "left",
                px: 5,
                mt: 4,
            }}
        >
            <Accordion defaultExpanded sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                        Low Charge Equipment
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "left",
                            mb: 3,
                        }}
                    >
                        <TextField
                            sx={{ width: 160 }}
                            label="Charge Threshold"
                            type="number"
                            size="small"
                            value={chargeThreshold}
                            onChange={(event) =>
                                setChargeThreshold(event.target.value)
                            }
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    max: 100,
                                },
                                input: {
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                },
                            }}
                        />
                    </Stack>

                    <Grid container spacing={2}>
                        {lowChargeEquipment.map((equipment) => (
                            <Grid size={3} key={equipment.id}>
                                <LowChargeCard equipment={equipment} />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                        Co-Location Discrepancies
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <DiscrepancyDataGrid />
                </AccordionDetails>
            </Accordion>


            <Accordion defaultExpanded sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                        Reliability Metrics
                    </Typography>

                </AccordionSummary>
                <AccordionDetails variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0,
                        mb: 2,
                        textAlign: "left",

                    }}
                >
                    <Typography sx={{ mb: 3 }}> Displays the number of completed, open, and failed work orders
                        for each equipment model.</Typography>
                    <Grid container spacing={2}>
                        {reliabilityMetrics.map((metric) => (
                            <Grid size={4} key={metric.equipment_model}>
                                <ReliabilityMetricsCard metric={metric} />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Grid container spacing={2}>
                <Grid size={7}>
                    <Accordion defaultExpanded sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                                Hospital Maintenance
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {maintenanceHospitals.map((hospital) => (
                                    <Grid key={hospital.hospital_id}>
                                        <HospitalMaintenanceCard
                                            hospital={hospital}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid size={5}>
                    <Accordion defaultExpanded sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                                Supervisor Lookup
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <SupervisorLines />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}

export default Reports;