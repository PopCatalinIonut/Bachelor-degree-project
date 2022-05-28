import { Box, Card, CardContent, Dialog, Fab, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { LoggedUserDetails } from "../features/types";
import { userActivePostsSelector,userDisabledPostsSelector, userSelector } from "../features/UserSlice";
import PersonIcon from '@mui/icons-material/Person';
import { Post } from "./types";
import ProfilePostItemPreview from "./ProfilePostPreview";
import background_image from "../assets/background.png"
import PostDetailsDialog from "./PostDetailsDialog";

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
                 <ProfilePostItemPreview post={post} user={currentUser} dialogOpen={handleDialogOpen}></ProfilePostItemPreview>
             ))
    }

    const disabledPostsList = () =>{
        if (disabledPosts?.length === 0)
        return (<Typography>You currently have no disabled posts!</Typography>)
    else 
        return (disabledPosts.map((post: Post) =>
         <ProfilePostItemPreview post={post} user={currentUser} dialogOpen={handleDialogOpen}/> ))
    }
    const [dialogPost, setDialogPost] = useState(<div></div>);

    const handleDialogOpen = (post:Post | null) => {
        if(post !== null)
            setDialogPost(
                <div>
                    <Dialog fullWidth maxWidth="md" open={true} onClose={handleDialogClose}>
                        <PostDetailsDialog item={post.item} seller={post.seller} id={post.id} isActive={post.isActive}
                        description={post.description} cityLocation={post.cityLocation}/>
                    </Dialog>
                </div>
            );
    };


    const handleDialogClose = () =>{ setDialogPost(<div></div>) }
    return ( 
        <div style={{width:"-webkit-fill-available",height:"100vh"}}>
            <img style={{width:"-webkit-fill-available",height:"100vh",position:"relative"}} src={background_image}></img>
            <div style={{position:"absolute",bottom:"50%",left:"50%",transform:"translate(-50%,50%)"}}>
                <div style={{textAlign:"center",justifyContent:"center"}}>
                    <Fab onClick={handleGoHome} style={{backgroundColor:"#ff3333"}} size="medium">
                        <ArrowBackIcon></ArrowBackIcon>
                    </Fab>
                </div>
            <Card style={{display: "inline-grid",maxHeight:"700px",width:800, padding:0, border:"1px solid",overflowY:"auto",
                    borderRadius: "2.5rem 2.5rem 2.5rem 2.5rem",background:'rgba(255, 255, 255, 0.95)'}} variant="outlined">
                <CardContent style={{padding:0}}>
                    <Grid container style={{textAlign:'center'}}>
                        <Grid item xs={5}>
                            <PersonIcon style={{width:"240px",height:"240px", float:"right"}}></PersonIcon>
                        </Grid>
                        <Grid item sm={7} style={{marginTop:"25px",float:"left"}}>
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
                    <Box style={{borderTop:"1px solid",textAlign:"center"}}>
                        <Typography style={{marginTop:20,fontWeight:900,marginBottom:20}}>Your active posts</Typography>
                        {activePostsList()}
                        <Typography style={{marginTop:20,fontWeight:800,marginBottom:20}}>Your disabled posts</Typography>
                        {disabledPostsList()}
                    </Box>
                </CardContent>  
          </Card>
        {dialogPost}
    </div>
           
      </div>
    );
  
  }