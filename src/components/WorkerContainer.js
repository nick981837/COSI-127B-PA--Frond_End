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

const WorkerContainer = () => {
  const getData = () => {
    axios
      .get("https://infinite-bastion-56830.herokuapp.com/workers/")
      .then((response) => {
        setData(response.data)
        setLoading(false)
      });
  };
  useEffect(() => {
    setLoading(true)
    getData();
  }, []);

  const [name, setName] = useState(null);
  const [ssn, setSsn] = useState(null);
  const [rank, setRank] = useState(null);
  const [employingState, setEmployingState] = useState(null);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [actionType, setActionType] = useState("Add");
  const [k, setK] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        .post("https://infinite-bastion-56830.herokuapp.com/workers/", {
          name: name,
          ssn: ssn,
          rank: rank,
          employing_state: employingState,
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
        .get("https://infinite-bastion-56830.herokuapp.com/workers/" + k, {})
        .then((response) => {
          if (response.data.length === 0) {
            setAlert(true);
            setAlertMessage("No busy workers");
            setAlertType("warning");
          }
          setData(response.data);
        })
        .catch((error) => {
          if (error.response) {
            setAlert(true);
            setAlertMessage(error.response.data.message);
            setAlertType("error");
          }
        });
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
          <h2 style={{ marginRight: 10 }}>Worker</h2>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={actionType}
            label="Action"
            onChange={handleChange}
          >
            <MenuItem value="Add">Add</MenuItem>
            <MenuItem value="Get Top K">Get Top K</MenuItem>
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
              <TextField
                label="Name"
                onChange={(event) => setName(event.target.value)}
                required
              ></TextField>
            ) : null}
            {actionType === "Add" ? (
              <TextValidator
                label="SSN"
                onChange={(event) => setSsn(event.target.value)}
                name="SSN"
                value={ssn}
                validators={["minStringLength:9", "maxStringLength:9"]}
                errorMessages={["SSN must have 9 digits", "SSN must have 9 digits"]}
              ></TextValidator>
            ) : null}
            {actionType === "Add" ? (
              <TextValidator
                label="rank"
                name="rank"
                value={rank}
                validators={['minNumber:0']}
                errorMessages={['Rank must be positive']}
                onChange={(event) => setRank(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Add" ? (
              <TextField
                label="Employing State"
                onChange={(event) => setEmployingState(event.target.value)}
                required
              ></TextField>
            ) : null}
            {actionType === "Get Top K" ? (
              <TextField
                label="K value"
                onChange={(event) => setK(event.target.value)}
                validators={["required"]}
                errorMessages={["this field is required"]}
                required
                type="number"
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
                <TableCell>SSN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Employing State</TableCell>
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
                  key={row.ssn}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.ssn}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.employing_state}</TableCell>
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

export default WorkerContainer;
