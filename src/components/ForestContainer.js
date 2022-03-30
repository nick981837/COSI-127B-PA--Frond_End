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

const ForestContainer = () => {
  const getData = () => {
    axios
      .get("https://infinite-bastion-56830.herokuapp.com/forests/")
      .then((response) =>{
        setData(response.data)
        setLoading(false)
      } );
  };
  useEffect(() => {
    setLoading(true)
    getData();
    // setLoading(false)
  }, []);

  const [name, setName] = useState(null);
  const [state, setState] = useState(null);
  const [area, setArea] = useState(null);
  const [acid_level, setAcidLevel] = useState(null);
  const [mbr_xmin, setMbrXmin] = useState(null);
  const [mbr_xmax, setMbrXmax] = useState(null);
  const [mbr_ymin, setMbrYmin] = useState(null);
  const [mbr_ymax, setMbrYmax] = useState(null);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [actionType, setActionType] = useState("Save");
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
    if (actionType === "Save") {
      axios
        .post("https://infinite-bastion-56830.herokuapp.com/forests/", {
          name: name,
          area: area,
          acid_level: acid_level,
          mbr_xmin: mbr_xmin,
          mbr_xmax: mbr_xmax,
          mbr_ymin: mbr_ymin,
          mbr_ymax: mbr_ymax,
          state: state,
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
        .put("https://infinite-bastion-56830.herokuapp.com/forests/", {
          name: name,
          area: area,
          state: state,
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
          <h2 style={{ marginRight: 10 }}>Forest</h2>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={actionType}
            label="Action"
            onChange={handleChange}
          >
            <MenuItem value="Save">Add</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Read" onClick={()=>getData()}>Read</MenuItem>
          </Select>
        </div>
        <ValidatorForm
          onSubmit={submit}
          onError={(errors) => console.log(errors)}
          className="formContainer"
        >
          <div className="inputContainer">
          {actionType === "Save" || actionType === "Update" ?<TextField
              label="Forest Name"
              onChange={(event) => setName(event.target.value)}
              name="name"
              value={name}
              required
            ></TextField>:null}
          {actionType === "Save" || actionType === "Update"?<TextValidator
              label="Area"
              name="Area"
              value={area}
              validators={['minNumber:0']}
              errorMessages={['Area must be positive']}
              onChange={(event) => setArea(event.target.value)}
              type="number"
              required
            ></TextValidator>:null}
            {actionType === "Save" ? (
              <TextValidator
                label="Acid Level"
                name="Acid Level"
                value={acid_level}
                validators={['minNumber:0']}
                errorMessages={['Acid Level must be positive']}
                onChange={(event) => setAcidLevel(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Save" ? (
              <TextValidator
                label="Mbr_xmin"
                name="Mbr_xmin"
                value={mbr_xmin}
                validators={['minNumber:0']}
                errorMessages={['Mbr_xmin must be positive']}
                onChange={(event) => setMbrXmin(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Save" ? (
              <TextValidator
                label="Mbr_xmax"
                name="Mbr_xmax"
                value={mbr_xmax}
                validators={['minNumber:0']}
                errorMessages={['Mbr_xmax must be positive']}
                onChange={(event) => setMbrXmax(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Save" ? (
              <TextValidator
                label="Mbr_ymin"
                name="Mbr_ymin"
                value={mbr_ymin}
                validators={['minNumber:0']}
                errorMessages={['Mbr_ymin must be positive']}
                onChange={(event) => setMbrYmin(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Save" ? (
              <TextValidator
                label="Mbr_ymax"
                name="Mbr_ymax"
                value={mbr_ymax}
                validators={['minNumber:0']}
                errorMessages={['Mbr_ymax must be positive']}
                onChange={(event) => setMbrYmax(event.target.value)}
                required
                type="number"
              ></TextValidator>
            ) : null}
            {actionType === "Save" || actionType === "Update"?<TextField
              value={state}
              label="State"
              required
              onChange={(event) => setState(event.target.value)}
            ></TextField>:null}
          </div>
          {actionType === "Save" || actionType === "Update"?<Button
            style={{ marginBottom: 10, marginTop: 10, alignSelf: "center" }}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>:null}
        </ValidatorForm>
      </Card>
      <Card variant="outlined">
      {/* <CircularProgress /> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Forest No</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Area</TableCell>
                <TableCell align="right">Acid Level</TableCell>
                <TableCell align="right">Mbr XMIn</TableCell>
                <TableCell align="right">Mbr XMax</TableCell>
                <TableCell align="right">Mbr YMIn</TableCell>
                <TableCell align="right">Mbr YMax</TableCell>
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
                    {row.forest_no}
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.area}</TableCell>
                  <TableCell align="right">{row.acid_level}</TableCell>
                  <TableCell align="right">{row.mbr_xmin}</TableCell>
                  <TableCell align="right">{row.mbr_xmax}</TableCell>
                  <TableCell align="right">{row.mbr_ymin}</TableCell>
                  <TableCell align="right">{row.mbr_ymax}</TableCell>
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

export default ForestContainer;
