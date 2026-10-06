import { useEffect, useState } from "react";

import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";

import { Alert, Box, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";


function TechnicianDataGrid({ onSuccess }) {
    const { user } = useAuth();
    const role = user?.role;

    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        hospital_id: ""
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormValues, setEditFormValues] = useState({
        name: "",
        hospital_id: ""
    });

    const [selectedTechnician, setSelectedTechnician] = useState(null);

    async function fetchTechnicians() {
        setLoading(true);
        try {
            const response = await apiClient.get("/technicians");
            setTechnicians(response.data);
            setError(null);
        } catch (error) {
            setError("Could not load hospital data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTechnicians();
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
            await apiClient.post("/technicians", {
                ...formValues,
                hospital_id: Number(formValues.hospital_id)
            });

            setDialogOpen(false);
            setFormValues({
                name: "",
                hospital_id: ""
            });
            onSuccess(`Technician ${formValues.name} created successfully`);
            await fetchTechnicians();
        } catch (error) {
            setError( "Could not create hospital");
        }
    };

    function handleEdit(technician) {
        setSelectedTechnician(technician);
        setEditFormValues({
            name: technician.name,
            hospital_id: technician.hospital_id
        });
        setEditDialogOpen(true);
    }

    async function handleDelete(technician) {
        try {
            await apiClient.delete(`/technicians/${technician.id}`);
            onSuccess(`Technician ${technician.name} deleted successfully`);
            await fetchTechnicians();
        } catch (error) {
            setError( "Could not delete technician. Please try again later");
        }
    }

    async function handleUpdate(technician) {
        try {
            await apiClient.patch(`/technicians/${technician.id}`,
                {...editFormValues,
                    capacity: Number(editFormValues.capacity),
                    supervisor_id: Number(editFormValues.supervisor_id)
                }
            );

            setEditDialogOpen(false);
            onSuccess(`Technician ${editFormValues.name} updated successfully`);
            await fetchTechnicians();
        } catch (error) {
            setError("Could not update Technician");
        }
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5},
        { field: "name", headerName: "Name", flex: 3},
        { field: "hospital_id", headerName: "Hospital ID", flex: .5, type: "number"},
        ...(role === "Clinical Admin"
            ? [
                {
                    field: "actions",
                    type: "actions",
                    headerName: "Actions",
                    flex: 0.7,
                    getActions: (params) => [
                        <GridActionsCellItem
                            key="edit"
                            label="Edit"
                            icon={<EditIcon />}
                            onClick={() =>
                                handleEdit(params.row)
                            }/>,
                        <GridActionsCellItem
                            key="delete"
                            label="Delete"
                            icon={<DeleteIcon />}
                            onClick={() =>
                                handleDelete(params.row)
                            }/>
                    ]
                }
            ] : [])
    ];

    if (loading) {return <CircularProgress />}

    if (error) { return (<Alert severity="error">{error}</Alert>)}

    return (
        <Box>
            {role === "Clinical Admin" && (
                <Button variant="outlined" sx={{ mb: 2 }} onClick={() => setDialogOpen(true)}>Add Technician</Button>
            )}

            <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid  hideFooter rows={technicians} columns={columns} getRowId={(row) => row.id}/>
            </Box>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{color: "text.primary", textAlign: "center" }}>Add New Technician</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Name" value={formValues.name} onChange={handleFieldChange("name")}/>
                        <TextField label="Hospital ID" type="number" value={formValues.hospital_id} onChange={handleFieldChange("hospital_id")}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={() =>setDialogOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle sx={{ color: "text.primary", textAlign: "center" }}>Edit hospital</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Name" value={editFormValues.name} onChange={ handleEditFieldChange("name")}/>
                        <TextField label="Hospital ID" type="number" value={editFormValues.hospital_id} onChange={handleEditFieldChange("hospital_id")}/>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="error" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleUpdate(selectedTechnician)}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>

    );

}


export default TechnicianDataGrid;