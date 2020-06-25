import React, { useState, useEffect } from "react";
import UserDestinationsAPI from "./../../components/services/userDestinationsAPI";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import userDestinationsAPI from "../../components/services/userDestinationsAPI";

const Header = () => {
  const [mounted, setMounted] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [cities, setCities] = useState([]);
  const initDestinations = async () => {
    let data = [];
    const destinations = await UserDestinationsAPI.getAllDestinationsByUsers();
    // const ratings = await reviewAPI.getRatings();
    const entries = destinations.entries();
    for (const [i, item] of entries) {
      const result = data.find((row) => row.type === item.Destination.type);
      let row = {
        name: item.Destination.name,
        type: item.Destination.type,
        lat: item.Destination.lat,
        lng: item.Destination.lng
      };
      if (!result) {
        row.type = item.Destination.type;
      } else {
        row.type = "";
      }
      data.push(row);
    }
    console.log({ data });
    setDestinations(data);

    // destinations.map(destination => {
    //   console.log({ destination })
    // })

    for (let i = 0; i < 2; i++) {
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${destinations[i].lat}%2C+${destinations[i].lng}&key=${process.env.REACT_APP_API_KEY_OPENCAGE_GA}`
      )
        .then(function (response) {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }
          response.json().then(function (data) {
            setCities(data);
          });
        })
        .catch(function (err) {
          console.log("Fetch Error :-S", err);
        });
    }
  };
  console.log({ cities })
  useEffect(() => {
    if (mounted) {
      initDestinations()
      setMounted(false)
    }
  }, []);


  return (
    <section id="header-homepage">
      <Container>
        <Typography variant="h1">Trouvez votre agent de voyage</Typography>
        <div className="form-search">
          <form className="" noValidate autoComplete="off">
            <Grid container justify="center" spacing={4}>
              <Grid item>
                <Autocomplete
                  id="free-solo-demo-2"
                  freeSolo
                  options={destinations.map((option) => option.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="outlined-basic-2"
                      label="Quelle région du monde ?"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={destinations.map((option) => option.type)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="outlined-basic"
                      label="Quel type de voyage ?"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" size="large">
                  Rechercher
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Header;
