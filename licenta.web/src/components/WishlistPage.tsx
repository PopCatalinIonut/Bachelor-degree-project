import { Fab, Card, Typography, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect } from "react";
import { WishlistItem } from "./types";

var items: WishlistItem[] = [
    {name:"test1"},{name:"test2"},{name:"test3"}, {name:"test4"},{name:"test5"},{name:"test6"}
]

export default function WishlistPage(){

    const [wishlistItems, setWishlistItems] = React.useState(<div><Typography>You don't have any items on wishlist yet!</Typography></div>);
    useEffect(() => {
        if(items.length !== 0){
            setWishlistItems(<Grid container spacing={1}>
                {items.map((item) =>{
                    return <Grid item sm={4}> <Card><Typography>{item.name}</Typography>
                        </Card></Grid>
                })}
            </Grid>)
        }
      },[]);
    
   
    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }
    return (
        <div style={{textAlign:"center",marginTop:"150px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <Card style={{display: "inline-grid",width:"700px"}} variant="outlined">
            {wishlistItems}
            </Card>
        </div>
    )
}