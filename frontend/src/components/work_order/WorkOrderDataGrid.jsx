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


function WorkOrderDataGrid({ onSuccess = () => { } }) {

    const { user } = useAuth();
    const role = user?.role;

    const PRIORITY_OPTIONS = [
        "Low",
        "Medium",
        "Critical"
    ];

    const STATUS_OPTIONS = [
        "Pending",
        "In-Progress",
        "Completed",
        "Failed"
    ];


    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

    const [formValues, setFormValues] = useState({
        title: "",
        priority: "Low",
        status: "Pending",
        equipment_id: "",
        technician_id: ""
    });


    const [editFormValues, setEditFormValues] = useState({
        title: "",
        priority: "Low",
        status: "Pending",
        equipment_id: "",
        technician_id: ""
    });

    async function fetchWorkOrders() {
        setLoading(true);
        try {
            const response = await apiClient.get("/work_orders");
            setWorkOrders(response.data);
            setError(null);
        } catch {
            setError("Could not load work order data");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWorkOrders();
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

    async function handleCreate() {
        try {
            await apiClient.post("/work_orders", {
                ...formValues,
                equipment_id: Number(formValues.equipment_id),
                technician_id: Number(formValues.technician_id)
            });
            setDialogOpen(false);
            onSuccess(
                `Work order "${formValues.title}" created successfully`
            );

            setFormValues({
                title: "",
                priority: "Low",
                status: "Pending",
                equipment_id: "",
                technician_id: ""
            });
            await fetchWorkOrders();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not create work order"
            );
        }
    }
    function handleEdit(workOrder) {
        setSelectedWorkOrder(workOrder);
        setEditFormValues({
            title: workOrder.title,
            priority: workOrder.priority,
            status: workOrder.status,
            equipment_id: workOrder.equipment_id,
            technician_id: workOrder.technician_id
        });
        setEditDialogOpen(true);
    }

    async function handleDelete(workOrder) {
        try {
            await apiClient.delete(
                `/work_orders/${workOrder.id}`
            );
            onSuccess(
                `Work order "${workOrder.title}" deleted successfully`
            );
            await fetchWorkOrders();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not delete work order. Please try again later"
            );
        }
    }

    async function handleUpdate(workOrder) {
        try {
            await apiClient.patch(
                `/work_orders/${workOrder.id}`,
                {
                    ...editFormValues,
                    equipment_id: Number(
                        editFormValues.equipment_id
                    ),
                    technician_id: Number(
                        editFormValues.technician_id
                    )
                }
            );
            setEditDialogOpen(false);
            onSuccess(
                `Work order "${workOrder.title}" updated successfully`
            );
            await fetchWorkOrders();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Could not update work order"
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
            field: "title",
            headerName: "Title",
            flex: 1.5
        },
        {
            field: "priority",
            headerName: "Priority",
            flex: 0.8
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1
        },
        {
            field: "equipment_id",
            headerName: "Equipment ID",
            flex: 0.8,
            type: "number"
        },
        {
            field: "technician_id",
            headerName: "Technician ID",
            flex: 0.8,
            type: "number"
        },
        ...((role === "Clinical Admin" || role === "Field Technician")
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
                            }
                        />,

                        ...(role === "Clinical Admin" ?
                            [<GridActionsCellItem
                                key="delete"
                                label="Delete"
                                icon={<DeleteIcon />}
                                onClick={() =>
                                    handleDelete(params.row)
                                }
                            />] : [])
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
            {role === "Clinical Admin" && (
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Work Order
                </Button>
            )}

            <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                    hideFooter
                    rows={workOrders}
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
                    Add New Work Order
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
                            label="Title"
                            value={formValues.title}
                            onChange={handleFieldChange("title")}
                        />
                        <TextField
                            select
                            label="Priority"
                            value={formValues.priority}
                            onChange={handleFieldChange("priority")}
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >{option}
                                </MenuItem>
                            ))}
                        </TextField>
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
                            label="Equipment ID"
                            type="number"
                            value={formValues.equipment_id}
                            onChange={handleFieldChange("equipment_id")}
                        />

                        <TextField
                            label="Technician ID"
                            type="number"
                            value={formValues.technician_id}
                            onChange={handleFieldChange("technician_id")}
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
                    Edit Work Order
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
                            disabled={role === "Field Technician"}
                            label="Title"
                            value={editFormValues.title}
                            onChange={handleEditFieldChange("title")}
                        />
                        <TextField
                            disabled={role === "Field Technician"}
                            select
                            label="Priority"
                            value={editFormValues.priority}
                            onChange={handleEditFieldChange("priority")}
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
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
                            disabled={role === "Field Technician"}
                            label="Equipment ID"
                            type="number"
                            value={editFormValues.equipment_id}
                            onChange={handleEditFieldChange("equipment_id")}
                        />
                        <TextField
                            disabled={role === "Field Technician"}
                            label="Technician ID"
                            type="number"
                            value={editFormValues.technician_id}
                            onChange={handleEditFieldChange("technician_id")}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                            setEditDialogOpen(false)
                        }
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() =>
                            handleUpdate(selectedWorkOrder)
                        }
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


export default WorkOrderDataGrid;