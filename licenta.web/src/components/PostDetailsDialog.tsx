import { Fab, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Post } from "./types";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MessageIcon from '@mui/icons-material/Message';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addItemToUserWishlist, userSelector } from "../features/UserSlice/UserSlice";
import { AddItemToWishlist } from "../features/MarketplaceSlice/MarketplaceSlice";
export default function PostDetailsDialog(post: Post){
    
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const handleAddToWishlist = async () =>{
        const response = await dispatch(AddItemToWishlist({
             userId: user.id,
             postId: post.id
        }))
        var message = response.payload as string;
        if(message === "Ok"){
            dispatch(addItemToUserWishlist(post));
        }else{
            alert("Can not be added");
        }
    }
    return (
        <div style={{margin: 'auto', width: 900}}>
                <Grid container>
                    <Grid item style={{textAlign:"center"}} xs={12}>
                        <Typography style={{fontWeight:600, fontSize:30}}>{post?.item.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <div style={{textAlign:"right"}}>  
                        <Typography style={{fontWeight:400, fontSize:30, marginTop:10}}><AttachMoneyIcon 
                         style={{width:18}}/>{post?.item.price}</Typography>
                        <Typography >
                            <LocationOnIcon style={{fontWeight:400, fontSize:30, marginTop:10}}/>
                        {"Item is located in " + post?.cityLocation}
                        </Typography>
                            </div>
                    </Grid>
                     
                    <Grid item xs={6} style={{marginTop:50, textAlign: "left", float:"left"}}>
                        <TableContainer component={Paper} style={{width:300}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" scope="row " style={{textAlign:"center", border: "1px solid"}}>
                                            <Typography style={{fontWeight:600}}>Description</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableCell style={{height:130,textAlign:"center", border: "1px solid"}}>{post?.description}</TableCell>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={6} >
                        <div style={{marginTop:50, textAlign: "right", float:"right"}}>
                            <TableContainer component={Paper} style={{width:300}}>
                                <Table style={{height:150, border: "1px solid"}}>
                                    <TableHead>
                                        <TableRow >
                                            <TableCell component="th" scope="row " style={{textAlign:"center"}}>
                                                <Typography style={{fontWeight:600}}>Condition</Typography>
                                                </TableCell>
                                            <TableCell style={{textAlign:"center"}}>{post?.item.condition}</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell component="th" scope="row " style={{textAlign:"center"}}>
                                                <Typography style={{fontWeight:600}}>Size</Typography>
                                            </TableCell>
                                            <TableCell style={{textAlign:"center"}}>{post?.item.size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{textAlign:"center"}}> 
                                                <Typography style={{fontWeight:600}}>Recommened fit</Typography>
                                            </TableCell>
                                        <TableCell style={{textAlign:"center"}}>{post?.item.fit}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
                <Grid item style={{textAlign:"center", marginTop:30, marginBottom:10}}>
                    <Fab variant="extended" onClick={handleAddToWishlist}> Add to wishlist
                        <FavoriteIcon/>
                    </Fab>
                    <Fab variant="extended"> Message seller
                        <MessageIcon/>
                    </Fab>
                </Grid>
                <Grid container>
                    {post?.item.images.map((image) =>{
                        return <Grid item xs={6}> 
                            <div style={{ width: 450, height: 450 , backgroundImage:"url(" + image.link + ")",
                            backgroundSize:"cover", backgroundPosition:"center", display:"flex"}}></div>
                            </Grid>
                    })}
                </Grid>
        
        </div>
      );
}

