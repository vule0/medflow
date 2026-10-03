import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';



function HospitalMaintenanceCard({ hospital }) {

  return (
    <Card variant="outlined" sx={{
        width: "100%",
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" component="div">{hospital.hospital_name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>Hospital ID: {hospital.hospital_id}
        </Typography>
        <Stack  spacing={1} sx={{alignItems:"center", justifyContent: "center"}} >
          <Chip label={`Total Equipment: ${hospital.total_equipment}`} color="" />
          <Chip label={`${hospital.maintenance_percentage}% under maintenance`} color="warning"/>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default HospitalMaintenanceCard;