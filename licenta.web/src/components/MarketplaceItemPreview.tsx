import { useState } from "react";
import { Post } from "./types";
import {  Fab, Paper, Grid, Typography } from "@material-ui/core";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
export default function MarketplaceItemPreview (post: Post){

    const [imageToShow, setImageToShow] = useState({image:post.item.images[0],counter:0});
    const handleImageChangeRight = () =>{
        if(imageToShow.counter + 1 < post.item.images.length)
            setImageToShow({image:post.item.images[imageToShow.counter+1],counter:imageToShow.counter+1})
    }
    const handleImageChangeLeft = () =>{
        if(imageToShow.counter -1 >= 0)
            setImageToShow({image:post.item.images[imageToShow.counter-1],counter:imageToShow.counter-1})
    }
    return (
        <Paper style={{  margin: 'auto', width: 400,maxWidth:400 }} >
            <Grid container spacing={2}>
                <Grid item>
                    <div style={{ width: 200, height: 200 , backgroundImage:"url(" + imageToShow.image.link + ")",
                        backgroundSize:"cover", backgroundPosition:"center"}}>
                        <Fab onClick={handleImageChangeLeft} style={{width:35 , height:10}} size="small">
                            <ArrowBackIcon/>
                        </Fab>
                        <Fab onClick={handleImageChangeRight} style={{width:35 , height:10}}>
                            <ArrowForwardIcon/>
                        </Fab>
                    </div>
                </Grid>
                <Grid item xs={9} sm container>
                    <Grid item xs container direction="column">
                        <Grid item xs>
                            <Typography gutterBottom style={{fontWeight:600}} component="div">
                                {post.item.name}
                            </Typography>
                            <Typography style={{marginTop:30}} variant="body2" gutterBottom>
                                {"Size " +post.item.size}
                            </Typography>
                            <Typography  style={{marginTop:30}}variant="body2">
                                {post.item.condition}
                            </Typography>
                           
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{float:"right",marginRight:5}}>
                            {"$" + post.item.price}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography style={{float:"right",alignItems: "flex-end",display: "flex",marginRight:5}}>
                            <LocationOnIcon style={{width:18}}></LocationOnIcon>{post.cityLocation}
                        </Typography>
                    </Grid>
                </Grid>

            </Grid>
        </Paper>
    )
}