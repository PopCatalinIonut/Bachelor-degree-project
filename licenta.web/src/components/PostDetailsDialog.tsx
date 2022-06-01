import { Dialog, Fab, Grid, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Post } from "./types";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addItemToUserWishlist, removeItemFromUserWishlist, userSelector } from "../features/slices/UserSlice";
import { AddItemToWishlist, RemoveItemFromWishlist } from "../features/slices/MarketplaceSlice";
import ContactSellerDialog from "./ContactSellerDialog";
import { useState } from "react";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { addItemToGenerator } from "../features/slices/OutfitSlice";
import { useNavigate  } from "react-router-dom";
export interface PostDetailsDialogProps{
    post: Post;
    dialogClose: () => void;
}

export default function PostDetailsDialog(props: PostDetailsDialogProps){
    
    let post = props.post;
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const [snackOpened,setSnackOpened] = useState(false)
    let isWishlisted = user.wishlist.findIndex((x: { id: number; }) => x.id === post.id) !== -1
  
    let navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDialogClose = () =>{
        setDialogOpen(false);
    }

    const handleDialogOpen = () =>{ setDialogOpen(true)}
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
                        <Fab variant="extended" style={{marginLeft:25}} onClick={handleDialogOpen}> Message seller
                            <MessageIcon/>
                        </Fab>
                        </div>
                        <Fab variant="extended" style={{marginTop:50}} onClick={handleGenerateOutfit}>Generate an outfit with this item 
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

        props.dialogClose()
        dispatch(addItemToGenerator(post))
        console.log("apasat")
        navigate("/home",{state:{key:"outfit"}})
    }
    return (
            <div style={{width: "100%",backgroundColor:"whitesmoke"}}>
                <Grid container>
                    <Grid item style={{textAlign:"center"}} xs={12}>
                        <Typography style={{fontWeight:900, fontSize:40}}>{post?.item.name}</Typography>
                        <Typography style={{fontWeight:400, fontSize:50, marginTop:10}}><AttachMoneyIcon 
                         style={{width:50,height:35}}/>{post?.item.price}</Typography>
                    </Grid>
                     <Grid item xs={12}>
                     <div style={{textAlign:"right"}}>  
                        <Typography style={{fontWeight:400, fontSize:25, marginTop:10}}>
                            <LocationOnIcon />
                        {"Item is located in " + post?.location}
                        </Typography>
                            </div>
                     </Grid>
                    <Grid item xs={4} style={{marginTop:30, textAlign: "left", float:"left"}}>
                        <TableContainer style={{height:250,width:350,backgroundColor:"transparent",marginLeft:1}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" scope="row " style={{textAlign:"center", border: "1.5px solid"}}>
                                            <Typography style={{fontWeight:600}}>Description</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableCell style={{height:150,textAlign:"center", border: "1.5px solid"}}>{post.description}</TableCell>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={4} style={{textAlign:"center",marginTop:"5%"}}>
                        {buttons()}
                    </Grid>
                    <Grid item xs={4} >
                        <div style={{marginTop:30, textAlign: "right", float:"right"}}>
                            <TableContainer component={Paper} style={{width:350,backgroundColor:"transparent",marginRight:2, border: "2px solid"}}>
                                <Table >
                                    <TableHead>
                                        <TableRow >
                                            <TableCell component="th" scope="row " style={{textAlign:"center", borderRight: "1.5px solid"}}>
                                                <Typography style={{fontWeight:600}}>Condition</Typography>
                                                </TableCell>
                                            <TableCell style={{textAlign:"center"}}>{post.item.condition}</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell component="th" scope="row " style={{textAlign:"center", borderRight: "1.5px solid"}}>
                                                <Typography style={{fontWeight:600}}>Size</Typography>
                                            </TableCell>
                                            <TableCell style={{textAlign:"center"}}>{post.item.size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{textAlign:"center", borderRight: "1.5px solid"}}> 
                                                <Typography style={{fontWeight:600}}>Recommended fit</Typography>
                                            </TableCell>
                                        <TableCell style={{textAlign:"center"}}>{post.item.fit}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" style={{textAlign:"center", borderRight: "1.5px solid"}}> 
                                                <Typography style={{fontWeight:600}}>Colors</Typography>
                                            </TableCell>
                                        <TableCell style={{textAlign:"center"}}>{post.item.color_schema.colors.map((x,index) => {
                                                    if(index < post.item.color_schema.colors.length-1)
                                                        return x + ", ";
                                                    else return x;
                                        })}</TableCell>
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
                        <img src={image.link} style={{width:"100%",height:"100%"}}></img>
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

