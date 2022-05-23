import { Button, Card, Fab, Grid, Input, InputAdornment, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { clothingSizes, footwearSizes, genreList, outfitSeasonType, colorPalette, conditions } from "../data/itemPropertiesData";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { generateOutfit, outfitSelector } from "../features/OutfitSlice";
import MarketplacePostPreview from "./MarketplacePostPreview";
import { userSelector } from "../features/UserSlice";

const clothingSizesWithNone = [""].concat(clothingSizes);
const shoeSizesWithBlank = [{size:"",  genre:"", category:"", }].concat(footwearSizes)

export default function OutfitGeneratorPage(){

    const dispatch = useAppDispatch();

    const [priceValue, setPriceValue] = useState("");
    const [outfitSeasonValue, setOutfitSeasonValue] = useState("")
    const [genreValue, setGenreValue] = useState("");
    const [clothingSizeValue, setClothingSizeValue] = useState("");
    const [shoeSizeValue, setShoeSizeValue] = useState("");
    const [colorPaletteValue, setColorPaletteValue] = useState("");
    const [conditionValue, setConditionValue] = useState("");
    
    const [outfit,setOutfit] = useState(useAppSelector(outfitSelector));
    const user = useAppSelector(userSelector)
    console.log(outfit)
    let navigate = useNavigate(); 

    const handleGenerateOutfit = async () =>{
        var postId = "0";
        console.log("sending")
        var priceConverted = !isNaN(+priceValue) === true ? Number(priceValue) : 0
        const response = await dispatch(generateOutfit({userId:user.id,condition:conditionValue, maximumValue: priceConverted,
            season: outfitSeasonValue, genre: genreValue, shoeSize: shoeSizeValue, clothingSize: clothingSizeValue,
            colorPalette: colorPaletteValue, postId: postId 
        }))
        setOutfit(response.payload)
    }

    const outfitSection = () =>{
       return(<Grid container>
            {outfit.components.map((comp) =>{
            if(comp.post !== null && comp.post !==undefined)
            return (<Grid item xs={6} style={{width:450,height:450}} key={comp.post.id}>
                <MarketplacePostPreview post={comp.post} user={user} dialogOpen={() => {}} ></MarketplacePostPreview>
        </Grid>)
        else return <></>
        })}
           </Grid>
           )
    }

    return (<div style={{textAlign:"center",width:"fit-content",margin:"50px auto"}}>
         <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={() => {navigate("/home")}} style={{backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
        <Card style={{justifyContent:"center",textAlign:"center"}}>
            <Grid container>
                <Grid item xs={4} container style={{border:"1px solid"}}>
                    <Grid item sm={9} style={{marginTop:"3%"}}>
                        <Typography >Maximum cost:</Typography>
                    </Grid>
                    <Grid item sm={3}>
                    <Input  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            style={{width:"70px",float:"left",marginLeft:"-90%",marginTop:"2%"}} 
                            onBlur={(event: { currentTarget: { value: string; }; }) => {
                                setPriceValue(event.currentTarget.value);
                            }}/>
                    </Grid>
                    <Grid item xs={12} container style={{marginTop:"7%"}}>
                        <Grid item xs={12}>
                            <Typography>Condition:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <ToggleButtonGroup color="primary" value={conditionValue} exclusive
                            onChange={(event: React.MouseEvent<HTMLElement>, newCondition: string) =>{setConditionValue(newCondition)}}>
                            {(() =>  
                            conditions.map((condition) => {
                                return ( <ToggleButton value={condition}>{condition}</ToggleButton> )
                            })
                        )()}
                        </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} container style={{marginTop:"7%"}}>
                        <Grid item xs={12} style={{marginBottom:"1%"}}>
                            <Typography >Interested in a special season? </Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <ToggleButtonGroup color="primary" value={outfitSeasonValue} exclusive
                            onChange={(event: React.MouseEvent<HTMLElement>, newType: string) =>{setOutfitSeasonValue(newType)}}>
                            {(() =>  
                                outfitSeasonType.map((season) => {
                                    return ( <ToggleButton value={season}>{season}</ToggleButton> )
                                })
                            )()}
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>  
                    <Grid item xs={12} style={{marginTop:"7%"}}>
                        <Typography>Specified genre </Typography>
                        <ToggleButtonGroup color="primary" value={genreValue} exclusive
                            onChange={(event: React.MouseEvent<HTMLElement>, newGenre: string) =>{setGenreValue(newGenre)}}>
                            {(() =>  
                            genreList.map((genre) => {
                                return ( <ToggleButton value={genre}>{genre}</ToggleButton> )
                            })
                        )()}
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12} style={{marginTop:"7%"}}>
                        <Typography>Clothing size:   
                            <Select value={clothingSizeValue} style={{marginLeft:"5%"}} 
                                    onChange={event => {
                                        var eventNr = event.target.value as unknown as string;
                                        setClothingSizeValue(eventNr);
                                    }}> 
                                    {(() => {
                                        return clothingSizesWithNone.map((item) => {
                                            return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                })()}
                            </Select>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop:"7%"}}>
                        <Typography>Shoe size:   
                            <Select value={shoeSizeValue} style={{marginLeft:"5%"}} 
                                    onChange={event => {
                                        var eventNr = event.target.value as unknown as string;
                                        setShoeSizeValue(eventNr);
                                    }}> 
                                    {(() => {
                                        return shoeSizesWithBlank.map((item) => {
                                            return <MenuItem key={item.size} value={item.size}> {item.genre + "'s " +item.size}</MenuItem>
                                    })
                                })()}
                            </Select>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop:"7%"}}>
                        <Typography> Color palette: </Typography>
                            <ToggleButtonGroup color="primary" value={colorPaletteValue} exclusive
                                onChange={(event: React.MouseEvent<HTMLElement>, newColor: string) =>{setColorPaletteValue(newColor)}}>
                                {(() =>  
                                colorPalette.map((cp) => {
                                    return ( <ToggleButton value={cp}>{cp}</ToggleButton> )
                                })
                            )()}
                            </ToggleButtonGroup>
                    </Grid>
                </Grid>
                <Grid item xs={8} container style={{border:"1px solid"}}>
                   {outfitSection()}
                </Grid>
            </Grid>
        </Card>
        <div style={{marginTop:"1%"}}>
            <Button variant="contained" color="primary" onClick={handleGenerateOutfit}>Generate</Button>
            </div>
    </div>)
}