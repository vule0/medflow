import { Box, Button, Typography, Card, CardContent, Chip, IconButton, Divider, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useEffect, useState } from "react"
import apiClient from "../../api/client"
import { useAuth } from "../../context/AuthContext";
import { create } from "axios";

function RolesManager() {
    const {hasPermission} = useAuth()
    const [roles, setRoles] = useState([])
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    const [createFormValues, setCreateFormValues] = useState({
        name: "",
        permissions: {}
    })
    
    const fetchRoles = async () => {
        try {
            const response = await apiClient.get("/roles")
            setRoles(response.data)
        }
        catch {

        }
    }
    useEffect(() => {
        fetchRoles()
    }, [])

    const handleCreate = async () => {

    }

    const handleEdit = async (role) => {

    }

    const handleDelete = async (role) => {

    }

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
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={handleDelete}
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
                    <TextField
                        fullWidth
                        label="Role Name"
                        name="name"
                        value={createFormValues.name}
                    />

                </DialogContent>

            </Dialog>

        </Box>
    )

}

export default RolesManager