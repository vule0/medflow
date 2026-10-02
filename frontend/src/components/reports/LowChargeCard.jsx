import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';



function LowChargeCard({ equipment }) {

  return (
    <Card variant="outlined" sx={{ minWidth: 240 }}>
      <CardContent>
        <Typography variant="subtitle1" component="div">{equipment.serial_number}
        </Typography>
        <Typography color="text.secondary" gutterBottom>{equipment.model}
        </Typography>
        <Stack direction="row" spacing={1} sx={{alignItems:"center", justifyContent: "center"}} >
          <Chip label={`${equipment.charge_level}%`} color="error" />
          <Chip label={equipment.status} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default LowChargeCard;