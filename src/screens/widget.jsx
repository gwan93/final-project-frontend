import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { authContext } from "../AuthProvider";
import {
  Typography,
  Card,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Container,
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    // border: 'red 3px solid'
  },
  historyCard: {
    flexDirection: "column",
  },
  historyContainer: {
    overflowY: "scroll",
    marginTop: "1em",
    padding: 0,
    flexGrow: 1,
    listStyle: "none",
    "&::-webkit-scrollbar": {
      width: "0.3em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(33,33,33,.1)",
    },
    // border: 'green 3px solid',

  },
  card: {
    border: "2px lightgrey solid",
    transition: "box-shadow .1s",
    "&:hover": {
      boxShadow: "0 0 11px rgba(33,33,33,.2)",
    },
  },
  title: {
    margin: "25px 0 50px 0",
    // border: 'orange 3px solid'
  },
  cardContent: {
    flexGrow: 0.5,
  },
  history: {
    marginLeft: "1.5em",
    marginTop: "0em",
    display: "flex",
    justifyContent: "center",
    // border: 'purple 3px solid'

  },
  close: {
    flexGrow: 1,
  },
  main: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    topMargin: "2em",
    // border: 'lightblue 3px solid'
  },
  background: {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://i.imgur.com/WEBV8Q1.gif)`,
    backgroundPosition: "center center",
    // border: 'darkgreen 3px solid',
    marginTop: '75px',
    minHeight: 'calc(100vh - 75px)',
  },
  productDetails: {
    // border: 'red 3px solid',
    margin: '0 5vw 0 5vw',
  }
}));

export default function Widget(props) {
  const classes = useStyles();
  const { state, setState } = useContext(authContext);
  const { widgetID } = useParams();
  const [widget, setWidget] = useState({
    details: {},
    history: [],
  });
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Axios request using widgetID from params to get
  // widget details and widget history
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${process.env.REACT_APP_API_URL}/widgets/${widgetID}`)
      .then((all) => {
        const [detailsResponse, historyResponse] = all.data;
        // Order the history objects by id (oldest first, newest last)
        const sortedResponseData = historyResponse.sort((a, b) => b.id - a.id);
        setWidget((prev) => ({
          ...prev,
          details: detailsResponse,
          history: sortedResponseData,
        }));
      });
  }, [widgetID]);

  const addToCart = () => {
    // Add this widget's id to state.itemsInCart
    const currentCart = [...state.itemsInCart];
    currentCart.push(widget.details.id);
    setState((prev) => ({
      ...prev,
      itemsInCart: currentCart,
    }));
  };

  const displayWidgetHistory = widget.history.map((historyData, index) => {
    // console.log('historyData and index', historyData, index);
    return (
      <div key={historyData.id}>
        <ul>
          <Grid className={classes.historyCard}>
            <Card className={classes.card} variant="outlined">
              <Typography variant="body1" color="textPrimary">
                {/* By:  */}
                {historyData.email} {/* (TransactionID: {historyData.id}) */}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {/* Purchased For:  */}$
                {(historyData.bought_for_price_cents / 100).toFixed(2)}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {`${new Date(historyData.date_purchased).toUTCString()}`}
              </Typography>
            </Card>
          </Grid>
        </ul>
      </div>
    );
  });

  return (
    <div align="center">
      <CssBaseline />
      <div className={classes.background}>
        <div className={classes.productDetails}>
          <Typography variant="h2" className={classes.title}>
            {widget.details.name}
          </Typography>

          <main className={classes.main}>
            <Grid item key={widgetID} xs={12} sm={6} md={6}>
              <Card className={classes.card} variant="outlined">
                <CardMedia title="Image title">
                  <img src={widget.details.imgurl} width="306" alt="" />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {widget.details.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Current Price: $
                    {(widget.details.current_sell_price_cents / 100).toFixed(2)}
                  </Typography>
                  <Typography>
                    NFT # {widget.details.id}: {widget.details.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    className={classes.cardContent}
                    size="small"
                    color="primary"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    className={classes.close}
                    size="small"
                    color="primary"
                    style={{ textDecoration: "none" }}
                    component={Link}
                    to="/widgets"
                  >
                    Back to Marketplace
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AppBar position="static" color="transparent">
                <Tabs value={selectedTab} onChange={handleChange} centered>
                  <Tab label="Details" />
                  <Tab label="Purchase History" />
                </Tabs>
              </AppBar>
              {selectedTab === 0 && "Product details here"}
              {selectedTab === 1 && (
                <Container className={classes.historyContainer}>
                  {displayWidgetHistory}
                </Container>
              )}
              
            </Grid>
          </main>
        </div>

      </div>
    </div>
  );
}
