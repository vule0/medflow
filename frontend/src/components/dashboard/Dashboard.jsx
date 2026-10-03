import { useState } from "react";

import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";

import BuildIcon from "@mui/icons-material/Build";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AssessmentIcon from '@mui/icons-material/Assessment';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';

import EquipmentDataGrid from "../equipment/EquipmentDataGrid";
import HospitalDataGrid from "../hospital/HospitalDataGrid";
import WorkOrderDataGrid from "../work_order/WorkOrderDataGrid";
import ServiceReportDataGrid from "../service_report/ServiceReportDataGrid";
import Reports from "../reports/Reports";
import TechnicianDataGrid from "../technicians/TechnicianDataGrid";
import UserDataGrid from "../users/UserDataGrid";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 240;
const headerHeight = 64;


function Dashboard() {
    const [selectedPage, setSelectedPage] = useState("reports");
    const [notification, setNotification] = useState(null);
    const {role} = useAuth()
    const menuItems = [
    {
        label: "Reports",
        value: "reports",
        icon: <AssessmentIcon/>
    },
    {
        label: "Equipment",
        value: "equipment",
        icon: <BuildIcon />,
    },
    ...(role !== "Field Technician" ? [{
        label: "Hospitals",
        value: "hospitals",
        icon: <LocalHospitalIcon />,
    }
    ] : []),
    {
        label: "Work Orders",
        value: "workOrders",
        icon: <AssignmentIcon />,
    },
    {
        label: "Service Reports",
        value: "serviceReports",
        icon: <BuildCircleIcon />,
    },
    ...(role !== "Field Technician" ? [
        {
            label: "Technicians",
            value: "technicians",
            icon: <BadgeIcon/>
        }

    ] : []),
    ...(role === "Clinical Admin" ? [
        {
            label: "Users",
            value: "users",
            icon: <GroupIcon/>

        }
    ]: []),

];
    const renderContent = () => {
        switch (selectedPage) {
            case "reports":
                return <Reports />
            case "equipment":
                return <EquipmentDataGrid onSuccess={setNotification}/>;

            case "hospitals":
                return <HospitalDataGrid onSuccess={setNotification} />;

            case "workOrders":
                return <WorkOrderDataGrid onSuccess={setNotification} />;

            case "serviceReports":
                return <ServiceReportDataGrid onSuccess={setNotification}/>;

            case "technicians":
                return <TechnicianDataGrid onSuccess={setNotification}/>
            
            case "users":
                return <UserDataGrid onSuccess={setNotification}/>
            default:
                return <EquipmentDataGrid />;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "calc(100vh - 64x)",
                marginTop: `${headerHeight}px`,
            }}
        >
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        top: `${headerHeight}px`,
                        height: `calc(100vh - ${headerHeight}px)`,
                        overflowY: "auto",
                    },
                }}
            >
                <List sx={{p:0}}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.value}
                            selected={selectedPage === item.value}
                            onClick={() => setSelectedPage(item.value)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.label}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    height: "100%",
                    overflow: "auto",
                    p: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ mb: 2 }}
                >
                    {menuItems.find(
                        (item) => item.value === selectedPage
                    )?.label}
                </Typography>

                {renderContent()}
            </Box>
            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={3000}
                onClose={() => setNotification(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={() => setNotification(null)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Dashboard;