import {DataGrid} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { Alert, Box, CircularProgress, FormControl, Select, MenuItem, InputLabel, IconButton} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';

const columns = [
    {field: 'work_order_id', headerName: 'Work Order ID', flex: .6},
    {field: 'title', headerName: 'Title', flex: 1},
    {field: 'equipment_hospital_id', headerName: 'Equipment Hospital ID', flex: .6, type:'number'},
    {field: 'technician_hospital_id', headerName: 'Technician Hospital ID', flex: .6, type:'number'}
];

const PRIORITY_OPTIONS = ['', 'Low', 'Medium', 'Critical'];

function DiscrepancyDataGrid() {
    const [discrepancies, setDiscrepancies] = useState([]);
    const [priority, setPriority] = useState('')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    async function fetchDiscrepancies(){
            setLoading(true)
            try{
                const response = await apiClient.get('/work_orders/discrepancies', {params: { priority: priority || undefined}})
                setDiscrepancies(response.data)

            } catch {
                setError('Could not find any discrepancies')
            } finally{
                setLoading(false);
            }  
        }

    useEffect(() => {

        fetchDiscrepancies();
    }, [priority])

    return(
         <Box>
            <FormControl size="small" sx={{mb: 2, minWidth: 200}}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
                value={priority}
                labelId='priority-filter-label'
                label="priority"
                onChange={(event) => {setPriority(event.target.value)}}
                >
                    {PRIORITY_OPTIONS.map((option) => (
                        <MenuItem key={option || 'all'} value={option}>{option=== '' ? 'All' : option}</MenuItem>
                    ))}
                </Select>
            
                </FormControl>
                 {/* <IconButton
                onClick={fetchDiscrepancies}
                sx={{ cursor: 'pointer' }}
                aria-label="Refresh discrepancies"
            >
                <RefreshIcon />
            </IconButton> */}
                {error && <Alert severity='error'>{error}</Alert>}
                {!loading && !error &&  (<DataGrid  hideFooter rows={discrepancies} columns={columns} loading={loading} getRowId={(row)=>row.work_order_id}/>) }
        </Box>
    )

}

export default DiscrepancyDataGrid;