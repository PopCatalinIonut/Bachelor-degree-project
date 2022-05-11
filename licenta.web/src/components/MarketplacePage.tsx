import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Post } from "./types";
import { categoryList, clothingSizes, conditions, footwearSizes, genreList, itemTypesSelect } from "../data/itemPropertiesData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllPosts, marketplaceItemsSelector } from "../features/MarketplaceSlice/MarketplaceSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import MarketplaceItemPreview from "./MarketplaceItemPreview";
var selectCategories = ["None"].concat(categoryList);
var selectClothingSizes = ["None"].concat(clothingSizes);
var selectConditions = ["None"].concat(conditions);
var selectFootwearSizes = [{size:"None",genre:"",category:"Footwear",}].concat(footwearSizes);
var selectGenreList = ["None"].concat(genreList);
var selectItemTypes = [{name: "None",category: "Footwear"}].concat(itemTypesSelect);


export default function MarketplacePage(){

    const dispatch = useAppDispatch();
    const [itemSubCategory, setItemSubCategory] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemGenre, setItemGenre] = useState("");
    const [itemCondition, setItemCondition] = useState("");
    const [itemSize, setItemSize] =useState("");
    let postList: Post[] = useAppSelector(marketplaceItemsSelector);
    
    const fetchPosts = async () =>{
        const response = await dispatch(getAllPosts())
        const data = unwrapResult(response) as Post[];
        if(data.length !== 0)
            postList = data;
        
    }
    useEffect(() => {
        fetchPosts()
    },[]);
    
    function handleSetItemGenre(item: string): void {
        setItemGenre(item);
    }
    function handleSelectSubCategory(item: string): void {
        setItemSubCategory(item); 
    }
    function handleSelectMainCategory(item: string): void {
        setItemCategory(item);
    }
    function handleSetItemSize(item: string): void{
        setItemSize(item);
    }
    function handleSelectItemCondition(item:string): void {
        setItemCondition(item);
    }
    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
        navigate("/home")
    };

    return (
        <div style={{textAlign:"center",marginTop:"100px"}}>
             <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Card style={{width:"1200px",marginBottom:"30px"}}>
                    <FormControl style={{marginLeft:"50px",width:"85px"}}>
                        <InputLabel >Category</InputLabel>
                        <Select value={itemCategory}  onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            handleSelectMainCategory(eventNr);}}>
                            {selectCategories.map((item) => {
                            return <MenuItem key={item} value={item}> {item}</MenuItem>})}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"50px",width:"70px"}}>
                        <InputLabel >Subcategory</InputLabel>
                        <Select value={itemSubCategory} onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            handleSelectSubCategory(eventNr);}}>
                            {selectItemTypes.filter((x) => x.category === itemCategory).map((i) => {
                                return (
                                    <MenuItem key={i.name} value={i.name} onClick={() => {handleSelectSubCategory(i.name)}}>
                                        {i.name}
                                    </MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{width:"65px",marginLeft:"50px"}}> 
                        <InputLabel id="Product type">Genre</InputLabel>
                        <Select value={itemGenre}  onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            handleSetItemGenre(eventNr);
                            }}>{(() => {
                                if(itemCategory === "Footwear"){
                                    return selectGenreList.map((item) => {
                                        if(item!=="Unisex")
                                            return <MenuItem key={item} value={item}> {item}</MenuItem>
                                        })
                                }else if(itemCategory === "Clothing"){
                                    return selectGenreList.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else return;
                            })()}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"50px",width:"50px"}}>
                        <InputLabel id="Product category">Size</InputLabel>
                        <Select value={itemSize}  onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            handleSetItemSize(eventNr);
                            }}> {(() => {
                                if (itemCategory === "Footwear"){
                                    var sizes = selectFootwearSizes.filter((x) => x.genre === itemGenre)
                                    if(sizes.length === 0)
                                        return;
                                    else return sizes.map((item) => {
                                            return <MenuItem key={item.size} value={item.size}> {item.size}</MenuItem>
                                            })}
                                else if(itemCategory === "Clothing"){
                                    return selectClothingSizes.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else return;
                            })()}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft:"50px",width:"90px"}}>
                        <InputLabel id="Product category">Condition</InputLabel>
                        <Select value={itemCondition}  onChange={event => {
                            var eventNr = event.target.value as unknown as string;
                            handleSelectItemCondition(eventNr);
                            }}>
                            {selectConditions.map((item) =>{
                                 return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}</Select>
                        </FormControl>
                        
                    <Button>
                        Apply changes
                    </Button>
                    <Button>
                        Reset filters
                    </Button>
                </Card>
            </div>
            <Card style={{display: "inline-grid",width:"1200px"}}>
            {(() => {
                if (postList.length === 0)
                    return (
                        <div><Typography>No items found!</Typography></div>
                    );
                else return (
                    <Grid container spacing={1}>
                            {postList.map((post) =>{
                                return (
                                    <Grid item xs={4}>
                                        <MarketplaceItemPreview 
                                        item={post.item} userId={post.userId} 
                                        description={post.description} cityLocation={post.cityLocation}/>
                                    </Grid>
                                    )
                            })}
                    </Grid>
                )
            })()}
            </Card>
        </div>
    )
}

