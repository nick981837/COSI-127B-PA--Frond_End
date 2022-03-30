import "../App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from '@mui/material/LinearProgress';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const SensorContainer = () => {
  const getData = () => {
    axios
      .get("https://infinite-bastion-56830.herokuapp.com/sensors/")
      .then((response) => {
        setData(response.data)
        setLoading(false)
      });
  };
  useEffect(() => {
    setLoading(true)
    getData();
  }, []);

  const [sensorId, setSensorId] = useState(null);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [lastCharged, setLastCharged] = useState(
    new Date("2014-08-18T21:11:54")
  );
  const [maintainer, setMaintainer] = useState(null);
  const [lastRead, setLastRead] = useState(new Date("2014-08-18T21:11:54"));
  const [energy, setEnergy] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [workerA, setWorkerA] = useState(null);
  const [workerB, setWorkerB] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [actionType, setActionType] = useState("Add");
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const submit = () => {
    if (actionType === "Add") {
      axios
        .post("https://infinite-bastion-56830.herokuapp.com/sensors/", {
          sensor_id: sensorId,
          x: x,
          y: y,
          last_charged: lastCharged,
          maintainer: maintainer,
          last_read: lastRead,
          energy: energy,
        })
        .then((response) => {
          setAlert(true);
          setAlertMessage(response.data);
          setAlertType("success");
          getData();
        })
        .catch((error) => {
          if (error.response) {
            setAlert(true);
            setAlertMessage(error.response.data.message);
            setAlertType("error");
          }
        });
    } else if (actionType === "Update") {
      axios
        .put("https://infinite-bastion-56830.herokuapp.com/sensors/updateStatus", {
          x: x,
          y: y,
          last_charged: lastCharged,
          energy: energy,
          temperature: temperature,
        })
        .then((response) => {
          setAlert(true);
          setAlertMessage(response.data);
          setAlertType("success");
          getData();
        })
        .catch((error) => {
          if (error.response) {
            setAlert(true);
            setAlertMessage(error.response.data.message);
            setAlertType("error");
          }
        });
    } else if (actionType === "Switch") {
      axios
        .put("https://infinite-bastion-56830.herokuapp.com/sensors/", {
          maintainerOne: workerA,
          maintainerTwo: workerB,
        })
        .then((response) => {
          setAlert(true);
          setAlertMessage(response.data);
          setAlertType("success");
          getData();
        })
        .catch((error) => {
          if (error.response) {
            setAlert(true);
            setAlertMessage(error.response.data.message);
            setAlertType("error");
          }
        });
    } else {
      axios
        .get("https://infinite-bastion-56830.herokuapp.com/sensors/rankings")
        .then((response) => setData(response.data));
    }
  };

  const handleChange = (event) => {
    setActionType(event.target.value);
  };

  return (
    <div>
      {alert ? (
        <Alert severity={alertType} onClose={() => setAlert(false)}>
          {alertMessage}
        </Alert>
      ) : null}
      <Card className="form">
        <div className="title">
          <h2 style={{ marginRight: 10 }}>Sensor</h2>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={actionType}
            label="Action"
            onChange={handleChange}
          >
            <MenuItem value="Add">Add</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Switch">Switch Duties</MenuItem>
            <MenuItem value="Ranking">Get Sensor Ranking</MenuItem>
            <MenuItem value="Read" onClick={()=>getData()}>Read</MenuItem>
          </Select>
        </div>
        <ValidatorForm
          onSubmit={submit}
          onError={(errors) => console.log(errors)}
          className="formContainer"
        >
          <div className="inputContainer">
            {actionType === "Add" ? (
              <TextValidator
                label="Seonsor ID"
                name="Seonsor ID"
                value={sensorId}
                validators={['minNumber:0']}
                errorMessages={['Sensor ID must be positive']}
                onChange={(event) => setSensorId(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Add" || actionType === "Update" ? (
              <TextValidator
                label="X"
                name="X"
                value={x}
                validators={['minNumber:0']}
                errorMessages={['X must be positive']}
                onChange={(event) => setX(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Add" || actionType === "Update" ? (
              <TextValidator
                label="Y"
                name="Y"
                value={y}
                validators={['minNumber:0']}
                errorMessages={['Y must be positive']}
                onChange={(event) => setY(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Add" ? (
              <TextValidator
              label="Maintainer"
              name="Maintainer"
              value={maintainer}
              onChange={(event) => setMaintainer(event.target.value)}
              validators={["minStringLength:9", "maxStringLength:9"]}
              errorMessages={["SSN must have 9 digits", "SSN must have 9 digits"]}
            ></TextValidator>
            ) : null}
            {actionType === "Add" || actionType === "Update" ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Last Charged"
                  onChange={(newValue) => setLastCharged(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : null}
            {actionType === "Add" ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Last Read"
                  onChange={(newValue) => setLastRead(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : null}
            {actionType === "Add" || actionType === "Update" ? (
              <TextValidator
                label="Energy"
                name="Energy"
                value={energy}
                validators={['minNumber:0']}
                errorMessages={['Energy must be positive']}
                onChange={(event) => setEnergy(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Switch" ? (
              <TextField
                label="Worker A name"
                onChange={(event) => setWorkerA(event.target.value)}
                required
              ></TextField>
            ) : null}
            {actionType === "Switch" ? (
              <TextField
                label="Worker B name"
                required
                onChange={(event) => setWorkerB(event.target.value)}
              ></TextField>
            ) : null}
            {actionType === "Update" ? (
              <TextField
                label="Temperature"
                required
                onChange={(event) => setTemperature(event.target.value)}
                type="number  vbnmbnmnbbnv "
              ></TextField>
            ) : null}
          </div>
          {actionType !== "Read"?<Button
            style={{ marginBottom: 10, marginTop: 10, alignSelf: "center" }}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>:null}
        </ValidatorForm>
      </Card>
      <Card variant="outlined">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Sensor ID</TableCell>
                <TableCell align="right">X</TableCell>
                <TableCell align="right">Y</TableCell>
                <TableCell align="right">Maintainer</TableCell>
                <TableCell align="right">Last Charged</TableCell>
                <TableCell align="right">Last Read</TableCell>
                <TableCell align="right">Energy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              ).map((row) => (
                <TableRow
                  key={row.forest_no}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.sensor_id}
                  </TableCell>
                  <TableCell align="right">{row.x}</TableCell>
                  <TableCell align="right">{row.y}</TableCell>
                  <TableCell align="right">{row.maintainer}</TableCell>
                  <TableCell align="right">{row.last_charged}</TableCell>
                  <TableCell align="right">{row.last_read}</TableCell>
                  <TableCell align="right">{row.energy}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        {loading?<LinearProgress />:null}
      </Card>
    </div>
  );
};

export default SensorContainer;
