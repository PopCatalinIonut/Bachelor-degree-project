import { useState } from "react";
import { Post, PostUserDetails } from "./types";
import { Fab, Paper, Grid, Typography, ButtonBase } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAppDispatch } from "../app/hooks";
import { removeItemFromGenerator } from "../features/slices/OutfitSlice";
export interface MarketplacePostPreviewProps {
    post: Post;
    dialogOpen: (post: Post) => void;
    user: PostUserDetails;
    isDeletable: boolean;
}
export default function OutfitGeneratorPostPreview (props: MarketplacePostPreviewProps){

    var post = props.post;
    
    const dispatch = useAppDispatch();
    const [imageToShow, setImageToShow] = useState({image:post.item.images[0],counter:0});

    const handleImageChangeRight = () =>{
        if(imageToShow.counter + 1 < post.item.images.length)
            setImageToShow({image:post.item.images[imageToShow.counter+1],counter:imageToShow.counter+1})
    }
    const handleImageChangeLeft = () =>{
        if(imageToShow.counter -1 >= 0)
            setImageToShow({image:post.item.images[imageToShow.counter-1],counter:imageToShow.counter-1})
    }

    const hanleRemoveFromGenerator = () =>{
        dispatch(removeItemFromGenerator(props.post.id))
    }
    const handleOpenDialog = () =>{
        props.dialogOpen(post);
    }
    return (
        <Paper style={{width: "inherit",height:"100%"}}>
            <Grid container style={{width: "inherit",height:"100%" }}>
                <Grid item xs={6} style={{ backgroundImage:"url(" + imageToShow.image.link + ")",
                    backgroundSize:"cover", backgroundPosition:"center",width:"inherit"}}>
                    <Fab size="medium" onClick={handleImageChangeLeft} style={{width:"15%" , height:"5%"}}>
                         <ArrowBackIcon/>
                    </Fab>
                    <Fab size="medium" onClick={handleImageChangeRight} style={{width:"15%" , height:"5%"}}>
                         <ArrowForwardIcon/>
                    </Fab>
                </Grid> 
                <div style={{position:"relative",left:-40}}>
                    {(() =>  {
                            if(props.isDeletable === true)
                            return  <Fab size="medium" onClick={hanleRemoveFromGenerator} style={{width:"150%" , height:"5%", background:"red"}}>
                            <DeleteOutlineOutlinedIcon/>
                        </Fab>}
                    )()}
                </div>
                <Grid item xs={6} sm container style={{position:"relative"}}>
                    <ButtonBase style={{width:"inherit",display:"inline-block"}} onClick={handleOpenDialog}>   
                        <Grid item xs container direction="column" >
                            <Grid item xs={12} style={{textAlign:"center",justifyContent:"center"}}>
                                <Typography gutterBottom style={{fontWeight:900, fontSize:16}} component="div">
                                    {post.item.name}
                                </Typography>
                                <Typography gutterBottom style={{fontWeight:600, fontSize:16}} component="div">
                                    {post.item.brand}
                                </Typography>
                                <Typography style={{fontSize:14}}>
                                    {post.item.color_schema.colors.map((x,index) => {
                                        if(index+1 === post.item.color_schema.colors.length)
                                            return(x);
                                        else return (x + " / ")
                                        })}
                                </Typography>
                            
                                <Typography style={{marginTop:5, fontSize:16}} variant="body2" gutterBottom>
                                    {"Size " +post.item.size + " - " + post.item.condition}
                                </Typography>
                            </Grid>
                        </Grid> 
                            <div style={{position:"absolute",bottom:0, width:"inherit"}}>
                                <Typography style={{float:"left",marginLeft:5, fontSize:16}}>
                                    {"$" + post.item.price}
                                </Typography>
                                <Typography style={{float:"right",alignItems: "flex-end",display: "flex",marginRight:5, fontSize:16}}>
                                    <LocationOnIcon style={{width:18}}></LocationOnIcon>{post.location}
                                </Typography>
                            </div>
                    </ButtonBase>
                </Grid>
            </Grid>
        </Paper> 
    );
}