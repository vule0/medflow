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
  const { role } = useAuth();

const ROLE_OPTIONS = [
    "Clinical Admin",
    "Field Technician",
    "Auditor"
  ];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [editFormValues, setEditFormValues] = useState({
    username: "",
    role: "",
  });

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
      await apiClient.post("/auth/register", formValues);

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
    setSelectedUser(user);

    setEditFormValues({
      username: user.username,
      role: user.role,
    });

    setEditDialogOpen(true);
  }

  async function handleUpdate(user) {
    try {
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
      {role === "Clinical Admin" && (
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
        <DialogTitle sx={{color: "black", textAlign: "center"}}>
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
              value={formValues.role}
              onChange={handleFieldChange("role")}
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
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
            sx={{color: "black", textAlign: "center"}}>
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
              value={editFormValues.role}
              onChange={handleEditFieldChange("role")}
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
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