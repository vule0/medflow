import { useEffect, useState } from "react";

import {
    DataGrid,
    GridActionsCellItem,
} from "@mui/x-data-grid";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Link
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function ServiceReportDataGrid({ onSuccess = () => { } }) {
    const { user } = useAuth();
    const role = user?.role;

    const [serviceReports, setServiceReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [selectedServiceReport, setSelectedServiceReport] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null)

    const [formValues, setFormValues] = useState({
        work_order_id: "",
        notes: "",
    });

    const [editFormValues, setEditFormValues] = useState({
        work_order_id: "",
        notes: "",
    });

    useEffect(() => {
        fetchServiceReports();
    }, []);

    const fetchServiceReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get("/service_reports");

            setServiceReports(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load service reports.");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditFieldChange = (event) => {
        const { name, value } = event.target;

        setEditFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            const formData = new FormData();

            formData.append("work_order_id", formValues.work_order_id)
            if (selectedFile){
                formData.append("file", selectedFile)
            }
            formData.append("notes", formValues.notes)
            await apiClient.post("/service_reports", formData);

            setDialogOpen(false);

            onSuccess(
                `Service Report for Work Order #${formValues.work_order_id} created successfully`
            );

            setFormValues({
                work_order_id: "",
                notes: "",
            });
            setSelectedFile(null)
            await fetchServiceReports();
        } catch (err) {
            console.error(err);
            setError("Failed to create service report.");
        }
    };

    const handleEdit = (serviceReport) => {
        setSelectedServiceReport(serviceReport);
        setEditFormValues({
            work_order_id: serviceReport.work_order_id ?? "",
            notes: serviceReport.notes ?? "",
        });

        setEditDialogOpen(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setSelectedFile(file);
        setError(null);
    };


    const handleUpdate = async (serviceReport) => {
        try {
            const formData = new FormData()
            formData.append("work_order_id", editFormValues.work_order_id)
            if (selectedFile){
                formData.append("file", selectedFile)
            }
            
            formData.append("notes", editFormValues.notes)
            await apiClient.patch(`/service_reports/${serviceReport.id}`, formData);

            setEditDialogOpen(false);

            onSuccess(
                `Service report ${serviceReport.id} updated successfully`
            );
            setSelectedFile(null)
            await fetchServiceReports();
        } catch (err) {
            console.error(err);
            setError("Failed to update service report.");
        }
    };

    const handleDelete = async (serviceReport) => {
        try {
            await apiClient.delete(`/service_reports/${serviceReport.id}`);

            onSuccess(
                `Service report ${serviceReport.id} deleted successfully`
            );

            await fetchServiceReports();
        } catch (err) {
            console.error(err);
            setError("Failed to delete service report.");
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: .2 },
        { field: 'work_order_id', headerName: "Work Order ID", flex: .5, type: 'number' },
        {
            field: 'file_url', headerName: 'File URL', flex: 1.5,
            renderCell: (params) => {
                return (<Link href={params.value} target="_blank" >{params.value}</Link>)
            }
        },
        { field: 'notes', headerName: 'Notes', flex: 1.5 },
        {
            field: 'created_at', headerName: 'Created At', flex: .7, type: 'dateTime',
            valueGetter: (value) => value ? new Date(value) : null
        },
        ...(role === "Clinical Admin" || role === "Field Technician" ? [{
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: .5,
            getActions: (params) => [
                <GridActionsCellItem
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                    icon={<EditIcon />}
                />,
                ...(role === "Clinical Admin" ? [
                    <GridActionsCellItem
                        key="delete"
                        label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row)}
                    />
                ] : [])

            ]
        }] : [])
    ];

    return (
        <Box>
            {(role === "Clinical Admin" || role === "Field Technician") && (
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Service Report
                </Button>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Box sx={{ height: 500, width: "100%" }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid
                        rows={serviceReports}
                        columns={columns}
                        getRowId={(row) => row.id}
                        hideFooter
                    />
                )}
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => {setDialogOpen(false); setSelectedFile(null)}}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{
                    color: "text.primary",
                    textAlign: "center"
                }}>Add Service Report</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Work Order ID"
                        name="work_order_id"
                        type="number"
                        value={formValues.work_order_id}
                        onChange={handleFieldChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Notes"
                        name="notes"
                        multiline
                        rows={4}
                        value={formValues.notes}
                        onChange={handleFieldChange}
                    />
                    <Grid container spacing={2} sx={{ mt: 2, alignItems: "center", }}>
                        <Grid size={{ xs: 12, sm: 4 }} sx={{ height: "100%" }}>
                            <Button variant="outlined" component="label" fullWidth> Upload File

                                <input
                                    hidden
                                    type="file"
                                    accept=".pdf,application/pdf,.txt,text/plain"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                disabled
                                fullWidth
                                label="Selected File"
                                value={selectedFile?.name || "None"}
                            />
                        </Grid>
                    </Grid>
                    {/* <TextField
                        fullWidth
                        margin="dense"
                        label="File URL"
                        name="file_url"
                        value={formValues.file_url}
                        onChange={handleFieldChange}
                    /> */}


                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Cancel
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
                onClose={() => {setEditDialogOpen(false); setSelectedFile(null)}}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{
                    color: "text.primary",
                    textAlign: "center"
                }}>Edit Service Report</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Work Order ID"
                        name="work_order_id"
                        type="number"
                        value={editFormValues.work_order_id}
                        onChange={handleEditFieldChange}
                    />

                    {/* <TextField
                        fullWidth
                        margin="dense"
                        label="File URL"
                        name="file_url"
                        value={editFormValues.file_url}
                        onChange={handleEditFieldChange}
                    /> */}

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Notes"
                        name="notes"
                        multiline
                        rows={4}
                        value={editFormValues.notes}
                        onChange={handleEditFieldChange}
                    />
                    <Grid container spacing={2} sx={{ mt: 2, alignItems: "center", }}>
                        <Grid size={{ xs: 12, sm: 4 }} sx={{ height: "100%" }}>
                            <Button variant="outlined" component="label" fullWidth> Upload File

                                <input
                                    hidden
                                    type="file"
                                    accept=".pdf,application/pdf,.txt,text/plain"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                disabled
                                fullWidth
                                label="Selected File"
                                value={selectedFile?.name || "None"}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleUpdate(selectedServiceReport)}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ServiceReportDataGrid;