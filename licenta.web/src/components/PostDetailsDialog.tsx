import { Dialog, Fab, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Post } from "./types";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addItemToUserWishlist, removeItemFromUserWishlist, userSelector } from "../features/UserSlice";
import { AddItemToWishlist, RemoveItemFromWishlist } from "../features/MarketplaceSlice";
import ContactSellerDialog from "./ContactSellerDialog";
import { useState } from "react";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { addItemToGenerator } from "../features/OutfitSlice";
import { useNavigate } from "react-router-dom";
export default function PostDetailsDialog(post: Post){
    
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const [snackOpened,setSnackOpened] = useState(false)
    let isWishlisted = user.wishlist.findIndex((x) => x.id === post.id) !== -1
  
    let navigate = useNavigate(); 

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDialogClose = () =>{
        setDialogOpen(false);
    }

    const handleDialogOpen = () =>{ console.log("open click"); setDialogOpen(true)}
    const handleAddToWishlist = async () =>{
        const response = await dispatch(AddItemToWishlist({
             userId: user.id,
             postId: post.id
        }))
        var message = response.payload as string;
        if(message === "Ok"){
            dispatch(addItemToUserWishlist(post));
            isWishlisted = (true);
        }else{
            setSnackOpened(true)
        }
    }

    const buttons = () =>{
        if(post.seller.id !== user.id)
            return (<div style={{display:"inline-grid",marginTop:20}}>
                        <div style={{display:"flex"}}>
                        {wishlistButton()}
                        <Fab variant="extended" onClick={handleDialogOpen}> Message seller
                            <MessageIcon/>
                        </Fab>
                        </div>
                        <Fab variant="extended" onClick={handleGenerateOutfit}>Generate an outfit with this item 
                            <FollowTheSignsIcon/>
                        </Fab>
                    </div>)
    }

    const wishlistButton = () =>{
        if (isWishlisted === false)
            return (<Fab variant="extended" onClick={handleAddToWishlist}> Add to wishlist
                        <FavoriteIcon/>
                    </Fab>)
        else 
            return (<Fab variant="extended" onClick={handleRemoveFromWishlist}> Remove from Wishlist
                        <DeleteIcon/>
                    </Fab>)
    }

    const handleRemoveFromWishlist = async() =>{
        const response = await dispatch(RemoveItemFromWishlist({
            userId: user.id,
            postId: post.id
        }))
        if(response.payload === "Ok"){
            dispatch(removeItemFromUserWishlist(post))
            isWishlisted = (false);
        }
    }

    const handleGenerateOutfit = () =>{
        dispatch(addItemToGenerator(post))
        navigate("/outfitGenerator")
    }
    return (
            <div style={{margin: 'auto', width: 900}}>
                <Grid container>
                    <Grid item style={{textAlign:"center"}} xs={12}>
                        <Typography style={{fontWeight:600, fontSize:30}}>{post?.item.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        {buttons()}
                    </Grid>
                     <Grid item xs={6}>
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
                                    <TableCell style={{height:130,textAlign:"center", border: "1px solid"}}>{post.description}</TableCell>
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
                                            <TableCell style={{textAlign:"center"}}>{post.item.condition}</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell component="th" scope="row " style={{textAlign:"center"}}>
                                                <Typography style={{fontWeight:600}}>Size</Typography>
                                            </TableCell>
                                            <TableCell style={{textAlign:"center"}}>{post.item.size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{textAlign:"center"}}> 
                                                <Typography style={{fontWeight:600}}>Recommened fit</Typography>
                                            </TableCell>
                                        <TableCell style={{textAlign:"center"}}>{post.item.fit}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
                <Grid container style={{marginTop:20,justifyContent:"center"}}>
                    {post.item.images.map((image) =>{
                        return <Grid item xs={6}> 
                        <img src={image.link} style={{width:450,height:450}}></img>
                            </Grid>
                    })}
                </Grid>
                <div style={{justifyContent:"center", width:400}}>
                    <Dialog 
                        open={dialogOpen} onClose={handleDialogClose}>
                        <ContactSellerDialog seller={post.seller} userId={user.id} 
                        dialogClose={() => {return setDialogOpen(false);}}/>
                    </Dialog>
                </div>
                
            <Snackbar
                open={snackOpened} autoHideDuration={3000} message="Cannot be added!"
                anchorOrigin={{vertical: "top", horizontal: "center"}}/>
            </div>
      );
}

