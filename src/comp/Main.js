import React, {useState, useEffect} from 'react';
import Artist from './Artist';
import Track from './Track';
import axios from 'axios';
import moment from 'moment';

import 'fontsource-roboto';

import { Container } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import Logo from './icon.png';

function Main(props) {
  const {access_token} = props.params;

  // STATES:
  const [myInfo, setMyInfo] = useState({});
  const [myImageURl, setMyImageURL] = useState("");
  const [myName, setMyName] = useState("");
  const [myUserID, setMyUserID] = useState(0);
  const [playlistLink, setPlaylistLink] = useState("");
  const [trackURIList, setTrackURIList] = useState([]);
  const [term, setTerm] = useState("short_term");
  const [artistList, setArtistList] = useState([]);
  const [trackList, setTrackList] = useState([]);

  // Runs every time component is rendered. 
  // runs useEffect hook every time the page re-renders or updates.
  // the page re-renders everytime a hook is called.  
  useEffect(()=>{
    getCurrentUserInfo()
    if (artistList.length === 0 && trackList.length === 0) {
      getArtists();
      getTracks();
    }
  }, [])

  // Get current user info.
  function getCurrentUserInfo() {
    axios.get("https://api.spotify.com/v1/me", {
      headers: {
        "Authorization": "Bearer " + access_token
      }
    }).then(res=>{
        setMyInfo(res.data);
        setMyName(res.data.display_name);
        setMyUserID(res.data.id);
        setMyImageURL(res.data.images[0].url)
      })
  }

  // get top 10 artists, default value of 1 month.
  function getArtists(term = "short_term") {
    axios.get("https://api.spotify.com/v1/me/top/artists",
      { 
        params: {
          "time_range": term,
          "limit": 12,
        },
        headers: {
          "Accept": "application/json",
          "Content-Type" : "application/json",
          "Authorization": "Bearer " + access_token
        },
      }
    ).then(res=>{
      let arr = res.data.items; 
      
      setArtistList([]);

      for (let i = 0; i < arr.length; i++) {
        let obj = {
          id: i,
          name: arr[i].name,
          imageData: arr[i].images[1]
        }
        setArtistList(artistList => [...artistList, obj]);
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  // get top 50 tracks
  function getTracks(term = "short_term") {
    axios.get("https://api.spotify.com/v1/me/top/tracks",
      { 
        params: {
          "time_range": term,
          "limit": 50,
        },
        headers: {
          "Accept": "application/json",
          "Content-Type" : "application/json",
          "Authorization": "Bearer " + access_token
        },
      }
    ).then(res=>{
      let arr = res.data.items; 

      setTrackList([]);
      setTrackURIList([]);

      for (let i = 0; i < arr.length; i++) {
        let uri = arr[i].uri;
        let obj = {
          id: i,
          songName: arr[i].name,
          artistName: arr[i].artists[0].name,
          imageData: arr[i].album.images[1],
        }
        
        setTrackList(trackList => [...trackList, obj]);
        setTrackURIList(trackURIList => [...trackURIList, uri]);
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  // Creates a playlist and adds 50 songs to the playlist. The songs and the playlist description depends on the current state. 
  function createPlaylistAndAddSongs(term) {
    let currentMonth = getCurrentMonth();
    let prevOneMonth = getCurrentMonthOffsetOne();
    let prevSixMonth = getCurrentMonthOffsetSix();

    let description = {
      "short_term": "Your 50 most played tracks since last month. From " + prevOneMonth + " to " + currentMonth + ". Sorted by most to least. @ https://spotify-stats-main.herokuapp.com",
      "medium_term": "Your 50 most played tracks since last six months. From " + prevSixMonth + " to " + currentMonth + ". Sorted by most to least. @ https://spotify-stats-main.herokuapp.com",
      "long_term": "Your 50 most played tracks of all time. Sorted by most to least. @ https://spotify-stats-main.herokuapp.com"
    }

    let addDesc;
    let time_range = '';
    let long_time_range = '';

    if (term === "short_term") {
      time_range = `${prevOneMonth} - ${currentMonth}, `
      long_time_range = '';
      addDesc = description["short_term"];
    }

    if (term === "medium_term") {
      time_range = `${prevSixMonth} - ${currentMonth}, `
      long_time_range = '';
      addDesc = description["medium_term"];
    }

    if (term === "long_term") {
      time_range = ""
      long_time_range = " Of All Time"
      addDesc = description["long_term"];
    }

    //console.log("Top 50 Tracks " + time_range);
    axios.request({
      method: "POST",
      url: `https://api.spotify.com/v1/users/${myUserID}/playlists`,
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + access_token
      },
      data : {
        "name": time_range + "Top 50 Tracks" + long_time_range,
        "description": addDesc
      },
    }).then(res=>{
      setPlaylistLink(res.data.external_urls.spotify);
      return res.data.id;
    }).then(id=>{
      axios.request({
        method: "POST",
        url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
        headers: {
          "Content-Type" : "application/json",
          "Authorization": "Bearer " + access_token
        },
        data : {
          uris: trackURIList
        }
      })
    }).catch(error=>{
      console.log(error);
    })
  }

  function getCurrentMonth() {
    return moment().subtract(0, 'months').format('MMMM');
  }

  // Get last month. 
  function getCurrentMonthOffsetOne() {
    return moment().subtract(1, 'months').format('MMMM');
  }

  // Get six months ago. 
  function getCurrentMonthOffsetSix() {
    return moment().subtract(6, 'months').format('MMMM');
  }

  // Evenlisteners functions. 
  function handleGetArtist(term) {
    if (term === "short_term") {
      getArtists(term);
    }

    if (term === "medium_term") {
      getArtists(term);
    }

    if (term === "long_term") {
      getArtists(term);
    }
  }

  function handleGetTracks(term) {
    if (term === "short_term") {
      getTracks(term);
      setTerm("short_term")
    }

    if (term === "medium_term") {
      getTracks(term);
      setTerm("medium_term")
    }

    if (term === "long_term") {
      getTracks(term);
      setTerm("long_term")
    }
  }

  function handleAddSongsToAPlaylist() {
    createPlaylistAndAddSongs(term);
  }

  return (
    <Container >
      <Grid container justify = "center">
        <Avatar alt={myName} src={myImageURl} style={{width: 200, height: 200, boxShadow: "0px 3px 4px 0px"}}/>
      </Grid>

      <Grid container justify = "center" style={{marginTop: 9}}>
        <Typography variant="h2">
          Hi, {myName}
        </Typography>
      </Grid>

      <Divider />

      <Grid container justify= "center" style={{marginBottom: 20, marginTop: 8}}>
        <Typography variant="h6">
          Your Top Artists
        </Typography>
      </Grid>

      <Grid container justify="center" spacing={4} style={{marginBottom: 20}}>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetArtist("short_term")} style={{backgroundColor: "#f5f5f7"}}>One Month</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetArtist("medium_term")}>Six Months</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetArtist("long_term")}>All Time</Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {artistList.map(item=>(
          <Grid item lg={3} md={6} sm={12} xs={12}>
            <Artist key={item.id} item={item}/>
          </Grid>
        ))}
      </Grid>

      <Divider style={{marginTop: 30}}/>

      <Grid container justify= "center" style={{marginTop: 20, marginBottom: 17}}>
        <Typography variant="h6">
          Your Top 50 Tracks
        </Typography>
      </Grid>

      <Grid container justify= "center" style={{marginBottom: 9}}>
        <Button variant="contained" onClick={handleAddSongsToAPlaylist}>Add to a playlist</Button>
      </Grid>
      
      <Grid container justify="center" style={{marginBottom: 20}}>
        <Link href={playlistLink} underline="hover" target="_blank">
          {playlistLink}
        </Link>
      </Grid>

      <Grid container justify="center" spacing={4} style={{marginBottom: 20}}>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetTracks("short_term")}>One Month</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetTracks("medium_term")}>Six Months</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={()=>handleGetTracks("long_term")}>All Time</Button>
        </Grid>
      </Grid>
        
      <Grid container spacing={3}>
        { trackList.map(item=>(
          <Grid item lg={6} md={12} sm={12}>
            <Track key={item.id} item={item}/>
          </Grid> 
        ))}
      </Grid>

      <Divider style={{marginTop: 20}}/>

      <Grid container justify="center" style={{marginTop: 10, marginBottom: 15}}>
        <Typography variant="subtitle1">
          by Mison
        </Typography>
        
        <Icon style={{marginLeft: 5}}>
          <Link href="https://open.spotify.com/user/1266564797" target="_blank">
            <img src={Logo} height={25} width={25}/>
          </Link>
        </Icon>
      </Grid>
    </Container>
  )
}

export default Main;