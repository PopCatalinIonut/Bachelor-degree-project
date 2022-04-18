import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { SellingItem } from "./types";
import { categoryList, clothingSizes, conditions, footwearSizes, genreList, itemTypesSelect } from "../data/ItemCategory";

var items: SellingItem[] = [
    {name:"test1"},{name:"test2"},{name:"test3"}, {name:"test4"},{name:"test5"},{name:"test6"}
]

var selectCategories = ["None"].concat(categoryList);
var selectClothingSizes = ["None"].concat(clothingSizes);
var selectConditions = ["None"].concat(conditions);
var selectFootwearSizes = [{size:"None",genre:"",category:"Footwear",}].concat(footwearSizes);
var selectGenreList = ["None"].concat(genreList);
var selectItemTypes = [{id: 1,name: "Casual shoes",category: "Footwear"}].concat(itemTypesSelect);

export default function MarketplacePage(){

    const [itemsToShow, setItemsToShow] = useState(<div><Typography>No items found!</Typography></div>);
    const [itemSubCategory, setItemSubCategory] = useState(0);
    const [itemCategory, setItemCategory] = useState("");
    const [itemGenre, setItemGenre] = useState("");

    const [itemCondition, setItemCondition] = useState("");
    const [itemSize, setItemSize] =useState("");
    useEffect(() => {
        if(items.length !== 0){
            setItemsToShow(<Grid container spacing={1}>
                {items.map((item) =>{
                    return <Grid item sm={4}> <Card><Typography>{item.name}</Typography>
                        </Card></Grid>
                })}
            </Grid>)
        }
    },[]);
    
    function handleSetItemGenre(item: string): void {
        setItemGenre(item);
    }
    function handleSelectSubCategory(item: number): void {
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
        <div style={{textAlign:"center",marginTop:"150px"}}>
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
                            var eventNr = event.target.value as unknown as number;
                            handleSelectSubCategory(eventNr);}}>
                            {selectItemTypes.filter((x) => x.category === itemCategory).map((i) => {
                                return (
                                    <MenuItem key={i.id} value={i.id} onClick={() => {handleSelectSubCategory(i.id)}}>
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
                                    var sizes = selectFootwearSizes.filter((x) => x.genre == itemGenre)
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

                    </Button>
                    <Button>
                        
                    </Button>
                </Card>
            </div>
            <Card style={{display: "inline-grid",width:"1200px"}} variant="outlined">
                {itemsToShow}
            </Card>
        </div>
    )
}