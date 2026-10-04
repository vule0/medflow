import { Card, CardContent, Typography, Chip, Stack, Divider } from '@mui/material';



function LowChargeCard({ equipment }) {
  const color = equipment.charge_level <= 20 ? "error" : equipment.charge_level < 50 ? "warning" : "success"
  return (
    <Card variant="outlined" >
      <CardContent> 
        <Typography noWrap variant="subtitle1">{equipment.serial_number}
        </Typography>
        <Typography color="text.secondary" gutterBottom>{equipment.model}
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        <Stack direction="row" spacing={1} sx={{alignItems:"center", justifyContent: "center"}} >
          <Chip label={`${equipment.charge_level}%`} color={color} />
          <Chip label={equipment.status} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default LowChargeCard;