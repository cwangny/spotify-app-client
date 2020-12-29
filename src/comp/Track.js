import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 150
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 150,
    height: 150
  },
}));

function Track(props) {
  const classes = useStyles();
  const theme = useTheme();
  
  return (
    <Card className={classes.root} style={{backgroundColor: "#e0e0e0"}}>
      <CardMedia
        className={classes.cover}
        image={props.item.imageData.url}
        title="Rosé throw it bacc"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {props.item.songName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.item.artistName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.item.id+1}
          </Typography>
        </CardContent>
      </div>
    </Card>
    
  )
}

export default Track;

