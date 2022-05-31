import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardContent, Fab, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Post } from "../types";
import { categoryList, clothingSizes, conditions, footwearSizes, genreList, itemTypesSelect } from "../../data/itemPropertiesData";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllPosts, marketplaceItemsSelector } from "../../features/slices/MarketplaceSlice";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { userSelector } from "../../features/slices/UserSlice";
import MarketplacePostPreviewList from "../MarketplacePostPreviewList";
import background_image from "../../assets/background.png";
import axios from "axios";
export default function MarketplacePage(){

    const dispatch = useAppDispatch();
    const [categoryValue, setCategoryValue] = useState("");
    const [typeValue, setTypeValue] = useState("");
    const [genreValue, setGenreValue] = useState("");
    const [conditionValue, setConditionValue] = useState("");
    const [sizeValue, setSizeValue] =useState("");
    const [searchInput, setSearchInput] = useState("");
    let user = useAppSelector(userSelector)
    let navigate = useNavigate(); 
    let postList: Post[] = useAppSelector(marketplaceItemsSelector);

    const [postsToShow, setPostsToShow] = useState<Post[]>(postList);
    const fetchPosts = async () =>{
        const response = await dispatch(getAllPosts())
        const data = response.payload as Post[]
        if(data.length !== 0)
            setPostsToShow(data)
    }
    useEffect(() => {
        if(postList.length === 0)
            fetchPosts()
    },[]);
    const performQuery = async (queryString: string) => {
        /*
        postList.forEach(async (post) =>{
            const response = await axios.post<Post>("https://host-gbik97.api.swiftype.com/api/as/v1/engines/bachelor-degree-engine/documents",post,
            {headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer private-educwvi3qmjr4ssv6vaah5f8"
            }});
            console.log(response);
        })
        */
      /*
       postList.forEach(async (post) =>{
        const response = await axios.delete("https://host-gbik97.api.swiftype.com/api/as/v1/engines/bachelor-degree-engine/documents",
        {headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer private-educwvi3qmjr4ssv6vaah5f8"
        }, data: [post.id]});
       })*/
       var newPostsToShow: Post[] = [];
        const response = await axios.post("https://host-gbik97.api.swiftype.com/api/as/v1/engines/bachelor-degree-engine/search",{
           "query": queryString,
            "page":{
                "size":300
            }
        },
        {headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer private-educwvi3qmjr4ssv6vaah5f8"
        }});
       var results = response.data.results;
       for(let i=0;i<results.length;i++){
        newPostsToShow.push({
            id: results[i].id.raw,
            item: JSON.parse(results[i].item.raw),
            seller: JSON.parse(results[i].seller.raw),
            description: results[i].description.raw,
            location: results[i].location.raw,
            is_active: results[i].is_active.raw
        })
       }
       console.log(results)
        setPostsToShow(newPostsToShow)
    };

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
    return (
        <div style={{width:"-webkit-fill-available",height:"100vh"}}>
        <img style={{width:"-webkit-fill-available",height:"100vh",position:"relative"}} src={background_image}></img>
        <div style={{position:"absolute",bottom:"50%",left:"50%",transform:"translate(-50%,50%)"}}> 
        <div style={{textAlign:"center"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}} size="medium">
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
         
            <Card style={{border:"1px solid",minWidth:"1150px",maxHeight:700,overflowY:"auto",
                    borderRadius: "2.5rem 2.5rem 2.5rem 2.5rem",background:'rgba(255, 255, 255, 0.95)'}}>
                <CardContent style={{display:"flex",justifyContent:"center",paddingTop:15}}>
                    
                    <FormControl style={{minWidth:"80px",marginLeft:"40px"}}>
                        <InputLabel>Type</InputLabel>
                        <Select value={typeValue} autoWidth  notched={true}
                                onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setTypeValue(eventNr);}}>
                                    {categoryList.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>}
                                    )}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"60px",minWidth:"115px"}}>
                        <InputLabel style={{marginBottom:30}}>Category</InputLabel>
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
                    <FormControl style={{marginLeft:"70px",minWidth:"90px"}}> 
                        <InputLabel id="Product type">Genre</InputLabel>
                        <Select value={genreValue} autoWidth={true}
                            onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setGenreValue(eventNr)}}>
                            {genreList.map((gender) =>{
                                return <MenuItem key={gender} value={gender}> {gender}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"60px",minWidth:"80px"}}>
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
                    <FormControl style={{marginLeft:"60px",minWidth:"120px",marginRight:"20px"}}>
                        <InputLabel id="Product category">Condition</InputLabel>
                        <Select value={conditionValue} onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            setConditionValue(eventNr)}}>
                            {conditions.map((item) =>{
                                 return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}</Select>
                        </FormControl>       
            </CardContent>
            <div style={{display:"flex",justifyContent:"center",borderBottom:"1px solid",paddingBottom:10}}>
                <Fab variant="extended" size="small" color="primary" onClick={handleApplyFilters} style={{marginTop:20}}> 
                    <SearchIcon/> Apply changes
                </Fab>
                <Fab variant="extended" size="small" color="primary" onClick={handleClearFilters} style={{marginLeft:40,marginTop:20}}>
                    <DeleteIcon/> Reset filters
                </Fab>
                <Input  
                onBlur={(event: { currentTarget: { value: string; }; }) => {
                    setSearchInput(event.currentTarget.value);
                }}/>
            <Button onClick={() => {performQuery(searchInput)}}> Search</Button>
            </div>
            <Box style={{display: "inline-grid",maxWidth:"1150px",minWidth:500}}>
            {(() => {
                if (postsToShow.length === 0)
                    return ( <div style={{textAlign:"center",justifyContent:"center"}}><Typography style={{fontWeight:900,height:90, marginTop:50, fontSize:30}}>No items found!</Typography></div> );
                else return (
                    <MarketplacePostPreviewList posts={postsToShow} user={user}></MarketplacePostPreviewList>
                )
            })()}
            </Box>
            </Card>
        </div></div>
    )
}