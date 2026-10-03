import { Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';



function LowChargeCard({ equipment }) {

  return (
    <Card variant="outlined" sx={{
        width: "100%",
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}>
      <CardContent> 
        <Typography variant="subtitle1">{equipment.serial_number}
        </Typography>
        <Typography color="text.secondary" gutterBottom>{equipment.model}
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        <Stack direction="row" spacing={1} sx={{alignItems:"center", justifyContent: "center"}} >
          <Chip label={`${equipment.charge_level}%`} color="error" />
          <Chip label={equipment.status} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default LowChargeCard;