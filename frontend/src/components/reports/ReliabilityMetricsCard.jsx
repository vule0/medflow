import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';



function ReliabilityMetricsCard({ metric }) {

  return (
    <Card variant="outlined" sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography variant="subtitle1" component="div">{metric.equipment_model}
        </Typography>
        <Stack >
          <Typography variant="body2">Completed: {metric.completed_work_orders}</Typography>
          <Typography variant="body2">Failed: {metric.failed_work_orders}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ReliabilityMetricsCard;