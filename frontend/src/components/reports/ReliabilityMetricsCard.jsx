import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
} from "@mui/material";

function ReliabilityMetricsCard({ metric }) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
          }}
        >
          {metric.equipment_model}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>

            <Chip
              label={metric.completed_work_orders}
              color="success"
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Active
            </Typography>

            <Chip
              label={metric.incomplete_work_orders}
              // color="warning"
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Failed
            </Typography>

            <Chip
              label={metric.failed_work_orders}
              color="error"
              size="small"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ReliabilityMetricsCard;