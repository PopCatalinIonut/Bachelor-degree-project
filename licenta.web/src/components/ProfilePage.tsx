import { Box, Card, Fab, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from "react";
import { useAppSelector } from "../app/hooks";
import { LoggedUserDetails } from "../features/types";
import { userActivePostsSelector,userDisabledPostsSelector, userSelector } from "../features/UserSlice";
import PersonIcon from '@mui/icons-material/Person';
import { Post } from "./types";
import ProfilePostItemPreview from "./ProfilePostPreview";

const styles = {
    typographyFormat: {
        padding: "10px 10px",
        fontSize: "19px",
        float:"left",
    }as React.CSSProperties
}
export default function ProfilePage() {

    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }
  
    const currentUser: LoggedUserDetails = useAppSelector(userSelector);
    const activePosts: Post[] = useAppSelector(userActivePostsSelector);
    const disabledPosts: Post[] = useAppSelector(userDisabledPostsSelector);

    const activePostsList = () =>{
        if (activePosts?.length === 0)
            return <Typography>You currently have no active posts!</Typography>
        else 
            return (activePosts.map((post) =>
                 <ProfilePostItemPreview post={post} user={currentUser}></ProfilePostItemPreview>
             ))
    }

    const disabledPostsList = () =>{
        if (disabledPosts?.length === 0)
        return (<Typography>You currently have no disabled posts!</Typography>)
    else 
        return (disabledPosts.map((post: Post) => <ProfilePostItemPreview post={post} user={currentUser}/> ))
    }

    return (
        <div style={{textAlign:"center"}}>
            <div style={{textAlign:"center",marginTop: "100px",marginBottom:"20px"}}>
            <Fab onClick={handleGoHome} style={{backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            
            <Card style={{display: "inline-grid",width:"800px", padding:0, border:"1px solid" }} variant="outlined">
                        <Grid container >
                            <Grid item xs={4}>
                                <PersonIcon style={{width:"240px",height:"240px", float:"right"}}></PersonIcon>
                            </Grid>
                            <Grid item sm={8} style={{marginTop:"25px",float:"left"}}>
                                <Grid container>
                                    <Grid item sm={4}>
                                        <Typography style={styles.typographyFormat}>First name: </Typography>
                                    </Grid>
                                    <Grid item sm={8}>
                                        <Typography style={styles.typographyFormat}>{currentUser?.firstName} </Typography>
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography style={styles.typographyFormat} >Last name: </Typography>
                                    </Grid>
                                    <Grid item sm={8}>
                                        <Typography style={styles.typographyFormat}>{currentUser?.lastName}</Typography>
                                    </Grid>
                                    <Grid item sm={4} >
                                        <Typography style={styles.typographyFormat}>Email:</Typography>
                                    </Grid>
                                    <Grid item sm={8} style={{width:"fit-content",wordWrap:"break-word"}} >
                                        <Typography style={styles.typographyFormat}>{currentUser?.email}</Typography>
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography style={styles.typographyFormat}>Username:</Typography>
                                    </Grid>
                                    <Grid item sm={8}>
                                        <Typography style={styles.typographyFormat}>{currentUser?.loginUsername} </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box style={{borderTop:"1px solid"}}>
                            <Typography style={{marginTop:20,fontWeight:600,marginBottom:20}}>Your active posts</Typography>
                            {activePostsList()}
                            <Typography style={{marginTop:20,fontWeight:600,marginBottom:20}}>Your disabled posts</Typography>
                            {disabledPostsList()}
                        </Box>
          </Card>
      </div>
    );
  
  }