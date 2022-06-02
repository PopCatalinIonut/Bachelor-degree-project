import { Box, Dialog, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { LoggedUserDetails } from "../../features/types";
import { userActivePostsSelector,userDisabledPostsSelector, userSelector } from "../../features/slices/UserSlice";
import PersonIcon from '@mui/icons-material/Person';
import { Post } from "../types";
import ProfilePostItemPreview from "../ProfilePostPreview";
import PostDetailsDialog from "../PostDetailsDialog";

const styles = {
    typographyFormat: {
        padding: "10px 10px",
        fontSize: "19px",
        float:"left",
    }as React.CSSProperties
}
export default function ProfilePage() {
  
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
        if(post !== null){
            setDialogPost(
                <div>
                    <Dialog fullWidth maxWidth={false} style={{width:1200,position:"absolute",top:"5%",left:"10%"}}  open={true} onClose={handleDialogClose}>
                        <PostDetailsDialog post={post} dialogClose={handleDialogClose}/>
                    </Dialog>
                </div>
            );
        }
    };

    const handleDialogClose = () =>{ setDialogPost(<div></div>) }
    
    return ( 
        <div style={{width:"-webkit-fill-available",height:"100vh"}}>
            <div style={{textAlign:"center"}}>
            <Grid container style={{textAlign:'center'}}>
                <Grid item xs={5} style={{marginTop:"5%",textAlign:"center",justifyContent:"center"}}>
                    <Grid container style={{width:"80%"}}>
                        <Grid item xs={12}>
                    <PersonIcon style={{width:"240px",height:"240px"}}></PersonIcon>
                        </Grid>
                        <Grid container xs={12} style={{textAlign:"center",justifyContent:"center"}}>
                            <Grid item xs={3} >
                                <Typography style={styles.typographyFormat}>First name: </Typography>
                            </Grid>
                            <Grid item xs={3}  style={{textAlign:"center",justifyContent:"center"}}>
                                <Typography style={styles.typographyFormat}>{currentUser?.first_name} </Typography>
                            </Grid>
                        </Grid>
                       <Grid container xs={12} style={{textAlign:"center",justifyContent:"center"}}>
                        <Grid item xs={3} >
                                <Typography style={styles.typographyFormat} >Last name: </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <Typography style={styles.typographyFormat}>{currentUser?.last_name}</Typography>
                            </Grid>
                       </Grid>
                        <Grid container xs={12} style={{textAlign:"center",justifyContent:"center"}}>
                            <Grid item sm={3} >
                                <Typography style={styles.typographyFormat}>Email:</Typography>
                            </Grid>
                            <Grid item sm={3} style={{width:"fit-content",wordWrap:"break-word"}} >
                                <Typography style={styles.typographyFormat}>{currentUser?.email}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} style={{textAlign:"center",justifyContent:"center"}}>
                            <Grid item sm={3}>
                                <Typography style={styles.typographyFormat}>Username:</Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <Typography style={styles.typographyFormat}>{currentUser?.loginUsername} </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
            </Grid>
            <Grid item xs={6}>
                <Box style={{display: "inline-grid",maxHeight:"730px",width:800, padding:0,overflowY:"auto"}}>
                    {(() => {
                            if(activePosts.length === 0 && disabledPosts.length === 0)
                            return <div style={{marginTop:"30%"}}></div>          
                    })()}
                    <Typography style={{marginTop:20,fontWeight:900,marginBottom:20,fontSize:20}}>Your active posts</Typography>
                    {activePostsList()}
                    <Typography style={{marginTop:20,fontWeight:800,marginBottom:20,fontSize:20}}>Your disabled posts</Typography>
                    {disabledPostsList()}
                </Box>
            </Grid>
            </Grid>
        {dialogPost}
    </div>
           
      </div>
    );
  
  }