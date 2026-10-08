import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function UserDataGrid({ onSuccess }) {
  const { hasPermission } = useAuth();
// const ROLE_OPTIONS = [
//     "Clinical Admin",
//     "Field Technician",
//     "Auditor"
//   ];
  const [ROLE_OPTIONS, setRoleOptions] = useState([])
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    role_id: "",
  });

  const [editFormValues, setEditFormValues] = useState({
    username: "",
    role_id: ""
  });

  async function getRoles(){
    try{
      const response = await apiClient.get("/roles")
      setRoleOptions(response.data)
    } catch (error){
      console.log(error)
    }
  }
  async function fetchUsers() {
    setLoading(true);

    try {
      const response = await apiClient.get("/users");

      setUsers(response.data);
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Could not load user data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    getRoles();
  }, []);


  const handleFieldChange = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleEditFieldChange = (field) => (event) => {
    setEditFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  async function handleCreate() {
    try {
      console.log(formValues)
      await apiClient.post("/auth/register", formValues);
      console.log(formValues)
      setDialogOpen(false);

      onSuccess(
        `User ${formValues.username} created successfully`
      );

      setFormValues({
        username: "",
        password: "",
        role: "",
      });

      await fetchUsers();
    } catch (error) {
      console.log(error)
      setError("Could not create user");
    }
  }

  function handleEdit(user) {
    console.log("test", user)
    setSelectedUser(user);

    setEditFormValues({
      username: user.username,
      role: user.role_id,
    });

    setEditDialogOpen(true);
  }

  async function handleUpdate(user) {
    try {
      console.log(editFormValues)
      await apiClient.patch(
        `/users/${user.id}`,
        editFormValues
      );

      setEditDialogOpen(false);

      onSuccess(
        `User ${user.username} updated successfully`
      );

      await fetchUsers();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Could not update user"
      );
    }
  }

  async function handleDelete(user) {
    try {
      await apiClient.delete(`/users/${user.id}`);

      onSuccess(
        `User ${user.username} deleted successfully`
      );

      await fetchUsers();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Could not delete user"
      );
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },

    ...(hasPermission("user:write")
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
                onClick={() => handleEdit(params.row)}
              />,

              <GridActionsCellItem
                key="delete"
                label="Delete"
                icon={<DeleteIcon />}
                onClick={() => handleDelete(params.row)}
              />,
            ],
          },
        ]
      : []),
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
      {hasPermission("user:write") && (
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => setDialogOpen(true)}
        >
          Add User
        </Button>
      )}

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          hideFooter
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{color: "text.primary", textAlign: "center"}}>
          Create User
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              size="small"
              fullWidth
              value={formValues.username}
              onChange={handleFieldChange("username")}
            />

            <TextField
              label="Password"
              type="password"
              size="small"
              fullWidth
              value={formValues.password}
              onChange={handleFieldChange("password")}
            />

            <TextField
              select
              label="Role"
              size="small"
              fullWidth
              value={formValues.role_id}
              onChange={handleFieldChange("role_id")}
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
            sx={{color: "text.primary", textAlign: "center"}}>
          Edit User
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              size="small"
              fullWidth
              value={editFormValues.username}
              onChange={handleEditFieldChange("username")}
            />

            <TextField
              select
              label="Role"
              size="small"
              fullWidth
              value={editFormValues.role_id}
              onChange={handleEditFieldChange("role_id")}
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
            color="primary"
            onClick={() => handleUpdate(selectedUser)}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserDataGrid;