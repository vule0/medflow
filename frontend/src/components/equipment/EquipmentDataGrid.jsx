import { useEffect, useState } from "react";
import {
    DataGrid,
    GridActionsCellItem
} from "@mui/x-data-grid";

import {
    Alert,
    Box,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    Typography,
    LinearProgress
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function EquipmentDataGrid({ onSuccess }) {
    const { user, role } = useAuth();
    const STATUS_OPTIONS = [
        "Available",
        "In-Use",
        "Maintenance",
        "Offline"
    ];

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const [formValues, setFormValues] = useState({
        serial_number: "",
        model: "",
        status: "Offline",
        charge_level: "",
        hospital_id: ""
    });

    const [editFormValues, setEditFormValues] = useState({
        serial_number: "",
        model: "",
        status: "Offline",
        charge_level: "",
        hospital_id: ""
    });

    async function fetchEquipment() {
        setLoading(true);

        try {

            const endpoint = role == "Field Technician" ? `/equipments/hospital/${user.id}` : "/equipments"
            const response = await apiClient.get(endpoint);

            setEquipment(response.data);
            setError(null);
        } catch {
            setError("Could not load equipment data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEquipment();
    }, []);

    const handleFieldChange = (field) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleEditFieldChange = (field) => (event) => {
        setEditFormValues((prev) => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleCreate = async () => {
        try {
            await apiClient.post("/equipments", {
                ...formValues,
                charge_level: Number(formValues.charge_level),
                hospital_id: Number(formValues.hospital_id)
            });

            setDialogOpen(false);

            onSuccess(
                `Equipment ${formValues.serial_number} created successfully`
            );

            setFormValues({
                serial_number: "",
                model: "",
                status: "Offline",
                charge_level: "",
                hospital_id: ""
            });

            await fetchEquipment();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not create equipment"
            );
        }
    };

    function handleEdit(equipment) {
        setSelectedEquipment(equipment);

        setEditFormValues({
            serial_number: equipment.serial_number,
            model: equipment.model,
            status: equipment.status,
            charge_level: equipment.charge_level,
            hospital_id: equipment.hospital_id
        });

        setEditDialogOpen(true);
    }

    async function handleDelete(equipment) {
        try {
            await apiClient.delete(
                `/equipments/${equipment.id}`
            );

            onSuccess(
                `Equipment ${equipment.serial_number} deleted successfully`
            );

            await fetchEquipment();
        } catch (error) {
            setError(
                "Could not delete equipment. Please try again later"
            );
        }
    }

    async function handleUpdate(equipment) {
        try {
            await apiClient.patch(
                `/equipments/${equipment.id}`,
                {
                    ...editFormValues,
                    charge_level: Number(editFormValues.charge_level),
                    hospital_id: Number(editFormValues.hospital_id)
                }
            );

            setEditDialogOpen(false);

            onSuccess(
                `Equipment ${equipment.serial_number} updated successfully`
            );

            await fetchEquipment();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not update equipment"
            );
        }
    }

    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5
        },
        {
            field: "serial_number",
            headerName: "Serial Number",
            flex: .9
        },
        {
            field: "model",
            headerName: "Model",
            flex: 1.1
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.7
        },
        // {
        //     field: "charge_level",
        //     headerName: "Charge Level (%)",
        //     flex: .7,
        //     type: "number"
        // },
        {
            field: "charge_level",
            headerName: "Battery",
            flex: .7,
            renderCell: (params) => {
                const value = Math.round(params.value)
                const color = value <= 20 ? "error" : value < 50 ? "warning" : "success"

                return (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <LinearProgress
                            variant="determinate"
                            value={value}
                            color={color}
                            sx={{
                                flexGrow: 1,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                },
                            }}
                        />

                        <Typography variant="body2" sx={{
                            minWidth: 38,
                            textAlign: "right",
                        }}>{value}%</Typography>
                    </Box>
                );
            },
        },
        {
            field: "hospital_id",
            headerName: "Hospital ID",
            flex: 0.5,
            type: "number"
        },
        ...(role === "Clinical Admin"
            ? [
                {
                    field: "actions",
                    type: "actions",
                    headerName: "Actions",
                    flex: 0.6,
                    getActions: (params) => [
                        <GridActionsCellItem
                            key="edit"
                            label="Edit"
                            icon={<EditIcon />}
                            onClick={() => handleEdit(params.row)}
                        />,
                        <GridActionsCellItem
                            key="delete"
                            label="Delete"
                            icon={<DeleteIcon />}
                            onClick={() => handleDelete(params.row)}
                        />
                    ]
                }
            ]
            : [])
    ];

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>

        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>

            )}
            {role === "Clinical Admin" && (
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 2 }}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Equipment
                </Button>
            )}

            <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                    hideFooter
                    rows={equipment}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle
                    sx={{
                        color: "black",
                        textAlign: "center"
                    }}
                >
                    Add New Equipment
                </DialogTitle>

                <DialogContent>
                    <Stack
                        spacing={2}
                        sx={{
                            mt: 1,
                            minWidth: 300
                        }}
                    >
                        <TextField
                            label="Serial Number"
                            value={formValues.serial_number}
                            onChange={handleFieldChange("serial_number")}
                        />

                        <TextField
                            label="Model"
                            value={formValues.model}
                            onChange={handleFieldChange("model")}
                        />

                        <TextField
                            select
                            label="Status"
                            value={formValues.status}
                            onChange={handleFieldChange("status")}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Charge Level (%)"
                            type="number"
                            value={formValues.charge_level}
                            onChange={handleFieldChange("charge_level")}
                        />

                        <TextField
                            label="Hospital ID"
                            type="number"
                            value={formValues.hospital_id}
                            onChange={handleFieldChange("hospital_id")}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setDialogOpen(false)}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogTitle
                    sx={{
                        color: "black",
                        textAlign: "center"
                    }}
                >
                    Edit Equipment
                </DialogTitle>

                <DialogContent>
                    <Stack
                        spacing={2}
                        sx={{
                            mt: 1,
                            minWidth: 300
                        }}
                    >
                        <TextField
                            label="Serial Number"
                            value={editFormValues.serial_number}
                            onChange={handleEditFieldChange("serial_number")}
                        />

                        <TextField
                            label="Model"
                            value={editFormValues.model}
                            onChange={handleEditFieldChange("model")}
                        />

                        <TextField
                            select
                            label="Status"
                            value={editFormValues.status}
                            onChange={handleEditFieldChange("status")}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Charge Level (%)"
                            type="number"
                            value={editFormValues.charge_level}
                            onChange={handleEditFieldChange("charge_level")}
                        />

                        <TextField
                            label="Hospital ID"
                            type="number"
                            value={editFormValues.hospital_id}
                            onChange={handleEditFieldChange("hospital_id")}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setEditDialogOpen(false)}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleUpdate(selectedEquipment)}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default EquipmentDataGrid;
