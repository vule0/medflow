import { Box, Button, Typography, Card,Alert, CardContent, FormControlLabel, Chip, IconButton, Divider, Dialog, DialogActions, DialogTitle, DialogContent, TextField, Checkbox } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useEffect, useState } from "react"
import apiClient from "../../api/client"
import { useAuth } from "../../context/AuthContext";

function RolesManager( {onSuccess}) {
    const { hasPermission } = useAuth()
    const [roles, setRoles] = useState([])
    const [error, setError] = useState(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [permissions, setPermissions] = useState([])
    const [createFormValues, setCreateFormValues] = useState({
        name: "",
        permissions: []
    })

    const [editFormValues, setEditFormValues] = useState({
        id: null,
        name: "",
        permissions: []
    })

    const fetchRoles = async () => {
        try {
            const response = await apiClient.get("/roles")
            setRoles(response.data)
            const permissions = await apiClient.get("/roles/permissions/all")
            setPermissions(permissions.data.permissions)
        }
        catch {

        }
    }
    useEffect(() => {
        fetchRoles()
    }, [])

    const handlePermissionChange = (permission) => {
        setCreateFormValues((previous) => {
            const alreadySelected =
                previous.permissions.includes(permission);

            return {
                ...previous,
                permissions: alreadySelected
                    ? previous.permissions.filter(
                        (item) => item !== permission
                    )
                    : [...previous.permissions, permission],
            }
        })
    }
    const handleEditPermissionChange = (permission) => {
        setEditFormValues((previous) => {
            const alreadySelected =
                previous.permissions.includes(permission);

            return {
                ...previous,
                permissions: alreadySelected
                    ? previous.permissions.filter(
                        (item) => item !== permission
                    )
                    : [...previous.permissions, permission],
            };
        });
    };
    const handleCreate = async () => {
        try {
            console.log(createFormValues)
            await apiClient.post("/roles", createFormValues);

            setCreateDialogOpen(false);
            onSuccess(`Role ${createFormValues.name} created successfully`)
            setCreateFormValues({
                name: "",
                permissions: [],
            });

            await fetchRoles();
        } catch (error) {
            console.error("Failed to create role:", error);
        }
    }

    const handleEdit = (role) => {
        console.log(role)
        setEditFormValues({
            id: role.id,
            name: role.name,
            permissions: [...role.permissions]
        })
        setEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        try {
            await apiClient.patch(`/roles/${editFormValues.id}`,
                {
                    permissions: editFormValues.permissions,
                })

            setEditDialogOpen(false);
            onSuccess(`Role ${editFormValues.name} updated successfully`);
            setEditFormValues({
                id: null,
                name: "",
                permissions: [],
            });
            await fetchRoles();
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    }

    const handleDelete = async (role) => {
        try {
            await apiClient.delete(`/roles/${role.id}`)
            onSuccess(`Role ${role.name} deleted successfully`)
            await fetchRoles();
        } catch (error) {
            setError("Could not delete role. Check users table.")
            console.error("Failed to delete role:", error);
        }

    }

     if (error) { return (<Alert severity="error">{error}</Alert>)}
    
    return (
        <Box >
            {hasPermission("role:manage") && (
                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => setCreateDialogOpen(true)}
                >
                    Add Role
                </Button>
            )}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        elevation={0}
                        sx={{
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    mb: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        sx={{ mb: 0.5 }}
                                    >
                                        {role.name}
                                    </Typography>


                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 0.5,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        color="success"
                                        onClick={() => handleEdit(role)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(role)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1.25 }}
                            >
                                Permissions
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.75,
                                }}
                            >
                                {role.permissions.map((permission) => (
                                    <Chip
                                        key={permission}
                                        label={permission}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                fullWidth
                maxWidth="sm">

                <DialogTitle sx={{
                    color: "text.primary",
                    textAlign: "center"
                }}>Create Role</DialogTitle>

                <DialogContent>
                    <Box sx={{ display: "flex" }}>
                        <TextField fullWidth
                            label="Role Name"
                            name="name"
                            value={createFormValues.name}
                            onChange={(event) =>
                                setCreateFormValues((previous) => ({
                                    ...previous,
                                    name: event.target.value,
                                }))
                            }
                        />
                        <DialogActions>
                            <Button onClick={() => setCreateDialogOpen(false)}>
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleCreate}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Box>
                    <Typography

                        variant="subtitle2"
                        sx={{ my: 1 }}
                    >
                        Permissions
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {permissions.map((permission) => (
                            <FormControlLabel
                                key={permission}
                                control={
                                    <Checkbox
                                        checked={createFormValues.permissions.includes(
                                            permission
                                        )}
                                        onChange={() =>
                                            handlePermissionChange(
                                                permission
                                            )
                                        }
                                    />
                                }
                                label={permission}
                            />
                        ))}
                    </Box>

                </DialogContent>

            </Dialog>
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        color: "text.primary",
                        textAlign: "center",
                    }}
                >
                    Edit Role
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        label="Role Name"
                        value={editFormValues.name}
                        margin="normal"
                    />

                    <Typography
                        variant="subtitle2"
                        sx={{ my: 1 }}
                    >
                        Permissions
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {permissions.map((permission) => (
                            <FormControlLabel
                                key={permission}
                                control={
                                    <Checkbox
                                        checked={editFormValues.permissions.includes(
                                            permission
                                        )}
                                        onChange={() =>
                                            handleEditPermissionChange(
                                                permission
                                            )
                                        }
                                    />
                                }
                                label={permission}
                            />
                        ))}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setEditDialogOpen(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )

}

export default RolesManager