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
    TextField
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";


function HospitalDataGrid({ onSuccess }) {
    const { hasPermission } = useAuth();
    const [hospitals, setHospitals] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const [selectedHospital, setSelectedHospital] = useState(null)

    const [formValues, setFormValues] = useState({
        name: "",
        location_region: "",
        capacity: "",
        supervisor_id: ""
    })

    const [editFormValues, setEditFormValues] = useState({
        name: "",
        location_region: "",
        capacity: "",
        supervisor_id: ""
    })
    async function fetchHospitals() {
        setLoading(true)
        try {
            const response = await apiClient.get("/hospitals");
            setHospitals(response.data)
            setError(null)
        } catch {
            setError("Could not load hospital data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHospitals();
    }, [])

    const handleFieldChange = (field) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    const handleEditFieldChange = (field) => (event) => {
        setEditFormValues((prev) => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleCreate = async () => {
        try {
            await apiClient.post("/hospitals", {
                ...formValues,
                capacity: Number(formValues.capacity),
                supervisor_id: Number(formValues.supervisor_id)
            })
            setDialogOpen(false)
            onSuccess(
                `Hospital ${formValues.name} created successfully`
            );

            setFormValues({
                name: "",
                location_region: "",
                capacity: "",
                supervisor_id: ""
            });
            await fetchHospitals()
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not create hospital"
            )
        }
    }


    function handleEdit(hospital) {
        setSelectedHospital(hospital);

        setEditFormValues({
            name: hospital.name,
            location_region: hospital.location_region,
            capacity: hospital.capacity,
            supervisor_id: hospital.supervisor_id
        });

        setEditDialogOpen(true);
    }


    async function handleDelete(hospital) {
        try {
            await apiClient.delete(
                `/hospitals/${hospital.id}`
            );

            onSuccess(
                `Hospital ${hospital.name} deleted successfully`
            );

            await fetchHospitals();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not delete hospital. Please try again later"
            );
        }
    }

    async function handleUpdate(hospital) {
        try {
            await apiClient.patch(
                `/hospitals/${hospital.id}`,
                {
                    ...editFormValues,
                    capacity: Number(formValues.capacity),
                    supervisor_id: Number(formValues.supervisor_id)
                }
            );

            setEditDialogOpen(false);

            onSuccess(
                `Hospital ${hospital.name} updated successfully`
            );

            await fetchHospitals();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not update hospital"
            );
        }
    }


    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "location_region", headerName: "Location Region", flex: .7 },
        { field: "capacity", headerName: "Capacity", flex: .6 },
        { field: "supervisor_id", headerName: "Supervisor ID", flex: .5 },
        ...(hasPermission("hospital:write") ?
            [{
                field: "actions", type: "actions", headerName: "Actions", flex: 0.6,
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
            }]
            : [])]

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

            {hasPermission("hospital:write") && (
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Hospital
                </Button>
            )}

            <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                    hideFooter
                    rows={hospitals}
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
                        color: "text.primary",
                        textAlign: "center"
                    }}
                >
                    Add New Hospital
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
                            label="Name"
                            value={formValues.name}
                            onChange={handleFieldChange("name")}
                        />

                        <TextField
                            label="Location Region"
                            value={formValues.location_region}
                            onChange={handleFieldChange("location_region")}
                        />

                        <TextField
                            label="Capacity"
                            type="number"
                            value={formValues.capacity}
                            onChange={handleFieldChange("capacity")}
                        />

                        <TextField
                            label="Supervisor ID"
                            type="number"
                            value={formValues.supervisor_id}
                            onChange={handleFieldChange("supervisor_id")}
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
                        color: "text.primary",
                        textAlign: "center"
                    }}
                >
                    Edit Hospital
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
                            label="Name"
                            value={editFormValues.name}
                            onChange={handleEditFieldChange("name")}
                        />

                        <TextField
                            label="Location Region"
                            value={editFormValues.location_region}
                            onChange={handleEditFieldChange("location_region")}
                        />

                        <TextField
                            label="Capacity"
                            type="number"
                            value={editFormValues.capacity}
                            onChange={handleEditFieldChange("capacity")}
                        />

                        <TextField
                            label="Supervisor ID"
                            type="number"
                            value={editFormValues.supervisor_id}
                            onChange={handleEditFieldChange("supervisor_id")}
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
                        onClick={() => handleUpdate(selectedHospital)}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )

}

export default HospitalDataGrid;