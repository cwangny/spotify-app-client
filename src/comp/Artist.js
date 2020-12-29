import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
  },
  media: {
    height: 300,
  },
});

function Artist(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} style={{backgroundColor: "#f5f5f7"}}>
      <CardMedia
          className={classes.media}
          image={props.item.imageData.url}
      />
      
      <CardContent>
        <Typography variant="h5" style={{display: 'inline-block'}}>{props.item.name}</Typography>
        <Typography variant="subtitle1" color="textSecondary" style={{display: 'inline-block', float: 'right'}}>{props.item.id + 1}</Typography>
      </CardContent>
    </Card>
  )
}

export default Artist;