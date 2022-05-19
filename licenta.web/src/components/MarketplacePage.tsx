import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, Dialog, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Post } from "./types";
import { categoryList, clothingSizes, conditions, footwearSizes, genreList, itemTypesSelect } from "../data/itemPropertiesData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllPosts, marketplaceItemsSelector } from "../features/MarketplaceSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import MarketplacePostPreview from "./MarketplacePostPreview";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import PostDetailsDialog from "./PostDetailsDialog";
import { userSelector } from "../features/UserSlice";


export default function MarketplacePage(){

    const dispatch = useAppDispatch();
    const [categoryValue, setCategoryValue] = useState("");
    const [typeValue, setTypeValue] = useState("");
    const [genreValue, setGenreValue] = useState("");
    const [conditionValue, setConditionValue] = useState("");
    const [sizeValue, setSizeValue] =useState("");

    let user = useAppSelector(userSelector)
    let navigate = useNavigate(); 
    let postList: Post[] = useAppSelector(marketplaceItemsSelector);
    const [postsToShow, setPostsToShow] = useState<Post[]>(postList);
    const fetchPosts = async () =>{
        const response = await dispatch(getAllPosts())
        const data = unwrapResult(response) as Post[];
        if(data.length !== 0)
            setPostsToShow(data)
    }
    useEffect(() => {
        fetchPosts()
    },[]);

    const handleApplyFilters = () =>{
       var filteredPosts = postList.filter((post) => (categoryValue.length === 0) || (categoryValue.length !== 0 && post.item.category === categoryValue) )
            .filter((post) => (typeValue.length === 0) || (typeValue.length !== 0 && post.item.type === typeValue))
            .filter((post) =>(genreValue.length === 0) || (genreValue.length !== 0 && post.item.genre === genreValue))
            .filter((post) =>(conditionValue.length === 0) || (conditionValue.length !== 0 && post.item.condition === conditionValue))
            .filter((post) => (sizeValue.length === 0) || (sizeValue.length !== 0 && post.item.size === sizeValue))
        setPostsToShow(filteredPosts)
    }
    const handleClearFilters = () =>{
        setCategoryValue("");
        setTypeValue("");
        setGenreValue("");
        setConditionValue("");
        setSizeValue("");
        setPostsToShow(postList)
    }
    
    const handleGoHome = () =>{ 
        navigate("/home")
    };
    
    const [dialogPost, setDialogPost] = useState(<div></div>);
    const handleDialogOpen = (post:Post) => {
        setDialogPost(
            <div>
                <Dialog fullWidth maxWidth="md" open={true} onClose={handleDialogClose}>
                    <PostDetailsDialog item={post.item} seller={post.seller} id={post.id} isActive={post.isActive}
                    description={post.description} cityLocation={post.cityLocation}/>
                </Dialog>
            </div>
        );
    };

    const handleDialogClose = () =>{
        setDialogPost(<div></div>)
    }
    return (
        <div style={{textAlign:"center",marginTop:"100px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <Card style={{border:"1px solid", borderRadius:"50px"}}>
            <div style={{display:"flex",justifyContent:"center"}}>
                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select value={typeValue} autoWidth style={{minWidth:"55px"}}
                                onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setTypeValue(eventNr);}}>
                                    {categoryList.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>}
                                    )}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"80px",width:"85px"}}>
                        <InputLabel >Category</InputLabel>
                        <Select value={categoryValue} autoWidth onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setCategoryValue(eventNr);}}>
                            {itemTypesSelect.filter((x) => x.category === typeValue).map((i) => {
                                return (
                                    <MenuItem key={i.name} value={i.name} onClick={() => {setCategoryValue(i.name)}}>
                                        {i.name}
                                    </MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"80px"}}> 
                        <InputLabel id="Product type">Genre</InputLabel>
                        <Select value={genreValue} autoWidth={true} style={{minWidth:"65px"}}
                            onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setGenreValue(eventNr);
                            }}>{genreList.map((gender) =>{
                                return  <MenuItem key={gender} value={gender}> {gender}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"80px",width:"50px"}}>
                        <InputLabel id="Product category">Size</InputLabel>
                        <Select value={sizeValue} autoWidth onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setSizeValue(eventNr);
                            }}> {(() => {
                                if (typeValue === "Footwear"){
                                    var sizes = footwearSizes.filter((x) => x.genre === genreValue)
                                    if(sizes.length === 0)
                                        return;
                                    else return sizes.map((item) => {
                                            return <MenuItem key={item.size} value={item.size}> {item.size}</MenuItem>
                                            })}
                                else if(typeValue === "Clothing"){
                                    return clothingSizes.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else return;
                            })()}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"80px",width:"90px"}}>
                        <InputLabel id="Product category">Condition</InputLabel>
                        <Select value={conditionValue} autoWidth onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setConditionValue(eventNr);
                            }}>
                            {conditions.map((item) =>{
                                 return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}</Select>
                        </FormControl>       
            </div>
            <div style={{display:"flex",justifyContent:"center",borderBottom:"1px solid",paddingBottom:10}}>
                <Fab variant="extended" size="medium" onClick={handleApplyFilters} style={{marginTop:20}}> 
                    <SearchIcon/>
                    Apply changes
                </Fab>
                <Fab variant="extended" size="medium" onClick={handleClearFilters} style={{marginLeft:40,marginTop:20}}>
                    <DeleteIcon/>
                    Reset filters
                </Fab>
            </div>
            <Box style={{display: "inline-grid",maxWidth:"1600px"}}>
            {(() => {
                if (postsToShow.length === 0)
                    return ( <div ><Typography style={{height:90, marginTop:50}}>No items found!</Typography></div> );
                else return (
                    <Grid container spacing={1} style={{justifyContent:"center"}}>
                            {postsToShow.map((post) =>{
                                return ( <div style={{display:"flex", flexDirection:"row", margin:"20px 15px 15px 10px"}}>
                                            <MarketplacePostPreview post={post} dialogOpen={handleDialogOpen} user={user}/>
                                         </div>)
                            })}
                    </Grid>
                )
            })()}
            </Box>
            </Card>
            
            {dialogPost}
        </div>
    )
}

