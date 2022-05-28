import { Post, PostUserDetails } from "./types";
import { Paper, Grid, Typography, Button, Fab } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { DeletePost, UpdatePostActiveStatus } from "../features/MarketplaceSlice";
import { deletePostReducer, updatePostStatus }  from "../features/UserSlice";
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
export interface ProfilePostPreviewProps {
    post: Post;
    dialogOpen: (post: Post) => void;
    user: PostUserDetails
  }

export default  function ProfilePostItemPreview (props: ProfilePostPreviewProps){

    const dispatch = useAppDispatch();
    const handleUpdatePostStatus =  async (status: boolean) =>{
         const response =  await dispatch(UpdatePostActiveStatus({postId:props.post.id,status:status}))
         if(response.payload === "Ok"){
             dispatch(updatePostStatus({postId:props.post.id,status:status}))
         }
    }
    const handleDeletePost = async () =>{
        const response = await dispatch(DeletePost(props.post.id));
        if(response.payload === "Ok"){
            dispatch(deletePostReducer(props.post.id))
        }
    }
    const showImages = () =>{
        var images = props.post.item.images;
        if(images.length > 3)
            images = images.slice(0,3) 
            return <div style={{flexDirection:"row",display:"flex", padding: 0}}>
                        {images.map((image) =>{
                            return <div style={{ width:300, height: 200 , backgroundImage:"url(" + image.link + ")",
                                        backgroundSize:"cover", backgroundPosition:"center"}}>
                                    </div>
                        })}</div>
    }

    const showButtons = () =>{
        if(props.post.isActive === true)
        return <Button variant="contained" size="small" style={{marginRight:30}} color="secondary"
                       onClick={() => {handleUpdatePostStatus(false)}} >Disable post</Button>
                
        else return(<div>
            <Button variant="contained" size="small" style={{marginRight:30}} color="primary" 
                    onClick={() => {handleUpdatePostStatus(true)}}>Activate post</Button>
            <Button variant="contained" size="small" style={{marginRight:30}} color="secondary" 
                    onClick={handleDeletePost}>Delete post</Button>
        </div>)
    }

    return (
        <Paper style={{ width: 800,maxWidth: 800,padding:0 ,background:'rgba(255, 255, 255, 0.55)'}} >
            <Grid container spacing={2} style={{margin:"auto",padding:0, marginBottom:20}}>
                <Grid item xs={7} style={{padding:0,maxWidth:"450px"}} >
                    {showImages()}
                </Grid>
                <Grid item xs={5} style={{padding:0}}>
                     
                    <Grid item xs container direction="column">
                        <Grid item xs={12}>
                            <Fab size="medium" style={{float:"right",marginRight:"3%"}} onClick={() => {props.dialogOpen(props.post)}}>
                                <OpenInNewRoundedIcon/></Fab>
                        </Grid>
                        <Grid item xs style={{justifyContent:"center",textAlign:"center"}}>
                            <Typography gutterBottom style={{fontWeight:600,fontSize:20}} component="div">
                                {props.post.item.name}
                            </Typography>
                            <Typography gutterBottom style={{fontSize:17}} component="div">
                                {"Size " + props.post.item.size + " - " + props.post.item.condition}
                            </Typography>
                            <div style={{marginTop:30,marginBottom:10,marginLeft:"10%"}}>
                                {showButtons()}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}