import { Button, Dialog, Grid, Input, InputAdornment, MenuItem, Select, Snackbar, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useState } from "react";
import { clothingSizes, footwearSizes, genreList, outfitSeasonType, colorPalette, conditions } from "../../data/itemPropertiesData";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { generateOutfit, itemToGenerateWithSelector, outfitSelector, succesSelector } from "../../features/slices/OutfitSlice";
import { userSelector } from "../../features/slices/UserSlice";
import OutfitGeneratorPostPreview from "../OutfitGeneratorPostPreview";
import { Outfit, OutfitComponent, Post, PostUserDetails } from "../types";
import PostDetailsDialog from "../PostDetailsDialog";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

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
    const [errorSnackOpened, setErrorSnackOpened] = useState(false);
    const [firstOpen, setFirstOpen] = useState(0);

    const outfit: Outfit = useAppSelector(outfitSelector);
    var selectedItem = useAppSelector(itemToGenerateWithSelector);
    const user = useAppSelector(userSelector)
    const succes = useAppSelector(succesSelector)

    const handleGenerateOutfit = async () =>{
        try{
            var priceConverted = !isNaN(+priceValue) === true ? Number(priceValue) : 0
            var postId = selectedItem.post !== null ? selectedItem.post.id : 0;
            const response = await dispatch(generateOutfit({userId:user.id,condition:conditionValue, maximumValue: priceConverted,
                season: outfitSeasonValue, genre: genreValue, shoeSize: shoeSizeValue, clothingSize: clothingSizeValue,
                colorPalette: colorPaletteValue, postId: postId.toString()
            }))
            if(response.payload !== undefined)
                setFirstOpen(firstOpen+1)
                
        }catch (err) {
            console.log(err)
            setErrorSnackOpened(true);
          }
    }
    const outfitSection = () =>{
        var components: OutfitComponent[] = [];
        components = outfit.components
        var containsElements = false;
        components.forEach(x => x.post!==null ? containsElements = true : 0)

        if(firstOpen !== 0 )  {
            if(succes === false && selectedItem.post === null && containsElements === false)
                return (<div style={{paddingLeft:20,paddingRight:20}}>
                            <Typography style={{fontWeight:900}}> We couln't find an outfit matching your criteria! </Typography>
                            <Typography style={{fontWeight:900}}> Try removing some filters. </Typography>
                            <ErrorOutlineOutlinedIcon style={{height:150,width:150}}/>
                        </div>)
            else 
                return (<div>
                            <ShowItem post={components.find(x => x.type === "Top")} type={"Top"} user={user} selectedItem={selectedItem} firstOpen={firstOpen}></ShowItem>
                            <ShowItem post={components.find(x => x.type === "Pants")} type={"Pants"} user={user} selectedItem={selectedItem} firstOpen={firstOpen} ></ShowItem>
                            <ShowItem post={components.find(x => x.type === "Footwear")} type={"Footwear"} user={user} selectedItem={selectedItem} firstOpen={firstOpen}></ShowItem>
                        </div>)
        }else 
            return  <div>
                        <ShowItem post={components.find(x => x.type === "Top")} type={"Top"} user={user} selectedItem={selectedItem} firstOpen={firstOpen}></ShowItem>
                        <ShowItem post={components.find(x => x.type === "Pants")} type={"Pants"} user={user} selectedItem={selectedItem} firstOpen={firstOpen}></ShowItem>
                        <ShowItem post={components.find(x => x.type === "Footwear")} type={"Footwear"} user={user} selectedItem={selectedItem} firstOpen={firstOpen}></ShowItem>
                    </div>
        
    }
    return ( <div style={{textAlign:"center",height:"95vh"}}>
            <Grid container style={{textAlign:"center",justifyContent:"center"}}>
                <Grid item xs={7} container style={{borderLeft:"1px solid",borderTop:"1px solid",borderBottom:"1px solid",maxWidth:500,height:"inherit",minHeight:"90vh"}}>
                    <Grid item xs={12} style={{marginTop:"3%",display:"flex",textAlign:"center",justifyContent:"center"}}>
                        <Typography style={{paddingTop:15}}>Budget:</Typography>
                        <Input  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                style={{width:"70px",marginLeft:"3%",height:20,marginTop:"3%"}} 
                                onBlur={(event: { currentTarget: { value: string; }; }) => {
                                    setPriceValue(event.currentTarget.value);
                                }}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Condition</Typography>
                        <ToggleButtonGroup color="primary" value={conditionValue} exclusive style={{maxWidth:350,fontSize:10}}
                            onChange={(event: React.MouseEvent<HTMLElement>, newCondition: string) =>{setConditionValue(newCondition)}}>
                                {(() =>  
                                conditions.map((condition) => {
                                    return ( <ToggleButton style={{fontSize:13}} value={condition}>{condition}</ToggleButton> )
                                })
                                )()}
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item sm={12} style={{marginBottom:"1%"}}>
                        <Typography>Specified season</Typography>
                        <ToggleButtonGroup color="primary" value={outfitSeasonValue} exclusive
                            onChange={(event: React.MouseEvent<HTMLElement>, newType: string) =>{setOutfitSeasonValue(newType)}}>
                                {(() =>  
                                    outfitSeasonType.map((season) => {
                                        return ( <ToggleButton style={{fontSize:13}} value={season}>{season}</ToggleButton> )
                                    })
                                )()}
                        </ToggleButtonGroup>
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography>Specified genre </Typography>
                        <ToggleButtonGroup color="primary" value={genreValue} exclusive
                            onChange={(event: React.MouseEvent<HTMLElement>, newGenre: string) =>{setGenreValue(newGenre)}}>
                            {(() =>  
                            genreList.map((genre) => {return (<ToggleButton style={{fontSize:13}} value={genre}>{genre}</ToggleButton>)})
                            )()}
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Clothing size:   
                            <Select value={clothingSizeValue} style={{marginLeft:"3%"}} 
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
                    <Grid item xs={12}>
                        <Typography>Shoe size:   
                            <Select value={shoeSizeValue} style={{marginLeft:"3%"}} 
                                    onChange={event => {
                                        var eventNr = event.target.value as unknown as string;
                                        setShoeSizeValue(eventNr);
                                    }}> 
                                    {(() => {
                                        return shoeSizesWithBlank.map((item) => {
                                            return <MenuItem key={item.size} value={item.size}> {item.genre + " " +item.size}</MenuItem>
                                        })
                                    })()}
                            </Select>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography> Color palette </Typography>
                            <ToggleButtonGroup color="primary" value={colorPaletteValue} exclusive
                                onChange={(event: React.MouseEvent<HTMLElement>, newColor: string) =>{setColorPaletteValue(newColor)}}>
                                {(() =>  
                                colorPalette.map((cp) => {
                                    return ( <ToggleButton style={{fontSize:13}} value={cp}>{cp}</ToggleButton> )
                                    })
                                )()}
                            </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained"  color="primary" onClick={handleGenerateOutfit}>Generate</Button>
                    </Grid>
                </Grid>
                <Grid item xs={5} container style={{border:"1px solid",display:"grid",maxWidth:"fit-content",alignContent:"center"}}>
                   {outfitSection()}
                </Grid>
            </Grid>
        <Snackbar
          open={errorSnackOpened} autoHideDuration={3000} message="There was an error"
          anchorOrigin={{vertical: "top", horizontal: "center"}}/>
    </div>)
}

export interface ShowItemProps{
    post: OutfitComponent | undefined,
    type: string,
    user: PostUserDetails,
    selectedItem: OutfitComponent,
    firstOpen: number
}

export function ShowItem(props: ShowItemProps){  
    const [dialogPost, setDialogPost] = useState(<div></div>);
    const handleDialogOpen = (post:Post) => {
        if(post !== null && post !== undefined){
            setDialogPost(
                <div>
                    <Dialog fullWidth maxWidth={false} style={{width:1200,position:"absolute",top:"5%",left:"10%"}}  open={true} onClose={handleDialogClose}>
                        <PostDetailsDialog post={post} dialogClose={handleDialogClose} />
                    </Dialog>
                </div>
            );
        }
           
    };

    const handleDialogClose = () =>{ setDialogPost(<div></div>) }
    
    if (props.post !== undefined && props.post.post !== null )
        return (<Grid item xs={12} style={{height:"31.5vh",width:"33.3vw"}} key={props.post.post.id}>
                    <OutfitGeneratorPostPreview post={props.post.post} user={props.user}  isDeletable={props.selectedItem.post?.id === props.post.post.id}
                        dialogOpen={handleDialogOpen}/>
                    {dialogPost}
                </Grid>)
    else if(props.selectedItem.post !== null && props.selectedItem.type !== props.type && props.firstOpen !== 0) 
            return (<Grid item xs={12} style={{display:"grid",textAlign:"center",width:"inherit",height:230,alignContent:"center"}}>
                        <Typography style={{fontWeight:900}}>{"We couldn't find any " + props.type + " matching your criteria!"}</Typography>
                    </Grid>)
        else 
        return (<Grid item xs={12} style={{display:"grid",textAlign:"center",width:"inherit",height:230,alignContent:"center"}}>
            </Grid>)
}