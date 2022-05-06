import { Button, Card, CardContent, Fab, Grid, Input, InputAdornment,  MenuItem, Select, Snackbar, TextField, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {itemTypesSelect,categoryList, genreList, footwearSizes, clothingSizes, conditions, colors } from "../data/itemPropertiesData";
const styles = {
    typographyFormat: {
        padding: "10px 20px",
        fontSize: "22px",
        float:"left"
    }as React.CSSProperties
  }
export default function AddItemPage() {

    let navigate = useNavigate(); 
    const handleGoHome = () =>{ 
      navigate("/home")
    }
    const [itemSubCategory, setItemSubCategory] = useState(0);
    const [itemCategory, setItemCategory] = useState("");
    const [itemGenre, setItemGenre] = useState("");
    const [itemSize, setItemSize] =useState("");
    const [itemFit, setItemFit] = useState("");
    const [itemCondition, setItemCondition] = useState("");
    const [itemTitle, setItemTitle] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemLocation, setItemLocation] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemColor, setItemColor] = useState("");
    const [snackOpened, setSnackOpened] = useState("");
    const [images, setImages] = useState([""])

    const onImageAdd = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            var newimages = [...images];
            newimages.push(URL.createObjectURL(event.target.files[0]))
            setImages(newimages);
        }
    }
    function handleDeleteImage(index: number){
        var newimages = [...images];
        newimages.splice(index,1);
        setImages(newimages);
    }

    const handleAddItem = async ()  =>{
        console.log("enter add item")
        console.log(images.length)
        var errors = verifyInputs();
        if(errors.length > 0){
            console.log("unverified");
            setSnackOpened(errors);
        }
    }
    const verifyInputs = () =>{
        var errors: string = "";
        if(itemCategory.length === 0 || itemSubCategory === 0 || images.length < 2 || 
            itemSize.length === 0 || itemDescription.length === 0 || 
            itemFit.length === 0 || itemPrice.length === 0 || itemTitle.length === 0 ||
            itemLocation.length === 0 || itemGenre.length === 0 || itemColor.length === 0){
            errors+="There are empty fields";
        }
        return errors;
      }
    return (
        <div style={{textAlign:"center"}}>
            <div style={{textAlign:"center",marginBottom:"20px"}}>
             <Fab onClick={handleGoHome} style={{marginLeft:"20px",backgroundColor:"#ff3333"}}>
                <ArrowBackIcon></ArrowBackIcon>
                </Fab>
            </div>
            <Card style={{display: "inline-grid",width:"700px"}} variant="outlined">
                <CardContent>
                    <div style={{display:"inline-block"}}>   
                        <Grid container spacing={1}>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat} noWrap>Title: </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <TextField variant="standard" onBlur={(event: { currentTarget: { value: string; }; }) => {
                                    setItemTitle(event.currentTarget.value);
                                }}/>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat} noWrap>Category: </Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <Select value={itemCategory}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemCategory(eventNr);}}>
                                {categoryList.map((item) => {
                                    return <MenuItem key={item} value={item}> {item}</MenuItem>})}
                            </Select>
                            <Select value={itemSubCategory} style={{marginLeft:"30px"}} onChange={event => {
                                    var eventNr = event.target.value as unknown as number;
                                    setItemSubCategory(eventNr);}}>
                                        {itemTypesSelect.filter((x) => x.category === itemCategory)
                                            .map((i) => {
                                                return (
                                                <MenuItem key={i.id} value={i.id} onClick={() => {setItemSubCategory(i.id)}}>
                                                    {i.name}
                                                </MenuItem>
                                            );})}
                            </Select>
                            </Grid>
                            <Grid item sm={6} >
                                <Typography style={styles.typographyFormat}>Genre:</Typography>
                            </Grid>
                            <Grid item sm={6} >
                            <Select value={itemGenre}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemGenre(eventNr);
                            }}>{(() => {
                                if(itemCategory === "Footwear"){
                                    return genreList.map((item) => {
                                        if(item!=="Unisex")
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else if(itemCategory === "Clothing"){
                                    return genreList.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else return;
                                })()}
                            </Select>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Size:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <Select value={itemSize}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemSize(eventNr);
                            }}> {(() => {
                                if (itemCategory === "Footwear"){
                                    var sizes = footwearSizes.filter((x) => x.genre == itemGenre)
                                    if(sizes.length === 0)
                                        return;
                                    else return sizes.map((item) => {
                                            return <MenuItem key={item.size} value={item.size}> {item.size}</MenuItem>
                                        })}
                                else if(itemCategory === "Clothing"){
                                    return clothingSizes.map((item) => {
                                        return <MenuItem key={item} value={item}> {item}</MenuItem>
                                    })
                                }else return;
                              })()}
                            </Select>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Fit:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Select value={itemFit}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemFit(eventNr);}}>
                                    {(() => {
                                        if (itemCategory === "Footwear"){
                                            return  footwearSizes.filter((x) => x.genre == itemGenre)
                                                .map((item) => {
                                                    return <MenuItem key={item.size} value={item.size}> {item.size}</MenuItem>
                                                })}
                                        else if(itemCategory === "Clothing"){
                                            return clothingSizes.map((item) => {
                                                return <MenuItem key={item} value={item}> {item}</MenuItem>
                                            })
                                        }else return;
                                    })()}
                                </Select>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Condition:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <Select value={itemCondition}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemCondition(eventNr);
                            }}>
                            {conditions.map((item) =>{
                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}</Select>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Color:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <Select value={itemColor}  onChange={event => {
                                    var eventNr = event.target.value as unknown as string;
                                    setItemColor(eventNr);
                            }}>
                            {colors.map((item) =>{
                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}</Select>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Price:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <Input  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    style={{width:"80px"}} onBlur={(event: { currentTarget: { value: string; }; }) => {
                                    setItemPrice(event.currentTarget.value);
                                }}/>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Photos:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Grid container>
                                {images.map((item,index) =>{
                                    if(item!=="")
                                    return <Grid item xs={4}style={{backgroundImage: `url(${item})`,backgroundSize:"cover",width:"100px", height:"100px"}}>
                                        <Fab color="secondary" size="small" component="span" style={{float:"right",width:"20px",height:"20px"}}
                                        variant="extended" onClick={() => {handleDeleteImage(index)}}>
                                    <DeleteIcon />
                                    </Fab>
                                    </Grid>
                                })}
                                </Grid>
                                <label>
                                <input type="file" onChange={onImageAdd} className="filetype" style={{display:"none"}}/>
                                    <Fab color="secondary" size="small" component="span"
                                        aria-label="add"variant="extended">
                                    <AddIcon />
                                    </Fab>
                                </label>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>Description:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <TextField variant="outlined" multiline rows={4} style={{width:"300px"}}
                                onBlur={(event: { currentTarget: { value: string; }; }) => {
                                    setItemDescription(event.currentTarget.value);
                                }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography style={styles.typographyFormat}>City:</Typography>
                            </Grid>
                            <Grid item sm={6}>
                            <TextField onBlur={(event: { currentTarget: { value: string; }; }) => {
                                    setItemLocation(event.currentTarget.value);
                                }}
                                />
                            </Grid>
                        </Grid>
                  </div>
                <Button onClick={handleAddItem} style={{marginTop:"10px"}} variant="contained" color="primary">Submit</Button>
                <Snackbar
                    open={snackOpened.length !== 0 ? true : false} autoHideDuration={3000} message={snackOpened}
                    anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={() => setSnackOpened("")}/>  
                </CardContent>
          </Card>
      </div>
    );
  }

  export {}
