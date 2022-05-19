import { Button, Card, Fab, Grid, Input, InputAdornment,  MenuItem, Select, Snackbar, TextField, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { itemTypesSelect, categoryList, genreList, footwearSizes, clothingSizes, conditions, colors } from "../data/itemPropertiesData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addItemToMarketplace } from "../features/MarketplaceSlice";
import { addPostReducer, userSelector } from "../features/UserSlice";
import { Post } from "./types";
import { unwrapResult } from "@reduxjs/toolkit";
const styles = {

    typographyFormat: {
        padding: "10px 15px",
        fontSize: "22px",
        float:"left"
    }as React.CSSProperties,
    gridFormat:{
        border:"1px solid",
        marginTop:"-1px",
        padding:"10px 15px"
    }as React.CSSProperties
  }
export default function AddItemPage() {

    const dispatch = useAppDispatch();
    let navigate = useNavigate(); 
    
    const handleGoHome = () =>{ 
      navigate("/home")
    }

    const [categoryValue, setCategoryValue] = useState("");
    const [typeValue, setTypeValue] = useState("");
    const [genreValue, setGenreValue] = useState("");
    const [sizeValue, setSizeValue] =useState("");
    const [fitValue, setFitValue] = useState("");
    const [conditionValue, setConditionValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [priceValue, setPriceValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [colorValue, setColorValue] = useState("");
    const [snackOpened, setSnackOpened] = useState("");
    const [images, setImages] = useState<Blob[]>([])
    const [brandValue, setBrandValue] = useState("");
    const user = useAppSelector(userSelector)

    const convertAllImagesToBase64 =  async () =>{
        var encodedImages: string[]= [];
        for (const image of images) {
            const base64 = await convertBase64(image) as string;
            encodedImages.push(base64);
        }
        return encodedImages;
    }

    const convertBase64 = async (file: Blob) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
      };

    const onImageAdd = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            var newimages = [...images];
            newimages.push(event.target.files[0])
            setImages(newimages);
        }
    }

    function handleDeleteImage(index: number){
        var newimages = [...images];
        newimages.splice(index,1);
        setImages(newimages);
    }

    function handleChangeTypeValue(type: string){
        setTypeValue(type);
        setCategoryValue("");
        setSizeValue("");
        setFitValue("");
    }
    const handleAddItem = async ()  =>{
        
        var errors = verifyInputs();
        if(errors.length > 0){
            setSnackOpened(errors);
        }else {
            try{
                var convertedImages = await convertAllImagesToBase64();
                const response = await dispatch(addItemToMarketplace({
                    item: { name: nameValue, type: typeValue, category: categoryValue,
                        genre: genreValue, size: sizeValue, fit: fitValue,
                        condition: conditionValue, price: Number(priceValue),
                        color: colorValue, images: convertedImages, brand:brandValue
                    },
                    description: descriptionValue, cityLocation: locationValue, userId: user.id
                }))
                const post = unwrapResult(response) as Post
                setSnackOpened("Item has been successfuly posted!\n Now you will be redirected to home.");
                dispatch(addPostReducer(post))
                setTimeout( () => { navigate("/home") },4000)
                }catch (err) {
                    setSnackOpened(err as string)
            } 
        }
   }
    const verifyInputs = () =>{
        var errors: string = "";
        if(typeValue.length === 0 || categoryValue.length === 0 || images.length === 0 ||  sizeValue.length === 0 || 
            descriptionValue.length === 0 || fitValue.length === 0 || priceValue.length === 0 ||
            nameValue.length === 0 || locationValue.length === 0 || genreValue.length === 0 || colorValue.length === 0)
            errors+="There are empty fields. ";
        
        if(nameValue.length > 60)
            errors+="Name too long, cannot exceed 60 characters. "
        if(images.length < 2)
            errors+="You must upload at least 2 photos. "
        if(Number(priceValue) <= 0)
            errors+="Invalid price. "
        return errors;
      }

    return (
        <div style={{textAlign:"center"}}>
            <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <Card style={{display: "inline-grid",width:"800px",border:"1px solid"}} variant="outlined">
                    <div style={{display:"inline-block"}}>
                        <Grid container spacing={1}>
                            <Grid item xs={6} container  style={styles.gridFormat}>
                                <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat} noWrap>Name: </Typography>
                                </Grid>
                                <Grid item sm={9}>
                                    <TextField variant="standard" style={{float:"left",width:250}}
                                    onBlur={(event: { currentTarget: { value: string; }; }) => {
                                        setNameValue(event.currentTarget.value);
                                    }}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                            <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat} noWrap>Brand: </Typography>
                                </Grid>
                                <Grid item sm={9}>
                                    <TextField variant="standard" style={{float:"left",width:150,marginLeft:"20px"}}
                                    onBlur={(event: { currentTarget: { value: string; }; }) => {
                                        setBrandValue(event.currentTarget.value);
                                    }}/>
                                </Grid>
                            </Grid>
                            <Grid item sm={6} container style={styles.gridFormat}>
                                <Grid item xs={4}>
                                    <Typography style={styles.typographyFormat} noWrap>Category: </Typography>
                                </Grid>
                                <Grid item xs={8} style={{marginTop:"10px",display:"flex"}} >
                                    <Select value={typeValue} style={{height:30}} onChange={event => {
                                        var eventNr = event.target.value as unknown as string;
                                        handleChangeTypeValue(eventNr);}}>
                                        {categoryList.map((item) => {
                                            return <MenuItem key={item} value={item}> {item}</MenuItem>})}
                                    </Select>
                                    <Select value={categoryValue} style={{marginLeft:"30px",height:30}} 
                                        onChange={event => {
                                            var eventNr = event.target.value as unknown as string;
                                            setCategoryValue(eventNr);}}>
                                                {itemTypesSelect.filter((x) => x.category === typeValue)
                                                    .map((i) => {
                                                        return (
                                                        <MenuItem key={i.name} value={i.name} onClick={() => {setCategoryValue(i.name)}}>
                                                            {i.name}
                                                        </MenuItem>
                                                );})}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid item sm={6} container style={styles.gridFormat}>
                                <Grid item xs={3}>
                                    <Typography style={styles.typographyFormat}>Genre:</Typography>
                                </Grid>
                                <Grid item xs={9} style={{display:"flex"}}>
                                    <Select value={genreValue} style={{marginTop:"10px",marginLeft:"10%",height:30}}
                                            onChange={event => {
                                                var eventNr = event.target.value as unknown as string;
                                                setGenreValue(eventNr);
                                                }}>{(() => {
                                            if(typeValue === "Footwear"){
                                                return genreList.map((item) => {
                                                    if(item!=="Unisex")
                                                    return <MenuItem key={item} value={item}> {item}</MenuItem>
                                                })
                                            }else if(typeValue === "Clothing"){
                                                return genreList.map((item) => {
                                                    return <MenuItem key={item} value={item}> {item}</MenuItem>
                                                })
                                            }else return;
                                            })()}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={2}>
                                    <Typography style={styles.typographyFormat}>Size:</Typography>
                                </Grid>
                                <Grid item sm={10}  style={{marginTop:"10px"}}>
                                    <Select value={sizeValue} style={{float:"left",marginLeft:"5%"}} onChange={event => {
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
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={2} >
                                    <Typography style={styles.typographyFormat}>Fit:</Typography>
                                </Grid>
                                <Grid item sm={10}  style={{marginTop:"10px"}}>
                                    <Select value={fitValue} style={{float:"left"}} onChange={event => {
                                        var eventNr = event.target.value as unknown as string;
                                        setFitValue(eventNr);}}>
                                        {(() => {
                                            if (typeValue === "Footwear"){
                                                return  footwearSizes.filter((x) => x.genre === genreValue)
                                                    .map((item) => {
                                                        return <MenuItem key={item.size} value={item.size}> {item.size}</MenuItem>
                                                    })}
                                            else if(typeValue === "Clothing"){
                                                return clothingSizes.map((item) => {
                                                    return <MenuItem key={item} value={item}> {item}</MenuItem>
                                                })
                                            }else return;
                                        })()}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={2}>
                                    <Typography style={styles.typographyFormat}>Condition:</Typography>
                                </Grid>
                                <Grid item sm={10}  style={{marginTop:"10px"}}>
                                    <Select value={conditionValue} style={{float:"left",marginLeft:"30%"}}
                                            onChange={event => {
                                                var eventNr = event.target.value as unknown as string;
                                                setConditionValue(eventNr);}}>
                                                {conditions.map((item) =>{
                                                    return <MenuItem key={item} value={item}>{item}</MenuItem>
                                                })}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat}>Price:</Typography>
                                </Grid>
                                <Grid item sm={9} style={{marginTop:"10px"}}>
                                    <Input startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        style={{width:"80px",float:"left",marginLeft:"5%"}} 
                                        onBlur={(event: { currentTarget: { value: string; }; }) => {
                                            setPriceValue(event.currentTarget.value);
                                        }}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={12}>
                                    <Typography style={styles.typographyFormat}>Color:</Typography>
                                        <Select value={colorValue} style={{float:"left",marginTop:"10px",marginLeft:"5%"}}
                                                onChange={event => {
                                                    var eventNr = event.target.value as unknown as string;
                                                    setColorValue(eventNr);
                                                }}>
                                        {colors.map((item) =>{
                                            return <MenuItem key={item} value={item}>{item}</MenuItem>
                                        })}
                                        </Select>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container style={styles.gridFormat}>
                                <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat}>City:</Typography>
                                </Grid>
                                <Grid item sm={9} >
                                    <TextField  style={{float:"left",marginTop:"10px"}} 
                                                onBlur={(event: { currentTarget: { value: string; }; }) => {
                                                    setLocationValue(event.currentTarget.value); }} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container style={styles.gridFormat}>
                                <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat}>Description:</Typography>
                                </Grid>
                                <Grid item sm={9} >
                                    <TextField variant="outlined" multiline rows={4} style={{width:"600px",float:"left"}}
                                        onBlur={(event: { currentTarget: { value: string; }; }) => {
                                            setDescriptionValue(event.currentTarget.value);
                                        }}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container style={{padding:"10px 15px", border:"1px solid", marginTop:"-1px",minHeight:"128px"}}>
                                <Grid item sm={3}>
                                    <Typography style={styles.typographyFormat}>Photos:</Typography>
                                    <label>
                                        <input type="file" onChange={onImageAdd} className="filetype" style={{display:"none"}}/>
                                            <Fab color="secondary" size="small" component="span" style={{marginTop:"10px"}}
                                                aria-label="add"variant="extended">
                                            <AddIcon />
                                            </Fab>
                                    </label>
                                </Grid>
                                <Grid item sm={9}>
                                    <Grid container>
                                        {images.map((item,index) =>{
                                            return <Grid item xs={3} style={{backgroundImage: `url(${URL.createObjectURL(item)})`,backgroundSize:"100% 100%",imageRendering:"-webkit-optimize-contrast",width:"128px", height:"128px"}}>
                                                        <Fab color="secondary" size="small" component="span" 
                                                            style={{float:"right",width:"20px",height:"20px"}}
                                                            variant="extended" onClick={() => {handleDeleteImage(index)}}>
                                                            <DeleteIcon />
                                                        </Fab>
                                                    </Grid>
                                        })}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                  </div>
                <Button onClick={handleAddItem} style={{padding:0,height:40}} variant="contained" color="primary">Submit</Button>
                <Snackbar open={snackOpened.length !== 0 ? true : false} autoHideDuration={3000} message={snackOpened}
                    anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={() => setSnackOpened("")}/>  
          </Card>
      </div>
    );
  }

  export {}
