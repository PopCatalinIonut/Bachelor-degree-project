import { MenuList, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout} from "../../features/slices/UserSlice";
import ProfilePage from "./ProfilePage";
import MarketplacePage from "./MarketplacePage";
import OutfitGeneratorPage from "./OutfitGeneratorPage";
import ChatPage from "./ChatPage";
import AddItemPage from "./AddItemPage";
import WishlistPage from "./WishlistPage";
import { setMessageSliceInitialized } from "../../features/slices/MessageSlice";
import { useState } from "react";
const styles = {
  menuItem: {
    borderLeft:"1px solid white",
    borderRight:"1px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  }as React.CSSProperties,
  menuItemLeft:{
    borderLeft:"2px solid white",
    borderRight:"1px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  } as React.CSSProperties,
  menuItemRight:{
    borderLeft:"1px solid white",
    borderRight:"2px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  } as React.CSSProperties,
}
type LocationState = {
  key: string
}
export default function HomePage() {

  const dispatch = useAppDispatch();
  let navigate = useNavigate(); 
  const [menuKey,setMenuKey] = useState("");
    const handleLogout = () =>{ 
    dispatch<any>(logout());
    dispatch(setMessageSliceInitialized(false));
    navigate("/")
  }
  const location = useLocation();
  console.log(menuKey)
  const pageContent = () =>{
    
    if(location.state !== null){
      const {key} = location.state as LocationState;
      if(key !== menuKey)
        setMenuKey(key);
      switch(key){
        case "marketplace": return <MarketplacePage></MarketplacePage>
        case "outfit": return <OutfitGeneratorPage></OutfitGeneratorPage>
        case "chat": return <ChatPage></ChatPage>
        case "addItem": return <AddItemPage></AddItemPage>
        case "wishlist": return <WishlistPage></WishlistPage>
        case "profile": return <ProfilePage></ProfilePage>
      }
    }
  }

  return (
    <div style={{textAlign:"center"}}>
        <div style={{background:"rgb(102,0,204)",height:40}}>   
            <MenuList variant="selectedMenu"
            style={{minHeight:70,display:"flex",width:"100%",textAlign:"center",justifyContent:"center",color:"white",paddingTop:0}}>
                <MenuItem style={styles.menuItemLeft} selected={menuKey === "profile"} onClick={() => {navigate("/home",{state:{key:"profile"}})}}>Profile</MenuItem>
                <MenuItem style={styles.menuItem} selected={menuKey === "wishlist"} onClick={() => {navigate("/home",{state:{key:"wishlist"}})}}>Wishlist</MenuItem>
                <MenuItem style={styles.menuItem} selected={menuKey === "marketplace"} onClick={() => {navigate("/home",{state:{key:"marketplace"}})}}>Marketplace</MenuItem>
                <MenuItem style={styles.menuItem} selected={menuKey === "outfit"} onClick={() => {navigate("/home",{state:{key:"outfit"}})}}>Looking for an outfit?</MenuItem>
                <MenuItem style={styles.menuItem} selected={menuKey === "chat"} onClick={() => {navigate("/home",{state:{key:"chat"}})}}>Chat</MenuItem>
                <MenuItem style={styles.menuItemRight} selected={menuKey === "addItem"} onClick={() => {navigate("/home",{state:{key:"addItem"}})}}>Want to sell something?</MenuItem>
            </MenuList>
            <MenuItem onClick={handleLogout} style={{position:"absolute",height:40,
                right:0,top:0,color:"white",borderLeft:"2px solid white",padding:10 }}>Log out
            </MenuItem>
        </div> 
        {pageContent()}
    </div>
  );
}